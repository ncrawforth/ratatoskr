let d = document.createElement("div");
d.style.display = "table";
d.style.position = "absolute";
d.style.width = "100%";
d.style.height = "100%";
appendChild(d);
let d2 = document.createElement("div");
d2.style.display = "table-cell";
d2.style.textAlign = "center";
d2.style.verticalAlign = "middle";
d.appendChild(d2);
let e = document.createElement("audio");
e.style.width = "100%";
e.style.maxWidth = "500px";
e.controls = "true";
e.controlsList = "nodownload noremoteplayback";
d2.appendChild(e);
await new Promise(function(resolve, reject) {
  e.oncanplay = resolve;
  e.src = href;
});
