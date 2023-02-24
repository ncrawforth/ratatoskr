spinner.start();

let thumbnails = {};
let images = {};

style.paddingBottom = "3rem";

onfolderchanged = function(entries) {
  images = {};
  let folders_div = document.createElement("div");
  let files_div = document.createElement("div");
  for (let entry of entries) {
    let e = document.createElement("a");
    e.className = "stack pseudo button";
    e.style.position = "relative";
    e.style.paddingLeft = "4em";
    e.style.color = "var(--grey)";
    e.innerText = entry.name;
    let icon = contenttypetoicon(entry.contenttype);
    e.appendChild(icon);
    if (entry.contenttype.startsWith("folder/")) {
      e.href = entry.href;
      icon.style.color = hreftocolour(entry.href);
      folders_div.appendChild(e);
    } else {
      e.href = entry.href.replace(/([^/]*)$/, "#$1");
      files_div.appendChild(e);
    }
    if (entry.contenttype.startsWith("image/")) {
      let img = document.createElement("img");
      img.className = "icon";
      img.style.display = "none";
      e.appendChild(img);
      images[entry.href] = e;
    }
  }
  innerHTML = "";
  appendChild(folders_div);
  appendChild(files_div);
  spinner.stop();
}

onthumbnailschanged = function(newthumbnails) {
  thumbnails = newthumbnails;
  for (let href in images) {
    let icon = images[href].getElementsByTagName("svg")[0];
    let img = images[href].getElementsByTagName("img")[0];
    if (thumbnails[href]) {
      img.src = thumbnails[href];
      img.style.display = "";
      icon.style.display = "none";
    } else {
      img.style.display = "none";
      icon.style.display = "";
    }
  }
}
