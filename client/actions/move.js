let header = document.createElement("header");
header.innerText = "Move";
appendChild(header);

let content = document.createElement("section");
content.innerText = "Move \"" + hreftoname(href) + "\" to:";
appendChild(content);

let tree = document.createElement("div");
content.appendChild(tree);

let footer = document.createElement("footer");
appendChild(footer);

let confirm = document.createElement("button");
confirm.className = "warning";
confirm.innerText = "Move";
footer.appendChild(confirm);

let cancel = document.createElement("button");
cancel.className = "dangerous";
cancel.innerText = "Cancel";
footer.appendChild(cancel);

// Find out how far up the tree we're allowed to go
spinner.start();
let parents = href.replace(/\/$/, "").split("/");
parents.pop();
for (let i = parents.length - 1; i >= 0; i--) {
  let path = parents.slice(0, i + 1).join("/");
  let f = await fetch(path + "/", {method: "PROPFIND", headers: {"Depth": "0"}});
  if (f.ok) {
    continue;
  } else {
    parents[i + 1] = (path + "/" + parents[i + 1]);
    parents.splice(0, i + 1);
    break;
  }
}
spinner.stop();

async function getfolders() {
  let req = new XMLHttpRequest();
  req.open("PROPFIND", parents.join("/") + "/");
  req.setRequestHeader("Depth", "1");
  await new Promise(function(resolve, reject) {
    req.onload = resolve;
    req.onerror = reject;
    req.send();
  });
  let folders = [];
  for (let c of req.responseXML.getElementsByTagName("collection")) {
    folders.push(c.parentNode.parentNode.parentNode.parentNode.getElementsByTagName("href")[0].childNodes[0].nodeValue.replace(/\/$/, "").replace(/.*\//g, ""));
  }
  folders.shift();
  folders.sort();
  return folders;
}

async function drawtree() {
  spinner.start();
  tree.style.opacity = "0.25";
  let folders = await getfolders();
  tree.innerHTML = "";
  for (let i = 0; i < parents.length; i++) {
    let folderhref = parents.slice(0, i + 1).join("/") + "/";
    let e = document.createElement("div");
    e.className = "stack pseudo button";
    if (folderhref == "/") {
      e.innerText = "Root folder";
    } else {
      e.innerText = hreftoname(folderhref);
    }
    e.style.textDecoration = "none";
    e.style.color = "inherit";
    e.style.paddingLeft = (i + 2.5) + "rem";
    e.style.position = "relative";
    if (i == parents.length - 1) {
      e.style.color = "--var(black)";
    } else {
      e.style.color = "--var(grey)";
    }
    e.onclick = function() {
      let index = i + 1;
      return function() {
        parents.splice(index);
        drawtree();
      };
    }();
    tree.appendChild(e);
    let icon = contenttypetoicon("folder/open");
    icon.style.color = hreftocolour(folderhref);
    icon.style.left = i + "rem";
    e.appendChild(icon);
  }
  for (let i = 0; i < folders.length; i++) {
    let folderhref = parents.join("/") + "/" + folders[i] + "/";
    if (folderhref == href) {
      continue;
    }
    let e = document.createElement("div");
    e.className = "stack pseudo button";
    e.innerText = hreftoname(folderhref);
    e.style.textDecoration = "none";
    e.style.color = "inherit";
    e.style.paddingLeft = (parents.length + 2.5) + "rem";
    e.style.position = "relative";
    e.style.color = "--var(grey)";
    e.onclick = function() {
      let index = i;
      return function() {
        parents.push(folders[index])
        drawtree();
        return false;
      };
    }();
    tree.appendChild(e);
    let icon = contenttypetoicon("folder/closed");
    icon.style.color = hreftocolour(folderhref);
    icon.style.left = parents.length + "rem";
    e.appendChild(icon);
  }
  tree.style.opacity = "";
  spinner.stop();
}
drawtree();

await new Promise(function(resolve, reject) {
  cancel.onclick = reject;
  confirm.onclick = resolve;
});

content.innerText = "Moving \"" + hreftoname(href) + "\"...";
footer.innerText = "";

let destination = parents.join("/") + "/" + href.replace(/\/$/, "").replace(/^.*\//g, "");
if (destination.length > 0) {
  let f = await fetch(href, {method: "MOVE", headers: {"Destination": destination}});
  if (f.ok) {
    history.back();
  } else {
    content.innerText = "An error occurred while moving: " + f.status + " " + f.statusText;
    let close = document.createElement("button");
    close.className = "dangerous";
    close.innerText = "Close";
    footer.appendChild(close);
    await new Promise(function(resolve, reject) {
      close.onclick = resolve;
    });
  }
}
