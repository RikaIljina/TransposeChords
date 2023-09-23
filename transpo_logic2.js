var offset = 0;
var last_button_clicked = "up";
var counter = 0;
var operator = "+";

var chord_list_m = ["em", "fm", "f#m", "gm", "g#m", "am", "bm", "hm", "cm", "c#m", "dm", "d#m", "em"] 
var chord_list_d = ["e", "f", "f#", "g", "g#", "a", "b", "h", "c", "c#", "d", "d#", "e"] 
var chord_list_7 = ["e7", "f7", "f#7", "g7", "g#7", "a7", "b7", "h7", "c7", "c#7", "d7", "d#7", "e7"]
var chord_list_m7 = ["em7", "fm7", "f#m7", "gm7", "g#m7", "am7", "bm7", "hm7", "cm7", "c#m7", "dm7", "d#m7", "em7"];
var len = 12;
var trans_pos_max = 11;

function chords_entered() {
    document.getElementById("result").innerHTML = document.getElementById("chords_input").value;
    document.getElementById("continue_tr").innerHTML = "0";
    offset = 0;
}

function transpose_up() {
   
   offset = (offset+1) % len;
    transpose();
}

function transpose_down() {

    offset = (offset-1) % len;
    transpose();
}

function transpose() {
  var result = "";
  let chord_list = [];
  let sep_chords = [];
  var raw_chords = document.getElementById("chords_input").value;
  var clean_chords = raw_chords.split(/\n|\r/g); // split the whole text into lines by linebreak

  for (j = 0; j < clean_chords.length; j++) {
    sep_chords = clean_chords[j].replace(/\s+/g, " ").split(" "); // split the lines by spaces, remove all redundant spaces AND linebreaks

    for (i = 0; i < sep_chords.length; i++) {
      var ch = sep_chords[i].toLowerCase();
      if (chord_list_m.includes(ch)) {
        chord_list = chord_list_m;
      } else if (chord_list_d.includes(ch)) {
        chord_list = chord_list_d;
      } else if (chord_list_7.includes(ch)) {
        chord_list = chord_list_7;
      } else if (chord_list_m7.includes(ch)) {
        chord_list = chord_list_m7;
      }
      else {
        result += "? ";
        continue;
      }

      temp_result =
        chord_list[
          (chord_list.indexOf(ch) + offset < 0
            ? (chord_list.indexOf(ch) + offset + len) % len
            : chord_list.indexOf(ch) + offset) % len
        ];
      result +=
        temp_result.charAt(0).toUpperCase() + temp_result.slice(1) + " ";
    }
    result += "<br>";
  }

  document.getElementById("result").innerHTML = result;

  document.getElementById("continue_tr").innerHTML = `${
    offset > 0 ? "+" : ""
  }${offset}`;
}


/* list (C D E F G A H )

index (A) = list.indexOf(A) = 5

offset = 0

up -> offset = (offset + 1) % 7
down -> offset = (offset - 1) % 7

output text = 
	if offset >= 0	
	list((index(A) + offset) % 7)
	else
	list((index(A) + 7 + offset) % 7)

button text = offset
 */

