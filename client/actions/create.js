let header = document.createElement("header");
header.innerText = "Create";
appendChild(header);

let content = document.createElement("section");
content.innerText = "Create a new:";
appendChild(content);

let select = document.createElement("select");
select.style.marginBottom = "1rem";
content.appendChild(select);

let options = [];
try {
  let req = new XMLHttpRequest();
  await new Promise(function(resolve, reject) {
    req.open("PROPFIND", "/Templates/"); 
    req.setRequestHeader("Depth", 1);
    req.onload = resolve; req.onerror = reject;
    req.send();
  });
  for (let e of req.responseXML.getElementsByTagName("href")) {
    let href = e.firstChild.nodeValue;
    if (!href.endsWith("/")) {
      let name = hreftoname(href);
      options.push({name: name.replace(/\.[^.]*$/, ""), ext: name.replace(/.*\./, "."), href: href});
    }
  }
} catch (e) {}
options.push({name: "Folder"});
for (let option of options) {
  option.option = document.createElement("option");
  option.option.innerText = option.name;
  select.appendChild(option.option);
}
options[0].option.selected = true;

let input = document.createElement("input");
input.placeholder = "name";
content.appendChild(input);
input.onkeyup = function(e) {
  if (e.keyCode == 13) {
    e.preventDefault();
    confirm.click();
  }
};

let footer = document.createElement("footer");
appendChild(footer);

let confirm = document.createElement("button");
confirm.className = "success";
confirm.innerText = "Create";
footer.appendChild(confirm);

let cancel = document.createElement("button");
cancel.className = "dangerous";
cancel.innerText = "Cancel";
footer.appendChild(cancel);

let destination = "";
while (destination.length == 0) {
  input.focus();
  await new Promise(function(resolve, reject) {
    cancel.onclick = reject;
    confirm.onclick = resolve;
  });
  destination = encodeURIComponent(input.value.replace(/^\.*/, "").replace(/[/?:]/g, "_"));
}

content.innerText = "Creating \"" + hreftoname(destination) + "\"...";
footer.innerText = "";

let f;
for (let option of options) {
  if (option.option.selected) {
    if (option.href) {
      f = await fetch(option.href, {method: "COPY", headers: {"Destination": location.pathname + destination + option.ext, "Overwrite": "F"}});
    } else {
      f = await fetch(destination, {method: "MKCOL"});
    }
    break;
  }
}

if (!f.ok) {
  if (f.status == 412) {
    content.innerText = "A file or folder with that name already exists";
  } else {
    content.innerText = "An error occurred while creating: " + f.status + " " + f.statusText;
  }
  let close = document.createElement("button");
  close.className = "dangerous";
  close.innerText = "Close";
  footer.appendChild(close);
  await new Promise(function(resolve, reject) {
    close.onclick = resolve;
  });
}
