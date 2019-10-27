//declare global variables such as default blacklist
var objarray = [{urlContains: "youtube.com"}, {urlContains: "reddit.com"},
{urlContains: "twitter.com"},{urlContains: "instagram.com"},{urlContains: "facebook.com"},
{urlContains: "twitch.tv"}, {urlContains: "netflix.com"}, {urlContains: "hulu.com"}];
var urlarray = [];

//check status of ON/OFF switch and determine whether or not to monitor
//URLS
var switchOn = chrome.storage.sync.get({
  switchStatus:false,
}, function(items) {
  switchOn = items.switchStatus;
  if(switchOn){listenURLs();}else{stopListening();}
});


//work to be done when extension is installed
//document.addEventListener('DOMContentLoaded', primeURLarray(primeURLarray2()));
chrome.runtime.onInstalled.addListener();

//function that starts the process of monitoring urls
function listenURLs(){
  chrome.webNavigation.onBeforeNavigate.addListener(blockWebsite,
    {url: objarray});
    switchOn = true;
}

//function that ends process of monitoring urls
function stopListening(){
    chrome.webNavigation.onBeforeNavigate.removeListener(blockWebsite);
  switchOn = false;
}


//action of preventing the user from accessing a blacklisted website during studymode
function blockWebsite(callback){
    chrome.tabs.query({active: true, currentWindow:true}, function(tabs)
{chrome.tabs.remove(tabs[0].id, function() {
});
});

}

//update local list of blacklisted Websites
//removes then readds listeners during this process
function primeURLarray(callback){
  if(switchOn){
    chrome.webNavigation.onBeforeNavigate.removeListener(blockWebsite);
  }
  chrome.storage.sync.get({
    blockList:[ "youtube.com", "reddit.com",
    "twitter.com","instagram.com","facebook.com",
    "twitch.tv", "netflix.com", "hulu.com"],
  }, function(result) {
    urlarray = result;
    urlarray = urlarray.blockList;
  });
  setTimeout(callback, 500);
}

//helper method that accompanies primeURLarray
//creates the specifier:URL format that the Chrome API needs
function primeURLarray2(){
  objarray = [];
  for(var i = 0; i < urlarray.length; i++){
    var tempObj = {urlContains: urlarray[i]};
    objarray.push(tempObj);
  }

  if(switchOn){
  chrome.webNavigation.onBeforeNavigate.addListener(blockWebsite,
    {url: objarray});
  }
}

/////////////////////////////////////////////////////////////////////////////
var x;
var sec = 1;
var min = 0;
var hour = 0;
var startstop = 0; // boolean condition for whether button should display start or stop
var studyDataArr = [0, 0, 0]; //global array for total study data
var timeRun = 0;  //total time stopwatch has been running in seconds

function startStop() { /* Toggle StartStop */
    startstop = startstop + 1;
    if (startstop === 1) {
        reset();
        start();
    }
    else if (startstop === 2) {
        startstop = 0;
        stop();
        //loadData();
    }
}

  //  var sec = 1;
  //  var min = 0;
  //  var hour = 0;

    function printTime(i) {
        if (i < 10) { // if condition that adds extra 0 integer if number is singular digit
            i = "0" + i; // i would be converted to a string
        }
    return i;
    }

    //background timer driver
    function timer() {
        /* Main Timer */

        secOut = printTime(sec);
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

        var time_string = String(minOut)+":"+String(secOut);
        chrome.browserAction.setBadgeText({text: time_string});

        timeRun = timeRun + 1;
    }

    //starts timing process
    function start() {
        x = setInterval(timer, 1000);
    }

    //stops timing process
    function stop() {
        clearInterval(x);
        reset();
    }

    //resets variables to 0 and updates aggregated time tracker in cloud
    function reset() {
        sec = 0;
        min = 0;
        hour = 0;
        var temp = timeRun;
        timeRun = 0;

        //add all aggregated time + timeRun and restore to cloud
        chrome.storage.sync.get( {aggTime:0}, function(item){
          chrome.storage.sync.set({aggTime:(temp+item.aggTime)})
        });
    }

    //returns total # of seconds timer has run
    function getSeconds(){
      chrome.storage.sync.set({totalTime:timeRun});
    }
