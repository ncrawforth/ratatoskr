spinner.start();

// Dynamically load pdf.js
if (typeof pdfjsLib == "undefined") {
  await new Promise(function(resolve, reject) {
    let s = document.createElement("script");
    s.onload = resolve;
    s.src = "/_client/thirdparty/pdf.min.js";
    document.head.appendChild(s);
  });
}
pdfjsLib.GlobalWorkerOptions.workerSrc = "/_client/thirdparty/pdf.worker.min.js";
let pdf = await pdfjsLib.getDocument(href).promise;

innerHTML = `
  <style>
    @media screen {
      .pdfpage {
        background: lightgrey;
        margin: 0.5cm auto 1cm auto;
        box-shadow: 0 0.5cm 0.5cm #444;
        box-sizing: content-box;
        overflow: hidden;
        line-height: 0;
      }
    }
  </style>
`;

let pages = [];
for (let i = 1; i <= pdf.numPages; i++) {
  let page = await pdf.getPage(i);
  let viewport = page.getViewport({scale: 2.085});
  let div = document.createElement("div");
  div.className = "pdfpage";
  div.style.maxWidth = (viewport.width * 0.774) + "px";
  appendChild(div);
  let canvas = document.createElement("canvas");
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  canvas.style.width = "100%";
  div.appendChild(canvas);
  pages.push({page: page, viewport: viewport, canvas: canvas});
}

// Render the first page
let p = pages.shift();
await p.page.render({canvasContext: p.canvas.getContext("2d"), viewport: p.viewport}).promise;

// Render the remaining pages lazily and asynchronously
(async function() {
  while (pages.length > 0 && isConnected) {
    let found = false;
    for (let i = pages.length - 1; i >= 0; i--) {
      let rect = pages[i].canvas.getBoundingClientRect();
      if (rect.width != 0) {
        if ((rect.top < 0 && rect.bottom > 0) || 
            (rect.top >= 0 && rect.top < window.innerHeight)) {
          let p = pages.splice(i, 1)[0];
          await p.page.render({canvasContext: p.canvas.getContext("2d"),
                         viewport: p.viewport}).promise;
          found = true;
          break;
        }
      }
    }
    if (!found) {
      let p = pages.shift();
      await p.page.render({canvasContext: p.canvas.getContext("2d"),
                     viewport: p.viewport}).promise;
    }
  }
})();

spinner.stop();
