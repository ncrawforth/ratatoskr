spinner.start();

// Dynamically load postal-mime.js
if (typeof postalMime == "undefined") {
  await new Promise(function(resolve, reject) {
    let s = document.createElement("script");
    s.onload = resolve;
    s.src = "/_client/thirdparty/postal-mime.min.js";
    document.head.appendChild(s);
  });
}

// Dynamically load purify.js
if (typeof DOMPurify == "undefined") {
  await new Promise(function(resolve, reject) {
    let s = document.createElement("script");
    s.onload = resolve;
    s.src = "/_client/thirdparty/purify.min.js";
    document.head.appendChild(s);
  });
}

function formatAddress(address) {
  let a = document.createElement("span");
  if (address.name) {
    a.innerText = `${address.name} <${address.address}>`;
  } else {
    a.innerText = address.address;
  }
  return a;
}

function formatAddresses(addresses) {
  let parts = [];
  let processAddress = (address, partCounter) => {
    if (partCounter) {
      let sep = document.createElement("span");
      sep.textContent = ", ";
      parts.push(sep);
    }
    if (address.group) {
      let groupStart = document.createElement("span");
      let groupEnd = document.createElement("span");
      groupStart.textContent = `${address.name}:`;
      groupEnd.textContent = `;`;
      parts.push(groupStart);
      address.group.forEach(processAddress);
      parts.push(groupEnd);
    } else {
      parts.push(formatAddress(address));
    }
  }
  addresses.forEach(processAddress);
  let result = document.createDocumentFragment();
  parts.forEach(function(part) {
    result.appendChild(part);
  });
  return result;
}

let parser = new postalMime.default();
let f = await fetch(href);
let email = await parser.parse(await f.text());
console.log(email);

style.maxWidth = "960px";
style.margin = "auto";
style.paddingBottom = "3em";
innerHTML = `
  <div id="subject_container" style="margin: 0.6em;"><h3 id="subject_content"></h3></div>
  <table style="font-size: small;"><tr></tr>
    <tr id="from_container"><td style="font-weight: bold;">From:</td><td id="from_content" style="width: 100%;"></td></tr>
    <tr id="to_container"><td style="font-weight: bold;">To:</td><td id="to_content" style="width: 100%;"></td></tr>
    <tr id="cc_container"><td style="font-weight: bold;">CC:</td><td id="cc_content" style="width: 100%;"></td></tr>
    <tr id="date_container"><td style="font-weight: bold;">Date:</td><td id="date_content" style="width: 100%;"></td></tr>
    <tr id="attachments_container"><td style="font-weight: bold;">Attachments:</td><td id="attachments_content" style="width: 100%;"></td></tr>
  </table>
  <div id="html_content" style="padding: 0.6em;"></div>
  <div id="text_container"><pre id="text_content" style="padding: 0.6em;"></pre></div>
`;

if (email.subject) {
  subject_content.textContent = email.subject
} else {
  subject_container.remove();
}

if (email.from) {
  from_content.appendChild(formatAddress(email.from))
} else {
  from_container.remove();
}

if (email.to && email.to.length){
  to_content.appendChild(formatAddresses(email.to))
} else {
  to_container.remove();
}

if (email.cc && email.cc.length){
  cc_content.appendChild(formatAddresses(email.cc))
} else {
  cc_container.remove();
}

if (email.date) {
  let date = new Date(email.date);
  date_content.innerText = date.getDate() + " " + date.toLocaleString("default", {month: "long"}) + " " + date.getFullYear() + ", " + date.toLocaleTimeString();
} else {
  date_container.remove();
}

if (email.attachments && email.attachments.length) {
  email.attachments.forEach(function(attachment) {
    const attachmentLink = document.createElement("a");
    attachmentLink.href = URL.createObjectURL(new Blob([attachment.content], {type: attachment.mimeType}));
    attachmentLink.download = attachment.filename || "attachment";
    attachmentLink.innerText = attachment.filename || `attachment (${attachment.mimeType})`;
    attachmentLink.style.display = "block";
    attachments_content.appendChild(attachmentLink);
  });
} else {
  attachments_container.remove();
}

if (email.html) {
  html_content.innerHTML = DOMPurify.sanitize(email.html);
  text_container.remove();
} else if (email.text) {
  text_content.innerText = email.text;
}

spinner.stop();
