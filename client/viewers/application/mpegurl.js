let position = 0;

let player = document.createElement("audio");
player.style.width = "100%";
player.style.maxWidth = "500px";
player.style.margin = "auto";
player.style.display = "block";
player.controls = "true";
player.controlsList = "nodownload noremoteplayback";
player.onended = function() {play(position + 1, true);};
let playerdiv = document.createElement("div");
playerdiv.style.position = "absolute";
playerdiv.style.top = "0";
playerdiv.style.padding = "1rem";
playerdiv.style.width = "100%";
playerdiv.style.background = "var(--white)";
playerdiv.appendChild(player);
appendChild(playerdiv);

let playlistdiv = document.createElement("div");
playlistdiv.style.position = "absolute";
playlistdiv.style.top = "5rem";
playlistdiv.style.bottom = "0";
playlistdiv.style.width = "100%";
playlistdiv.style.overflowY = "scroll";
appendChild(playlistdiv);

let f = await fetch(href);
let t = await f.text();
let urls = t.split("\n");
let playlist = [];
for (let url of urls) {
  url = url.trim();
  if (url.length > 0 && !url.startsWith("#")) {
    playlist.push(new URL(url.trim(), document.baseURI).href);
  }
}
let elements = [];
for (let i in playlist) {
  let item = playlist[i];
  let parts = item.split("/");
  let track = hreftoname(parts.pop()).replace(/\.mp[34]$/i, "").replace(/</g, "&lt;").replace(/^[0-9]*\. /, "");
  let album = hreftoname(parts.pop()).replace(/</g, "&lt;");
  let artist = hreftoname(parts.pop()).replace(/</g, "&lt;");
  let element = document.createElement("span");
  element.className = "pseudo button stack";
  element.innerHTML = track + `<br><small>` + artist + `, <i>` + album + `</i></small>`;
  element.onclick = function() {play(i, true);};
  elements.push(element);
  playlistdiv.appendChild(element);
}
function play(p, autoplay) {
  position = p % playlist.length;
  for (let i in elements) {
    let element = elements[i];
    if (i == position) {
      element.className = "button stack";
      element.scrollIntoView();
    } else {
      element.className = "pseudo button stack";
    }
  }
  player.src = playlist[position];
  if (autoplay) player.play();
}
play(0, false);
