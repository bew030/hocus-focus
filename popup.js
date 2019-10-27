var x;
var sec = 1;
var min = 0;
var hour = 0;
var startstop = 0; // boolean condition for whether button should display start or stop
var studyDataArr = [0, 0, 0]; //global array for total study data


var el = document.getElementById("togBtn");

//add listener for clear time spent studying button
var clearBtn = document.getElementById("clear_button");
clearBtn.addEventListener("click",function(){
  chrome.storage.sync.set({aggTime:0},function(){});
  setTimeout(updateGlobalTime,200);
});

//listener for study switch
if(el){
    el.addEventListener("click", updateSwitch);
}


//get status of switch, push to cloud
var switchOn = chrome.storage.sync.get({
  switchStatus:false,
}, function(items) {
  switchOn = items.switchStatus;
  el.checked = switchOn;
  displayTimer();
  setTimeout(updateGlobalTime,150);
});


//updates value of switch and invoked background methods
function updateSwitch(){
  if(switchOn){
    switchOn = false;
    displayReset();
    chrome.storage.sync.set({switchStatus:switchOn}, function() {});

    chrome.runtime.getBackgroundPage(function(bgWindow) {
           bgWindow.stopListening()});

    chrome.runtime.getBackgroundPage(function(bgWindow){
      bgWindow.stop()});

      setTimeout(updateGlobalTime,300);

      //chrome.storage.sync.get( {aggTime:0}, function(item){
      //   updateGlobalTime(item.aggTime);
      //});
  }
  else{
    switchOn = true;
    freshDisplayTimer();
    chrome.runtime.getBackgroundPage(function(bgWindow) {
           bgWindow.listenURLs()});
    chrome.storage.sync.set({switchStatus:switchOn}, function() {});

   chrome.runtime.getBackgroundPage(function(bgWindow){
                bgWindow.start()});
  }
}

//function to display timer for the first time (requires reset to 0)
function freshDisplayTimer(){
  displayReset();
  start();
}

//function to display timer,
function displayTimer(){
  //if switch is on, get timer data from background process and update html popout
  if(switchOn){
    chrome.runtime.getBackgroundPage(function(bgWindow){
                 bgWindow.getSeconds()});
    setTimeout(function(){
      chrome.storage.sync.get(function(result){
      sec = result.totalTime+1; // add a second to account for delay in pulling time from background.js
      convertFromSeconds();
    })
  },500)
    setTimeout(start, 500);
  }
  //if switch is off just reset and display clean
  else{
    displayReset();
}
}

//helper function for string concatenation and formatting
function printTime(i) {
    if (i < 10) { // if condition that adds extra 0 integer if number is singular digit
        i = "0" + i; // i would be converted to a string
    }
return i;
}

//funciton that stops timer, resets variables to 0 and updates html
function displayReset(){
  stop();
  sec = 0;
  min = 0;
  hour = 0;

  chrome.browserAction.setBadgeText({text: '00:00'});

  document.getElementById("sec").innerHTML = printTime(sec);
  document.getElementById("min").innerHTML = printTime(min);
  document.getElementById("hour").innerHTML = printTime(hour);
}

// This block enables links from popup.html to open in a new tab
document.addEventListener('DOMContentLoaded', function () {
    var links = document.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        (function () {
            var ln = links[i];
            var location = ln.href;
            ln.onclick = function () {
                chrome.tabs.create({active: true, url: location});
            };
        })();
    }
});

// function to handle scrolling tab bar in popup.html
function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  //sets the style of each tab's display individually (text)
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    // hides the other tabs' content
    tabcontent[i].style.display = "none";
  }
  // sets the tablinks to active
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    // keeps the tab name's highlighted only if it is clicked
    tablinks[i].className = tablinks[i].className.replace("active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}


//driving function for timer, sort of outdated but kept for now...
function startStop() { /* Toggle StartStop */
    startstop = startstop + 1;
    //chrome.browserAction.setBadgeText({text: '00:00'});
    if (startstop === 1) {
        //reset();
        start();
    }
    else if (startstop === 2) {
        startstop = 0;
        stop();
        //loadData();
    }
}

    //timer block, used to actively update popout html timer and increment
    //forward each second
    function timer() {
        /* Main Timer */
        secOut = printTime(sec); // not always equal to sec
        minOut = printTime(min);
        hourOut = printTime(hour);
        var time_string = String(minOut)+":"+String(secOut);

        document.getElementById("sec").innerHTML = secOut;
        document.getElementById("min").innerHTML = minOut;
        document.getElementById("hour").innerHTML = hourOut;

        sec = sec+1;


        if (sec == 60) {
            min = min+1;
            sec = 0;
        }
        if (min == 60) {
            min = 0;
            hour = hour+1;
        }
    }

    //calls interval function which allows for a timer tick every second
    function start() {
        x = setInterval(timer, 1000);
    }

    //stops interval function
    function stop() {
        clearInterval(x);
    }

    //function that 0s variables and updates html, may be outdated
    function reset() {
        sec = 0;
        min = 0;
        hour = 0;

        document.getElementById("sec").innerHTML = printTime(sec);
        document.getElementById("min").innerHTML = printTime(min);
        document.getElementById("hour").innerHTML = printTime(hour);
    }

    //given total seconds of timer from background process, converts
    // into HH:MM:SS format
    function convertFromSeconds(){
      var temp = sec;
      sec = temp % 60;
      min = Math.floor(temp/60);
      hour = Math.floor(min / 60);
    }

    //function that updates total time spent studying field
    function updateGlobalTime(){
      var temp = 0;

      //get aggregate time, stop process then update HTML with it
      chrome.storage.sync.get( {aggTime:0}, function(item){
         temp = item.aggTime;});
      setTimeout(function(){
        seconds = temp % 60;
        var minutes = Math.floor(temp/60);
        var hours = Math.floor(minutes / 60);

        document.getElementById("totalSec").innerHTML = printTime(seconds);
        document.getElementById("totalMin").innerHTML = printTime(minutes);
        document.getElementById("totalHour").innerHTML = printTime(hours);

      },50);
    }
