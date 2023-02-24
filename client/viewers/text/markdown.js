spinner.start();

// Dynamically load markdown-it
if (typeof markdownit == "undefined") {
  await new Promise(function(resolve, reject) {
    let s = document.createElement("script");
    s.onload = resolve;
    s.src = "/_client/thirdparty/markdown-it.min.js";
    document.head.appendChild(s);
  });
}
if (typeof markdownitDeflist == "undefined") {
  await new Promise(function(resolve, reject) {
    let s = document.createElement("script");
    s.onload = resolve;
    s.src = "/_client/thirdparty/markdown-it-deflist.min.js";
    document.head.appendChild(s);
  });
}
let m = markdownit({typographer: true});
m.use(markdownitDeflist);
let e = document.createElement("div");
e.style.maxWidth = "960px";
e.style.margin = "auto";
e.style.padding = "1em";
appendChild(e);

let etag = null;

async function loadtext() {
  let f = await fetch(href);
  etag = f.headers.get("ETag");
  let text = await f.text();
  let checkboxes = {};
  let count = -1;
  let html = m.render(text.replace(/\[([x ])]/gi, function(_, check, pos) {
    count++;
    checkboxes["checkbox" + count] = pos;
    if (check == " ") return "\u2610";
    return "\u2611";
  }));
  count = -1;
  html = html.replace(/[\u2610\u2611]/g, function(check) {
    count++;
    if (check == "\u2610") return `<label><input type="checkbox" id="checkbox` + count + `"><span class="checkable" style="margin-right: 0;"></span></label>`;
    return `<label><input type="checkbox" id="checkbox` + count + `" checked><span class="checkable" style="margin-right: 0;"></span></label>`;
  });
  e.innerHTML = html;

  for (let c of querySelectorAll("input[type=checkbox]")) {
    c.onchange = function() {
      let pos = checkboxes[c.id];
      if (c.checked) {
        text = text.substring(0, pos + 1) + "X" + text.substring(pos + 2);
      } else {
        text = text.substring(0, pos + 1) + " " + text.substring(pos + 2);
      }
      fetch(href, {method: "PUT", body: text});
    };
  }
}
await loadtext();

onfolderchanged = function(entries) {
  if (etag == null) return;
  for (let entry of entries) {
    if (entry.href == href && entry.etag != etag) {
      loadtext();
    }
  }
};

createbutton("Edit", async function() {
  let f = await fetch("/_client/editors/text.js");
  execute(await f.text());
});

spinner.stop();
