var x;
var sec = 1;
var min = 0;
var hour = 0;
var startstop = 0; // boolean condition for whether button should display start or stop
var studyDataArr = [0, 0, 0]; //global array for total study data

//document.addEventListener('DOMContentLoaded', displayTimer);
var el = document.getElementById("togBtn");

var clearBtn = document.getElementById("clear_button");
clearBtn.addEventListener("click",function(){
  chrome.storage.sync.set({aggTime:0},function(){});
  setTimeout(updateGlobalTime,200);
});

if(el){
    el.addEventListener("click", updateSwitch);
}


//get status of switch, push to cloud
var switchOn = chrome.storage.sync.get({
  switchStatus:false,
}, function(items) {
  switchOn = items.switchStatus;
  el.checked = switchOn;
  console.log(switchOn);
  displayTimer();
  setTimeout(updateGlobalTime,150);
});


//updates value of switch and invoked background methods
function updateSwitch(){
  console.log("Changing value!");
  if(switchOn){
    switchOn = false;
    displayReset();
    chrome.storage.sync.set({switchStatus:switchOn}, function() {
                console.log('Stored'+switchOn+'in cloud');
              });

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
    chrome.storage.sync.set({switchStatus:switchOn}, function() {
                console.log('Stored'+switchOn+'in cloud');
              });

   chrome.runtime.getBackgroundPage(function(bgWindow){
                bgWindow.start()});
  }
}

function freshDisplayTimer(){
  displayReset();
  start();
}


function displayTimer(){
  console.log("In display timer");
  if(switchOn){
    chrome.runtime.getBackgroundPage(function(bgWindow){
                 bgWindow.getSeconds()});
    setTimeout(function(){
      chrome.storage.sync.get(function(result){
      sec = result.totalTime+1; // add a second to account for delay in pulling time from background.js
      convertFromSeconds();
      //console.log("GET SECONDS RETURNED" + sec);
    })

  },500)
    setTimeout(start, 500);
  }
  else{
    displayReset();
}
}

function printTime(i) {
    if (i < 10) { // if condition that adds extra 0 integer if number is singular digit
        i = "0" + i; // i would be converted to a string
    }
return i;
}

function displayReset(){
  stop();
  sec = 0;
  min = 0;
  hour = 0;

  //chrome.storage.sync.get( {aggTime:0}, function(item){
  //   updateGlobalTime(item.aggTime);
  //});
  //updateGlobalTime();

  chrome.browserAction.setBadgeText({text: '00:00'});

  chrome.storage.sync.set({hourCloud:hour});
  chrome.storage.sync.set({minCloud:min});
  chrome.storage.sync.set({secCloud:sec});

  document.getElementById("sec").innerHTML = printTime(sec);
  document.getElementById("min").innerHTML = printTime(min);
  document.getElementById("hour").innerHTML = printTime(hour);
}

// function to upload current study session data to the cloud
function loadData() {
    // declare array with new data
    var tempStudyDataArr = [hour, min, sec];
    restoreData();

    // add seconds to aggregate data, carry if needed
    if (tempStudyDataArr[2] + tempStudyDataArr[2] >= 60) {
      studyDataArr[1] = studyDataArr[1] + 1;
      studyDataArr[2] = tempStudyDataArr[2] + studyDataArr[2] - 60;
    }
    else {
      studyDataArr[2] = studyDataArr[2] + tempStudyDataArr[2];
    }

www    // add minutes to aggregate data, carry if needed
    if (tempStudyDataArr[1] + studyDataArr[1] >= 60) {
      studyDataArr[0] = studyDataArr[0] + 1;
      studyDataArr[1] = tempStudyDataArr[1] + studyDataArr[1] - 60;
    }
    else {
      studyDataArr[1] = studyDataArr[1] + tempStudyDataArr[1];
    }

    // add hours to aggregate data
    studyDataArr[0] = studyDataArr[0] + tempStudyDataArr[0]

    // store new aggregate study data back on the cloud
    chrome.storage.sync.set({"studyDataList":studyDataArr}, function() {
      console.log('Data was saved');
    });

    chrome.storage.sync.get(function(data){console.log(data)});
}

// restore the state of study data
function restoreData() {
    chrome.storage.sync.get(
      ['studyDataList'],
      function(items) {
      studyDataArr = items.studyDataList;
    });
}

function clearData() {
    studyDataArr[0] = 0;
    studyDataArr[1] = 0;
    studyDataArr[2] = 0;

    // store data that has been reset back to studyDataList
    chrome.storage.sync.set({'studyDataList':studyDataArr}, function() {
    console.log(input.value + 'was saved');
  });
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
    console.log(tabcontent[i]);
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

function startStop() { /* Toggle StartStop */
    startstop = startstop + 1;
    console.log("START STOP: " + sec);
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

    function start() {
        //convertFromSeconds();

        console.log("Seconds converted: "+sec);
        x = setInterval(timer, 1000);

        //when timer is running listen for events
        console.log("Start : " + sec);
    }

    function stop() {
        clearInterval(x);

        console.log("Stop :" + switchOn);
    }

    function reset() {
        sec = 0;
        min = 0;
        hour = 0;

        console.log("IN RESET IN RESET");

        document.getElementById("sec").innerHTML = printTime(sec);
        document.getElementById("min").innerHTML = printTime(min);
        document.getElementById("hour").innerHTML = printTime(hour);
    }

    function convertFromSeconds(){
      console.log("Sec REE "+sec);
      var temp = sec;
      sec = temp % 60;
      min = Math.floor(temp/60);
      hour = Math.floor(min / 60);
      console.log("REEEEEEE" + sec);
    }


    function updateGlobalTime(){
      var temp = 0;

      chrome.storage.sync.get( {aggTime:0}, function(item){
         temp = item.aggTime;});
         console.log("GLOBAL: "+temp);
      setTimeout(function(){
        seconds = temp % 60;
        var minutes = Math.floor(temp/60);
        var hours = Math.floor(minutes / 60);

        console.log("seconds: "+ seconds + "minutes: "+minutes);
        document.getElementById("totalSec").innerHTML = printTime(seconds);
        document.getElementById("totalMin").innerHTML = printTime(minutes);
        document.getElementById("totalHour").innerHTML = printTime(hours);

      },50);
    }
