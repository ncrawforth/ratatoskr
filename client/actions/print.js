// Dynamically load print.js
if (typeof printJS == "undefined") {
  await new Promise(function(resolve, reject) {
    let s = document.createElement("script");
    s.onload = resolve;
    s.src = "/_client/thirdparty/print.min.js";
    document.head.appendChild(s);
  });
}

// Dynamically load purify.js
if (typeof DOMPurify == "undefined") {
  await new Promise(function(resolve, reject) {
    let s = document.createElement("script");
    s.onload = resolve;
    s.src = "/_client/thirdparty/purify.min.js";
    document.head.appendChild(s);
  });
}

if (contenttype == "application/pdf") {
  printJS({printable: href, type: "pdf", showModal: true, modalMessage: "Preparing page for printing..."});
} else if (contenttype == "text/html") {
  let f = await fetch(href);
  let data = DOMPurify.sanitize(await f.text(), {FORBID_ATTR: ["loading"]});
  data += "<img src=\"invalid:url\" style=\"display: none;\" onerror=\"let t = this; setTimeout(function() {t.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';}, 100);\" />";
  printJS({printable: data, type: "raw-html", showModal: true, modalMessage: "Preparing page for printing..."});
} else {
  window.print();
}
