var x;
var sec = 1;
var min = 0;
var hour = 0;
var startstop = 0; // boolean condition for whether button should display start or stop
var studyDataArr = [0, 0, 0]; //global array for total study data

document.addEventListener('DOMContentLoaded', updateTotalDisplay);
var el = document.getElementById("togBtn");

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
      bgWindow.startStop()});
  }
  else{
    switchOn = true;
    chrome.runtime.getBackgroundPage(function(bgWindow) {
           bgWindow.listenURLs()});
    chrome.storage.sync.set({switchStatus:switchOn}, function() {
                console.log('Stored'+switchOn+'in cloud');
              });

   chrome.runtime.getBackgroundPage(function(bgWindow){
                bgWindow.startStop()});
  }
}

function displayTimer(){

}

function printTime(i) {
    if (i < 10) { // if condition that adds extra 0 integer if number is singular digit
        i = "0" + i; // i would be converted to a string
    }
return i;
}

function displayReset(){
  sec = 0;
  min = 0;
  hour = 0;

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

    // add minutes to aggregate data, carry if needed
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

function updateTotalDisplay() {
    restoreData();
    // document.getElementById("totalSec").innerHTML = printTime(studyDataArr[2]);
    // document.getElementById("totalMin").innerHTML = printTime(studyDataArr[1]);
    // document.getElementById("totalHour").innerHTML = printTime(studyDataArr[0]);
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
