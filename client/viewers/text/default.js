spinner.start();

let f = await fetch(href);
let t = await f.text();
let e1 = document.createElement("pre");
e1.style.width = "82ch";
e1.style.margin = "auto";
e1.style.background = "var(--white)";
let e2 = document.createElement("code");
e2.style.background = "var(--white)";
e2.style.color = "var(--black)";
e2.style.padding = "1ch";
e2.style.display = "block";
e2.innerHTML = t.replace(/&/g, "&amp;").replace(/</g, "&lt;");
e1.appendChild(e2);
appendChild(e1);
if (contenttype != "text/plain") {
  if (!window.hljs) {
    let s = document.createElement("link");
    s.rel = "stylesheet";
    s.href = "/_client/thirdparty/highlight.css"
    document.head.appendChild(s);
    await new Promise(function(resolve, reject) {
      let s = document.createElement("script");
      s.onload = resolve;
      s.src = "/_client/thirdparty/highlight.min.js";
      document.head.appendChild(s);
    });
  }
  hljs.highlightAll();
}

createbutton("Edit", async function() {
  let f = await fetch("/_client/editors/text.js");
  execute(await f.text());
});

spinner.stop();
