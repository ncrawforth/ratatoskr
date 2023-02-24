await new Promise(async function(resolve, reject) {
  spinner.start();
  
  let header = document.createElement("header");
  header.innerText = "Send";
  appendChild(header);

  let content = document.createElement("section");
  appendChild(content);

  if (!href.endsWith("/")) {
    let f = await fetch(href, {method: "HEAD"});
    if (f.ok) {
      let p = document.createElement("p");
      p.innerText = "Shareable link:";
      content.appendChild(p);
      let d = document.createElement("div");
      d.style.position = "relative";
      d.style.marginBottom = "0.8em";
      content.appendChild(d);
      let input = document.createElement("input");
      input.style.cursor = "copy";
      input.style.userSelect = "none";
      let etag = f.headers.get("ETag");
      input.value = new URL(href + "?" + etag, location.href).href;
      input.readOnly = true;
      d.appendChild(input);
      let overlay = document.createElement("input");
      overlay.style.position = "absolute";
      overlay.style.left = "0";
      overlay.style.top = "0";
      overlay.style.opacity = "0";
      overlay.style.transition = "opacity 0.3s";
      overlay.style.pointerEvents = "none";
      overlay.style.userSelect = "none";
      overlay.value = "Copied to clipboard";
      overlay.readOnly = true;
      d.appendChild(overlay);
      input.onclick = async function() {
        navigator.clipboard.writeText(input.value);
        overlay.style.opacity = "1";
        setTimeout(function() {
          overlay.style.opacity = "0";
        }, 1300);
        input.selectionStart = input.selectionEnd = 0;
      };
    }
  }

  let p = document.createElement("p");
  p.style.display = "none";
  p.innerText = "Send to:";
  content.appendChild(p);
  let req = new XMLHttpRequest();
  req.open("PROPFIND", "/");
  req.setRequestHeader("Depth", "1");
  await new Promise(function(resolve, reject) {
    req.onload = resolve;
    req.onerror = reject;
    req.send();
  });
  let folders = [];
  for (let c of req.responseXML.getElementsByTagName("collection")) {
    folders.push(c.parentNode.parentNode.parentNode.parentNode.getElementsByTagName("href")[0].childNodes[0].nodeValue);
  }
  folders.sort();
  for (let folder of folders) {
    let f = await fetch(folder + "send.js", {method: "HEAD"});
    if (f.ok) {
      let b = document.createElement("button");
      b.innerText = hreftoname(folder);
      b.style.background = hreftocolour(folder);
      b.style.margin = "0 0.3em 0.3em 0";
      b.onclick = async function() {
        let f = await fetch(folder + "send.js");
        await execute(await f.text());
      };
      content.appendChild(b);
      p.style.display = "";
    }
  }

  let footer = document.createElement("footer");
  appendChild(footer);

  let cancel = document.createElement("button");
  cancel.className = "dangerous";
  cancel.innerText = "Cancel";
  cancel.onclick = reject;
  footer.appendChild(cancel);
  
  spinner.stop();
});
