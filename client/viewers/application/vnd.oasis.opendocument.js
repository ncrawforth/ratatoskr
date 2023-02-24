spinner.start();

// Dynamically load webodf.js
if (typeof odf == "undefined") {
  await new Promise(function(resolve, reject) {
    let s = document.createElement("script");
    s.onload = resolve;
    s.src = "/_client/thirdparty/webodf.min.js";
    document.head.appendChild(s);
  });
}

// Remove style tags inserted by webodf.js on previous runs
document.head.querySelectorAll("style[media='screen, print, handheld, projection']").forEach(function(e) {e.remove();});

let content = document.createElement("div");
content.style.marginLeft = "auto";
content.style.marginRight = "auto";
content.style.maxWidth = "892px";
appendChild(content);

let canvas = document.createElement("div");
content.appendChild(canvas);

let odfcanvas = new odf.OdfCanvas(canvas);
await new Promise(function(resolve) {
  odfcanvas.addListener("statereadychange", function() {
    resolve();
  });
  odfcanvas.load(href);
});

odfcanvas.getZoomHelper().destroy(function() {});
odfcanvas.fitToWidth(Math.min(892, document.body.offsetWidth));
let s = document.createElement("style");
s.innerHTML = `
  @media print {
    .alert {
      display: none;
    }
  }
  body {
    color: black;
    background: white;
  }
  table-cell {
    padding: 2px;
    word-break: inherit;
  }
`;
appendChild(s);

spinner.stop();
