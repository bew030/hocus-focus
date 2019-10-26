var x;
var startstop = 0; // boolean condition for whether button should display start or stop 

var el = document.getElementById("togBtn");
if(el){
    el.addEventListener("click", startStop);
  // el.addEventListener("click", secondFunction); 
}


function startStop() { /* Toggle StartStop */
    startstop = startstop + 1;
    if (startstop === 1) {
        reset(); 
        start();
    } 
    else if (startstop === 2) {
        startstop = 0;
        stop();
    }

    var sec = 1; 
    var min = 0;
    var hour = 0;

    function printTime(i) { 
        if (i < 10) { // if condition that adds extra 0 integer if number is singular digit 
            i = "0" + i; // i would be converted to a string 
        }
    return i;
    }

    function timer() {
        /* Main Timer */
        secOut = printTime(sec); // not always equal to sec
        minOut = printTime(min);
        hourOut = printTime(hour);

        sec = sec+1;

        if (sec == 60) {
            min = min+1;
            sec = 0;
        }
        if (min == 60) {
            min = 0;
            hour = hour+1;
        }

        document.getElementById("sec").innerHTML = secOut;
        document.getElementById("min").innerHTML = minOut;
        document.getElementById("hour").innerHTML = hourOut;
    }

    function start() {
        x = setInterval(timer, 1000);
    }

    function stop() {
        clearInterval(x);
    }

    function reset() {
        var sec = 0; 
        var min = 0;
        var hour = 0;

        document.getElementById("sec").innerHTML = printTime(sec);
        document.getElementById("min").innerHTML = printTime(min);
        document.getElementById("hour").innerHTML = printTime(hour);
    }
}