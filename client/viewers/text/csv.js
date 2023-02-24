spinner.start();

// Dynamically load papaparse.js
if (typeof Papa == "undefined") {
  await new Promise(function(resolve, reject) {
    let s = document.createElement("script");
    s.onload = resolve;
    s.src = "/_client/thirdparty/papaparse.min.js";
    document.head.appendChild(s);
  });
}

let etag = null;

let newrow = createbutton("New row");

async function loadcsv() {
  let f = await fetch(href);
  etag = f.headers.get("ETag");
  let text = await f.text();
  
  let csv = await new Promise(function(resolve) {
    Papa.parse(text, {complete: resolve, skipEmptyLines: true});
  });
  if (csv.data.length > 1) {
    let headings = csv.data.shift();
    csv.data.sort();
    csv.data.unshift(headings);
  }
  
  innerHTML = `
    <style>
      .clickable:hover {
        box-shadow: inset 0 0 0 99em rgb(17 17 17 / 10%);
        cursor: pointer;
      }
    </style>
    <div class="modal">
      <input type="checkbox" id="editrowmodal" />
      <label for="editrowmodal" class="overlay"></label>
      <article>
        <header>Edit row</header>
        <section>
          <fieldset id="columns" class="flex one">
          </fieldset>
        </section>
        <footer>
          <button id="saverow" class="success">Save</button>
          <button class="error" style="margin-right: 0.8em;" onclick="deleterowmodal.checked = true;">Delete</button>
          <button class="dangerous" onclick="editrowmodal.checked = false;">Cancel</button>
        </footer>
      </article>
    </div>
    <div class="modal">
      <input type="checkbox" id="deleterowmodal" />
      <label for="deleterowmodal" class="overlay"></label>
      <article>
        <header>Delete row</header>
        <section>Delete this row?</section>
        <footer>
          <button id="deleterow" class="error">Delete</button>
          <button class="dangerous" onclick="deleterowmodal.checked = false;">Cancel</button>
        </footer>
      </article>
    </div>
  `;

  let t = document.createElement("table");
  t.className = "primary";
  t.style.margin = "1em auto";
  let cols = 0;
  let selected = null;
  for (let i = 0; i < csv.data.length; i++) {
    let tr = document.createElement("tr");
    if (i > 0) {
      tr.className = "clickable";
      tr.onclick = function() {
        selected = i;
        editrow();
      };
    }
    cols = Math.max(cols, csv.data[i].length);
    for (let j = 0; j < cols; j++) {
      let td = document.createElement(i == 0 ? "th" : "td");
      td.innerText = csv.data[i][j] || "";
      tr.appendChild(td);
    }
    t.appendChild(tr);
  }
  appendChild(t);

  function editrow() {
    columns.innerHTML = "";
    for (let j = 0; j < cols; j++) {
      let label = document.createElement("label");
      let input = document.createElement("input");
      input.placeholder = (csv.data[0] || [])[j] || "";
      input.value = (csv.data[selected] || [])[j] || "";
      label.appendChild(input);
      columns.appendChild(label);
    }
    editrowmodal.checked = true;
  }

  newrow.onclick = function() {
    selected = csv.data.length;
    editrow();
  };
  
  deleterow.onclick = async function() {
    spinner.start();
    deleterowmodal.checked = false;
    editrowmodal.checked = false;
    if (selected < csv.data.length) {
      csv.data.splice(selected, 1);
      let data = Papa.unparse(csv.data) + "\r\n";
      await fetch(href, {method: "PUT", body: data});
    }
    spinner.stop();
  };
  
  saverow.onclick = async function() {
    spinner.start();
    editrowmodal.checked = false;
    let inputs = columns.getElementsByTagName("input");
    if (selected == csv.data.length) {
      csv.data.push([]);
    }
    for (let i = 0; i < inputs.length; i++) {
      csv.data[selected][i] = inputs[i].value;
    }
    let data = Papa.unparse(csv.data) + "\r\n";
    await fetch(href, {method: "PUT", body: data});
    spinner.stop();
  };
}
await loadcsv();

onfolderchanged = function(entries) {
  if (etag == null) return;
  for (let entry of entries) {
    if (entry.href == href && entry.etag != etag) {
      loadcsv();
    }
  }
};

spinner.stop();
