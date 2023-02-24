// Dynamically load castjs
if (typeof Castjs == "undefined") {
  await new Promise(function(resolve, reject) {
    let s = document.createElement("script");
    s.onload = resolve;
    s.src = "/_client/thirdparty/cast.min.js";
    document.head.appendChild(s);
  });
}

let cjs = new Castjs({receiver: "57652D73"});
if (!cjs.available) {
  await new Promise(function(resolve) {
    cjs.on("available", resolve);
  });
}
cjs.cast(new URL(href, document.baseURI) + "?");
