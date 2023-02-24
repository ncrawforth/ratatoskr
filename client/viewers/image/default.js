let e = document.createElement("style");
e.innerHTML = `
  @media print {img {background: white !important; padding: 0 !important;}}
  .prevnext {
    opacity: 0.1;
    transition: opacity 1s;
    position: absolute;
    top: 0;
    bottom: 0;
    width: 6rem;
    height: 100%;
    color: var(--white);
    background: var(--black);
    text-align: center;
    vertical-align: middle;
    line-height: calc(100vh - 3rem);
    font-size: 5rem;
  }
  .prevnext:hover {
    opacity: 0.1 !important;
  }
`;
appendChild(e);

let lores = document.createElement("img");
lores.style.position = "absolute";
lores.style.width = "100%";
lores.style.height = "100%";
lores.style.objectFit = "contain";
lores.style.padding = "1ch";
lores.style.filter = "blur(min(1.5vh, 1.5vw))";
lores.style.display = "none";
appendChild(lores);
onthumbnailschanged = function(thumbnails) {
  if (thumbnails[href]) {
    lores.src = thumbnails[href];
    lores.style.display = "";
  }
};

let hires = document.createElement("img");
hires.style.position = "absolute";
hires.style.width = "100%";
hires.style.height = "100%";
hires.style.objectFit = "contain";
hires.style.padding = "1ch";
appendChild(hires);

await new Promise(function(resolve) {
  lores.onload = resolve;
  hires.onload = function() {
    hires.style.background = "var(--white)";
    resolve();
  };
  hires.onerror = resolve;
  hires.src = href;
});

onfolderchanged = function(entries) {
  let prev = null, curr = null, next = null;
  for (let entry of entries) {
    if (entry.href == href) {
      curr = entry;
    } else if (entry.contenttype.startsWith("image/")) {
      if (curr) {
        next = entry;
        break;
      } else {
        prev = entry;
      }
    }
  }
  if (prev) {
    let button = document.createElement("a");
    button.className = "prevnext";
    button.style.left = "0";
    button.href = prev.href.replace(/([^/]*)$/, "#$1");
    button.innerText = "\u25c0";
    button.onclick = function() {
      history.replaceState("", "", this.href);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
      hires.src = "";
      return false;
    };
    appendChild(button);
    setTimeout(function() {button.style.opacity = "0.01";}, 1000);
  } 
  if (next) {
    let button = document.createElement("a");
    button.className = "prevnext";
    button.style.right = "0";
    button.href = next.href.replace(/([^/]*)$/, "#$1");
    button.innerText = "\u25b6";
    button.onclick = function() {
      history.replaceState("", "", this.href);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
      hires.src = "";
      return false;
    };
    appendChild(button);
    setTimeout(function() {button.style.opacity = "0.01";}, 1000);
  } 
};
