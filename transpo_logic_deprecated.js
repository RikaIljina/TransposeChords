var prev_counter = 0;
var last_button_clicked = "up";
var counter = 0;
var operator = "+";
var chord_list = [""];
var trans_pos_max = 11;

function chords_entered() {
    document.getElementById("result").innerHTML = document.getElementById("chords_input").value;
}

function transpose_up() {
   
    chord_list = ["em", "fm", "f#m", "gm", "g#m", "am", "bm", "hm", "cm", "c#m", "dm", "d#m", "em", "e", "f", "f#", "g", "g#", "a", "b", "h", "c", "c#", "d", "d#", "e", "e7", "f7", "f#7", "g7", "g#7", "a7", "b7", "h7", "c7", "c#7", "d7", "d#7", "e7", "em7", "fm7", "f#m7", "gm7", "g#m7", "am7", "bm7", "hm7", "cm7", "c#m7", "dm7", "d#m7", "em7"];
    operator = "+";   
    last_button_clicked = "up";
    transpose();
}

function transpose_down() {

    chord_list = ["em", "d#m", "dm", "c#m", "cm", "hm", "bm", "am", "g#m", "gm", "f#m", "fm", "em", "e", "d#", "d", "c#", "c", "h", "b", "a", "g#", "g", "f#", "f", "e", "e7", "d#7", "d7", "c#7", "c7", "h7", "b7", "a7", "g#7", "g7", "f#7", "f7", "e7", "em7", "d#m7", "dm7", "c#m7", "cm7", "hm7", "bm7", "am7", "g#m7", "gm7", "f#m7", "fm7", "em7"];
    operator = "-";
    last_button_clicked = "down";
    transpose();
}

function transpose() {
    var result = "";
    var raw_chords = document.getElementById("result").innerHTML;
    var clean_chords = raw_chords.replace(/\n|\r/g, " ").trim().split(" ");

    for (i = 0; i< clean_chords.length; i++) {
        var ch = clean_chords[i].toLowerCase();
        if (chord_list.includes(ch)){
            result += chord_list[chord_list.indexOf(ch)+1] + " ";
        }
        else if(ch === "")
        {
            continue;
        }
        else
        {
            result += "? ";
        }
    }

    document.getElementById("result").innerHTML = result;


    if (counter == 0) {
        counter = 1;
    }
    else if (counter == trans_pos_max) {
        counter = 0;
    }
    else {
        counter += 1;
    }

    document.getElementById("continue_tr").innerHTML = `${operator} ${counter}`;
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


 /* function continue_tr() {
    
    var result = "";
    var trans_list_up = ["+0", "+1", "+2", "+3", "+4", "+5", "+6", "+7", "+8", "+9", "+10", "+11", "+0"];
    var trans_list_down = ["-0", "-1", "-2", "-3", "-4", "-5", "-6", "-7", "-8", "-9", "-10", "-11", "-0"];

      if (trans_list_up.includes(document.getElementById("continue_tr").innerHTML)) 
      {
        chord_list = ["em", "fm", "f#m", "gm", "g#m", "am", "bm", "hm", "cm", "c#m", "dm", "d#m", "em", "e", "f", "f#", "g", "g#", "a", "b", "h", "c", "c#", "d", "d#", "e", "e7", "f7", "f#7", "g7", "g#7", "a7", "b7", "h7", "c7", "c#7", "d7", "d#7", "e7", "em7", "fm7", "f#m7", "gm7", "g#m7", "am7", "bm7", "hm7", "cm7", "c#m7", "dm7", "d#m7", "em7"];
        trans_list = trans_list_up;
        }
      else {
        chord_list = ["em", "d#m", "dm", "c#m", "cm", "hm", "bm", "am", "g#m", "gm", "f#m", "fm", "em", "e", "d#", "d", "c#", "c", "h", "b", "a", "g#", "g", "f#", "f", "e", "e7", "d#7", "d7", "c#7", "c7", "h7", "b7", "a7", "g#7", "g7", "f#7", "f7", "e7", "em7", "d#m7", "dm7", "c#m7", "cm7", "hm7", "bm7", "am7", "g#m7", "gm7", "f#m7", "fm7", "em7"];
        trans_list = trans_list_down;
      }

        var raw_chords = document.getElementById("result").innerHTML;
          var clean_chords = raw_chords.replace(/\n|\r/g, " ").trim().split(" ");
      
          for (i = 0; i< clean_chords.length; i++) {
              var ch = clean_chords[i].toLowerCase();
              if (chord_list.includes(ch)){
                  result += chord_list[chord_list.indexOf(ch)+1] + " ";
              }
              else if(ch === "")
              {
                 continue;
              }
              else
             {
              result += "? ";
             }
          }
      document.getElementById("result").innerHTML = result;

      for (i = 0; i< trans_list.length; i++) {
        if (trans_list[i] == document.getElementById("continue_tr").innerHTML){
            document.getElementById("continue_tr").innerHTML = trans_list[i+1];
            break;
        }

      }
     
    }
      */
