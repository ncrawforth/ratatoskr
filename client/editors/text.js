let e1 = document.createElement("code");
let e2 = document.createElement("textarea");
e2.style.outline = "none";
e2.style.border = "none";
e2.style.resize = "none";
e2.style.position = "absolute";
e2.style.height = "100%";
e2.style.left = e2.style.top = e2.style.right = e2.style.bottom = "0";
e2.style.padding = "1ch";
let f = await fetch(href);
e2.value = await f.text();
e1.appendChild(e2);
appendChild(e1);

createbutton("Cancel", function() {
  window.dispatchEvent(new Event("hashchange"));
});

createbutton("Save", async function() {
  await fetch(href, {method: "PUT", body: e2.value.trim().replace(/\r/g, "").replace(/\n\n+/g, "\n\n").replace(/\n/g, "\r\n") + "\r\n"});
  window.dispatchEvent(new Event("hashchange"));
});
