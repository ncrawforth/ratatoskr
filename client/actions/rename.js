let header = document.createElement("header");
header.innerText = "Rename";
appendChild(header);

let content = document.createElement("section");
content.innerText = "Rename \"" + hreftoname(href) + "\" as:";
appendChild(content);

let input = document.createElement("input");
input.value = hreftoname(href);
content.appendChild(input);
input.onkeyup = function(e) {
  if (e.keyCode == 13) {
    e.preventDefault();
    confirm.click();
  }
};

let footer = document.createElement("footer");
appendChild(footer);

let confirm = document.createElement("button");
confirm.className = "warning";
confirm.innerText = "Rename";
footer.appendChild(confirm);

let cancel = document.createElement("button");
cancel.className = "dangerous";
cancel.innerText = "Cancel";
footer.appendChild(cancel);

let destination = "";
while (destination.length == 0) {
  input.focus();
  await new Promise(function(resolve, reject) {
    cancel.onclick = reject;
    confirm.onclick = resolve;
  });
  destination = encodeURIComponent(input.value.replace(/^\.*/, "").replace(/[/?:]/g, "_"));
  if (href.endsWith("/")) destination = "../" + destination;
}

content.innerText = "Renaming \"" + hreftoname(href) + "\"...";
footer.innerText = "";

let f = await fetch(href, {method: "MOVE", headers: {"Destination": destination}});
if (f.ok) {
  history.back();
} else {
  content.innerText = "An error occurred while renaming: " + f.status + " " + f.statusText;
  let close = document.createElement("button");
  close.className = "dangerous";
  close.innerText = "Close";
  footer.appendChild(close);
  await new Promise(function(resolve, reject) {
    close.onclick = resolve;
  });
}
