spinner.start();

// Load the HTML in a sandboxed iframe
let e = document.createElement("iframe");
await new Promise(function(resolve) {
  e.sandbox = "allow-same-origin allow-top-navigation allow-popups";
  e.style.position = "absolute";
  e.style.left = e.style.top = e.style.right = e.style.bottom = "0";
  e.style.width = e.style.height = "100%";
  e.style.border = "none";
  e.onload = resolve;
  e.onerror = resolve;
  appendChild(e);
  e.src = href;
});

createbutton("Edit", async function() {
  let f = await fetch("/_client/editors/text.js");
  execute(await f.text());
});

spinner.stop();
