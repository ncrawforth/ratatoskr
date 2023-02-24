let e = document.createElement("video");
e.style.position = "absolute";
e.style.width = "100%";
e.style.height = "100%";
e.style.background = "black";
e.controls = "true";
e.controlsList = "nodownload noremoteplayback";
e.onloadedmetadata = function() {
  e.currentTime = Math.min(5, e.duration * 0.3);
};
e.onplay = function() {
  if (e.currentTime < 6) e.currentTime = 0;
  e.onplay = null;
};
appendChild(e);
await new Promise(function(resolve, reject) {
  e.oncanplay = resolve;
  e.src = href;
});
