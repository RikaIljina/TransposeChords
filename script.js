// prettier-ignore
const chordDict = {
    'moll': [ "em", "fm", "f#m", "gm", "g#m", "am", "bm", "hm", "cm", "c#m", "dm", "d#m", "em",],
    'dur': ["e", "f", "f#", "g", "g#", "a", "b", "h", "c", "c#", "d", "d#", "e"],
    'seven': [ "e7", "f7", "f#7", "g7", "g#7", "a7", "b7", "h7", "c7", "c#7", "d7", "d#7", "e7", ],
    'minorseven': [ "em7", "fm7", "f#m7", "gm7", "g#m7", "am7", "bm7", "hm7", "cm7", "c#m7", "dm7", "d#m7", "em7", ],
    'sus': [ "esus", "fsus", "f#sus", "gsus", "g#sus", "asus", "bsus", "hsus", "csus", "c#sus", "dsus", "d#sus", "esus", ],
    'sus2': [ "esus2", "fsus2", "f#sus2", "gsus2", "g#sus2", "asus2", "bsus2", "hsus2", "csus2", "c#sus2", "dsus2", "d#sus2", "esus2", ],
    'sus4': [ "esus4", "fsus4", "f#sus4", "gsus4", "g#sus4", "asus4", "bsus4", "hsus4", "csus4", "c#sus4", "dsus4", "d#sus4", "esus4", ],
    'm6': [ "em6", "fm6", "f#m6", "gm6", "g#m6", "am6", "bm6", "hm6", "cm6", "c#m6", "dm6", "d#m6", "em6", ],
    'min6': [ "emin6", "fmin6", "f#min6", "gmin6", "g#min6", "amin6", "bmin6", "hmin6", "cmin6", "c#min6", "dmin6", "d#min6", "emin6", ],
    'maj6': [ "emaj6", "fmaj6", "f#maj6", "gmaj6", "g#maj6", "amaj6", "bmaj6", "hmaj6", "cmaj6", "c#maj6", "dmaj6", "d#maj6", "emaj6", ],
};
// prettier-ignore
const chordListBase = ["e", "f", "f#", "g", "g#", "a", "b", "h", "c", "c#", "d", "d#", "e"];

let offset = 0;
let checklist = [];
let inputRows = [];
let coordDict = {};

document.getElementById("transpose-up").disabled = true;
document.getElementById("transpose-down").disabled = true;

document.getElementById("transpose-up").addEventListener("click", transposeUp);
document
  .getElementById("transpose-down")
  .addEventListener("click", transposeDown);
document.getElementById("chord-entry").addEventListener("input", resetResult);
document.getElementById("save-suffix").addEventListener("click", saveSuffix);
document.getElementById("parse-entry").addEventListener("click", parseEntry);
document.getElementById("copy-result").addEventListener("click", copyResult);

document
  .getElementById("suffix-modal")
  .addEventListener("keydown", function (e) {
    if (e.key == "Escape") {
      updateCustoms();
    }
  });

document.getElementById("#toast").toast();

function focusModal() {
  const controller = new AbortController();
  const { signal } = controller;
  $("#suffix-modal").on("shown.bs.modal", function () {
    $(this).find("#suffix-input").focus();
  });
  // Get the input field
  const input = document.getElementById("suffix-input");

  // Execute a function when the user presses a key on the keyboard
  input.addEventListener(
    "keypress",
    function (event) {
      // If the user presses the "Enter" key on the keyboard
      if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("save-suffix").click();
      }
    },
    { signal }
  );
  input.controller = controller;
}

function saveSuffix() {
  let listLen = 13;
  newSuffix = document.getElementById("suffix-input").value.trim();
  if (
    newSuffix === "" ||
    newSuffix.includes(" ") ||
    checklist.includes(newSuffix) ||
    checklist.length == 10
  ) {
    document.getElementById("suffix-input").value = "";
    document.getElementById("suffix-input").focus();
    return;
  }
  checklist.push(newSuffix);
  chords_temp = chordListBase.slice();
  for (i = 0; i < listLen; i++) {
    chords_temp[i] = chords_temp[i] + newSuffix;
  }
  nextIdx = Object.keys(chordDict).length + 1;
  nextKey = `custom${nextIdx}`;
  chordDict[nextKey] = chords_temp.slice();
  addToTable(nextKey, newSuffix);
  document.getElementById("suffix-input").value = "";
  document.getElementById("suffix-input").focus();
}

function addToTable(key, suffix) {
  let newRow = document.createElement("tr");
  let col1 = document.createElement("td");
  let col2 = document.createElement("td");
  let col1Text = document.createTextNode(suffix);
  col1.style.color = "dimgrey";
  col1.style.fontWeight = "bold";

  let delButton = document.createElement("div");
  delButton.type = "button";
  delButton.role = "button";
  delButton.value = "delete";
  delButton.style.cursor = "pointer";
  delButton.onclick = deleteSuffix;
  delButton.innerHTML =
    '<i id="trash" class="fa fa-trash" aria-hidden="true"></i>';

  col1.appendChild(col1Text);
  col2.appendChild(delButton);
  newRow.appendChild(col1);
  newRow.appendChild(col2);
  newRow.setAttribute("id", key);
  document.getElementById("suffix-list").appendChild(newRow);
  resetResult();
}

function deleteSuffix() {
  checklist.splice(
    checklist.indexOf(this.parentNode.parentNode.textContent),
    1
  );
  let currentId = this.parentNode.parentNode.getAttribute("id");
  delete chordDict[currentId];
  resetResult();
  document.getElementById("suffix-input").value = "";
  document.getElementById("suffix-input").focus();
  document.getElementById(currentId).remove();
}

function resetResult() {
  document.getElementById("result").textContent =
    document.getElementById("chord-entry").value;
  document.getElementById("transposed-by").innerHTML = "0";
  offset = 0;
  inputRows = [];
  coordDict = {};
  document.getElementById("transpose-up").disabled = true;
  document.getElementById("transpose-down").disabled = true;
}

function updateCustoms() {
  document.getElementById("suffix-input").value = "";
  let result = [];
  tags = document.getElementsByTagName("tr");
  for (let i = 1; i < tags.length; i++) {
    result.push(tags[i].children[0].innerText);
  }
  let res = "<mark>" + result.join(", ") + "</mark>";
  document.getElementById("custom-suffixes").innerHTML = res;
  // document.getElementById("suffix-input").removeEventListener("keypress");

  document.getElementById("suffix-input").controller.abort();
}

function parseEntry() {
  resetResult();

  let coords = [];
  let result = "";
  let foundChordList = [];
  let inputCharsList = [];
  let rawInput = document.getElementById("chord-entry").value;
  if (!rawInput) {
    return;
  }
  // split the whole text into lines by line break
  inputRows = rawInput.split(/\n|\r/g); // initial user entry, split into rows and chars in the next loop

  for (j = 0; j < inputRows.length; j++) {
    // split the lines by spaces, remove all redundant spaces AND line breaks
    inputCharsList = inputRows[j]
      .trim()
      .replace(/\//g, " / ")
      .replace(/\s+/g, " ")
      .split(" ");
    inputRows[j] = inputCharsList;
    // Check each list element to see if it's in the chord lists
    for (let [idx, ch] of inputCharsList.entries()) {
      foundChordList = [];
      for (value of Object.values(chordDict)) {
        if (value.includes(ch.toLowerCase())) {
          // If yes: remember the chord list
          foundChordList = value.slice();
          coords = [j, idx];
          coordDict[coords] = foundChordList;
          break;
        }
      }
      if (foundChordList.length === 0) {
        result += `${ch} `;
        continue;
      }
      result +=
        `<span class="parsed-chord" id="${coords[0]}-${coords[1]}" style="color: green;">` +
        ch.charAt(0).toUpperCase() +
        ch.slice(1) +
        "</span> ";
    }
    result += "<br>";
  }
  document.getElementById("result").innerHTML = result;

  // Make all found chords clickable to allow user to de-select some
  for (el of document.querySelectorAll(".parsed-chord")) {
    let coordsStr = el.getAttribute("id").split("-");
    let coords = [parseInt(coordsStr[0]), parseInt(coordsStr[1])];
    el.coordDict = coordDict;
    el.coords = coords.slice();
    el.chordList = coordDict[coords].slice(); // Passing on object reference directly to element
    el.addEventListener("click", toggleChord);
  }

  document.querySelector("#result").scrollIntoView({ behavior: "smooth" });
  document.getElementById("transpose-up").disabled = false;
  document.getElementById("transpose-down").disabled = false;
}

// Toggle transpose logic for this chord
function toggleChord() {
  if (this.style.color === "green") {
    this.style.color = "initial";
    delete this.coordDict[this.coords];
  } else {
    this.style.color = "green";
    this.coordDict[this.coords] = this.chordList;
  }
}

function transposeUp() {
  let len = 12;
  offset = (offset + 1) % len;
  document
    .querySelector("#transpose-up")
    .scrollIntoView({ behavior: "smooth" });
  transpose(len);
}

function transposeDown() {
  let len = 12;
  offset = (offset - 1) % len;
  document
    .querySelector("#transpose-up")
    .scrollIntoView({ behavior: "smooth" });
  transpose(len);
}

function transpose(len) {
  let result = "";
  let temp_result = "";
  for (j = 0; j < inputRows.length; j++) {
    for (let [idx, ch] of inputRows[j].entries()) {
      // are the coords of this character in the dict?
      if ([j, idx] in coordDict) {
        let foundChordList = coordDict[[j, idx]];
        ch = ch.toLowerCase();

        temp_result =
          foundChordList[
            (foundChordList.indexOf(ch) + offset < 0
              ? (foundChordList.indexOf(ch) + offset + len) % len
              : foundChordList.indexOf(ch) + offset) % len
          ];
        result +=
          '<span style="color: green;"><b>' +
          temp_result.charAt(0).toUpperCase() +
          temp_result.slice(1) +
          "</b></span> ";
      } else {
        result += `${ch} `;
        continue;
      }
    }
    result += "<br>";
  }
  result = result.replace(/\s\/\s/g, "/");
  document.getElementById("result").innerHTML = result;

  document.getElementById("transposed-by").innerHTML = `${
    offset > 0 ? "+" : ""
  }${offset}`;
}

// TODO: add copy function
function copyResult() {
  let plainText = document.getElementById("result").innerText;
  const type = "text/html";
  const typePlain = "text/plain";
  const text = document.getElementById("result").innerHTML;
  const blob = new Blob([text], { type: type });
  const blobPlain = new Blob([plainText], { type: typePlain });
  const data = [
    new ClipboardItem({
      [type]: blob,
      [typePlain]: blobPlain,
    }),
  ];
  // Select the text field
  // copyText.textContent.select();
  // copyText.setSelectionRange(0, 99999); // For mobile devices

  // Copy the text inside the text field
  //navigator.clipboard.write(data);
  const copyContent = async () => {
    try {
      navigator.clipboard
        .write(data)
        .then(() => {
          $("#toast").toast("show");
        })
        .catch(() => {
          alert("something went wrong");
        });

      console.log("Content copied to clipboard");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  copyContent();

  // Alert the copied text
}
