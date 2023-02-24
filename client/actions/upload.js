let header = document.createElement("header");
header.innerText = "Upload";
appendChild(header);

let content = document.createElement("section");
content.innerText = "Upload a file:";
appendChild(content);

let input = document.createElement("input");
input.type = "file";
input.onchange = function() {
  console.log(e.value);
}
content.appendChild(input);

let footer = document.createElement("footer");
appendChild(footer);

let cancel = document.createElement("button");
cancel.className = "dangerous";
cancel.innerText = "Cancel";
footer.appendChild(cancel);

input.click();

await new Promise(function(resolve, reject) {
  cancel.onclick = reject;
  input.onchange = resolve;
});

let file = input.files[0];
let destination = encodeURIComponent(file.name.replace(/^\.*/, "").replace(/[/?:]/g, "_"));
content.innerText = "Uploading \"" + hreftoname(destination) + "\"...";
footer.innerText = "";

let req = new XMLHttpRequest();
req.open("PUT", destination);
req.setRequestHeader("If-None-Match", "*");
req.overrideMimeType(file.type);
req.upload.onprogress = function(e) {
  footer.innerHTML = "<div class=\"button\" style=\"width: " + (e.loaded * 100 / e.total) + "%; height: 0.5rem;\"></div>";
};
await new Promise(function(resolve, reject) {
  req.onload = resolve;
  req.onerror = reject;
  req.send(file);
});

if (!(req.status >= 200 && req.status < 300)) {
  if (req.status == 412) {
    content.innerText = "A file or folder with that name already exists";
  } else {
    content.innerText = "An error occurred while creating: " + req.status + " " + req.statusText;
  }
  let close = document.createElement("button");
  close.className = "dangerous";
  close.innerText = "Close";
  footer.appendChild(close);
  await new Promise(function(resolve, reject) {
    close.onclick = resolve;
  });
}
