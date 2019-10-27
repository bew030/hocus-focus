var x;
var sec = 1;
var min = 0;
var hour = 0;
var startstop = 0; // boolean condition for whether button should display start or stop
var studyDataArr = [0, 0, 0]; //global array for total study data

document.addEventListener('DOMContentLoaded', updateTotalDisplay);
var el = document.getElementById("togBtn");
if(el){
    el.addEventListener("click", startStop);
}

function startStop() { /* Toggle StartStop */
    startstop = startstop + 1;
    chrome.browserAction.setBadgeText({text: '00:00'});
    if (startstop === 1) {
        reset();
        start();
    }
    else if (startstop === 2) {
        startstop = 0;
        stop();
        loadData();
    }
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
        sec = sec+1;
        secOut = printTime(sec); // not always equal to sec
        minOut = printTime(min);
        hourOut = printTime(hour);



        if (sec == 60) {
            min = min+1;
            sec = 0;
        }
        if (min == 60) {
            min = 0;
            hour = hour+1;
        }

        var time_string = String(minOut)+":"+String(secOut)
        chrome.browserAction.setBadgeText({text: time_string});

        document.getElementById("sec").innerHTML = secOut;
        document.getElementById("min").innerHTML = minOut;
        document.getElementById("hour").innerHTML = hourOut;
    }

    function start() {
        x = setInterval(timer, 1000);

        //when timer is running listen for events
        chrome.runtime.getBackgroundPage(function(bgWindow) {
           bgWindow.listenURLs();});
    }

    function stop() {
        clearInterval(x);

        chrome.runtime.getBackgroundPage(function(bgWindow) {
           bgWindow.stopListening();});
    }

    function reset() {
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
