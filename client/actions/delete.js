let header = document.createElement("header");
header.innerText = "Delete";
appendChild(header);

let content = document.createElement("section");
content.innerText = "Delete \"" + hreftoname(href) + "\"?";
appendChild(content);

let footer = document.createElement("footer");
appendChild(footer);

let confirm = document.createElement("button");
confirm.className = "error";
confirm.innerText = "Delete";
footer.appendChild(confirm);

let cancel = document.createElement("button");
cancel.className = "dangerous";
cancel.innerText = "Cancel";
footer.appendChild(cancel);

await new Promise(function(resolve, reject) {
  cancel.onclick = reject;
  confirm.onclick = resolve;
});

content.innerText = "Deleting \"" + hreftoname(href) + "\"...";
footer.innerText = "";

let f = await fetch(href, {method: "DELETE"});
if (f.ok) {
  history.back();
} else {
  content.innerText = "An error occurred while deleting: " + f.status + " " + f.statusText;
  let close = document.createElement("button");
  close.className = "dangerous";
  close.innerText = "Close";
  footer.appendChild(close);
  await new Promise(function(resolve, reject) {
    close.onclick = resolve;
  });
}
