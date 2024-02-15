var offset = 0;
var last_button_clicked = "up";
var counter = 0;
var operator = "+";

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
var chord_list_base = ["e", "f", "f#", "g", "g#", "a", "b", "h", "c", "c#", "d", "d#", "e"];

var len = 12;
var trans_pos_max = 11;
var listLen = 13;
let checklist = [];

document.getElementById("transpose-up").addEventListener("click", transpose_up);
document
  .getElementById("transpose-down")
  .addEventListener("click", transpose_down);
document
  .getElementById("chord-entry")
  .addEventListener("change", resetResult);
document.getElementById("save-suffix").addEventListener("click", saveSuffix);

function focusModal() {
  $("#suffix-modal").on("shown.bs.modal", function () {
    $(this).find("#suffix-input").focus();
  });
  // Get the input field
var input = document.getElementById("suffix-input");

// Execute a function when the user presses a key on the keyboard
input.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("save-suffix").click();
  }
});
}

function saveSuffix() {
  newSuffix = document.getElementById("suffix-input").value.trim();
  if (
    newSuffix === "" ||
    newSuffix.includes(' ') ||
    checklist.includes(newSuffix) ||
    checklist.length == 10
  ) {
    document.getElementById("suffix-input").value = "";
    document.getElementById("suffix-input").focus();
    return;
  }
  checklist.push(newSuffix);
  chords_temp = chord_list_base.slice();
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
  delButton.innerHTML = '<i id="trash" class="fa fa-trash" aria-hidden="true"></i>';

  col1.appendChild(col1Text);
  col2.appendChild(delButton);
  newRow.appendChild(col1);
  newRow.appendChild(col2);
  newRow.setAttribute("id", key);
  document.getElementById("suffix-list").appendChild(newRow);
  resetResult();
}

function deleteSuffix() {
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
}

function transpose_up() {
  offset = (offset + 1) % len;
  transpose();
}

function transpose_down() {
  offset = (offset - 1) % len;
  transpose();
}

function transpose() {
  var result = "";
  let chord_list = [];
  let sep_chords = [];
  var raw_chords = document.getElementById("chord-entry").value;
  var clean_chords = raw_chords.split(/\n|\r/g); // split the whole text into lines by linebreak

  for (j = 0; j < clean_chords.length; j++) {
    sep_chords = clean_chords[j]
      .trim()
      .replace("/", " / ")
      .replace(/\s+/g, " ")
      .split(" "); // split the lines by spaces, remove all redundant spaces AND linebreaks

    for (ch of sep_chords) {
      chord_list = [];
      for (value of Object.values(chordDict)) {
        if (value.includes(ch.toLowerCase())) {
          chord_list = value.slice();
          break;
        }
      }
      if (chord_list.length === 0) {
        result += `${ch} `;
        continue;
      }
      ch = ch.toLowerCase();

      temp_result =
        chord_list[
          (chord_list.indexOf(ch) + offset < 0
            ? (chord_list.indexOf(ch) + offset + len) % len
            : chord_list.indexOf(ch) + offset) % len
        ];
      result +=
        '<span style="color: green;"><b>' +
        temp_result.charAt(0).toUpperCase() +
        temp_result.slice(1) +
        " </b></span>";
    }
    result += "<br>";
  }

  document.getElementById("result").innerHTML = result;

  document.getElementById("transposed-by").innerHTML = `${
    offset > 0 ? "+" : ""
  }${offset}`;
}
