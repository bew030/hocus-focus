var objarray = [{urlContains: "youtube.com"}, {urlContains: "reddit.com"},
{urlContains: "twitter.com"},{urlContains: "instagram.com"},{urlContains: "facebook.com"},
{urlContains: "twitch.tv"}, {urlContains: "netflix.com"}, {urlContains: "hulu.com"}];
var urlarray = [];
var switchOn = chrome.storage.sync.get({
  switchStatus:false,
}, function(items) {
  switchOn = items.switchStatus;
  if(switchOn){listenURLs();}else{stopListening();}
});


//work to be done when extension is installed
//document.addEventListener('DOMContentLoaded', primeURLarray(primeURLarray2()));
chrome.runtime.onInstalled.addListener();

function listenURLs(){
  chrome.webNavigation.onBeforeNavigate.addListener(blockWebsite,
    {url: objarray});
    console.log("ListenURL Called!");
    switchOn = true;
}

function stopListening(){
    chrome.webNavigation.onBeforeNavigate.removeListener(blockWebsite);
  console.log("Stop listening called!");
  switchOn = false;
}

function blockWebsite(callback){
  console.log("Blocking website!");
    chrome.tabs.query({active: true, currentWindow:true}, function(tabs)
{chrome.tabs.remove(tabs[0].id, function() { console.log("blocked " + tabs[0].url);
});
});

console.log("object array in blockwebsite" + objarray);
}

function primeURLarray(callback){

  if(switchOn){
    console.log("Background: Listener turned off!");
    chrome.webNavigation.onBeforeNavigate.removeListener(blockWebsite);
  }
  chrome.storage.sync.get({
    blockList:[ "youtube.com", "reddit.com",
    "twitter.com","instagram.com","facebook.com",
    "twitch.tv", "netflix.com", "hulu.com"],
  }, function(result) { console.log("blockList type " +typeof(result.blockList));
    urlarray = result;
    urlarray = urlarray.blockList;
  });
  setTimeout(callback, 500);
}

//function updateListener(){
//  chrome.webNavigation.onBeforeNavigate.removeListener(blockWebsite);
//  chrome.webNavigation.onBeforeNavigate.addListener(blockWebsite,
//    {url: objarray});
//}

function primeURLarray2(){
  console.log("cleared object array")
  objarray = [];
  for(var i = 0; i < urlarray.length; i++){
    var tempObj = {urlContains: urlarray[i]};
    //console.log("adding" + urlarray[i]);
    objarray.push(tempObj);
  }
  //console.log("new object array");
  console.log(objarray);

  if(switchOn){
    console.log("Background: Listener back on!");
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
var timeRun = 0;

function startStop() { /* Toggle StartStop */
    startstop = startstop + 1;
    //chrome.browserAction.setBadgeText({text: '00:00'});
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

        timeRun = timeRun + 1;
        console.log(timeRun);


       //total variables

        //each time variables

      //  document.getElementById("sec").innerHTML = secOut;
      //  document.getElementById("min").innerHTML = minOut;
      //  document.getElementById("hour").innerHTML = hourOut;
    }

    function start() {
        x = setInterval(timer, 1000);

        //when timer is running listen for events
        console.log("Start : " + switchOn);
    }

    function stop() {
        clearInterval(x);
        reset();

        console.log("Stop :" + switchOn);
    }

    function reset() {
        sec = 0;
        min = 0;
        hour = 0;
        var temp = timeRun;
        timeRun = 0;

        console.log("resetting!")
        chrome.storage.sync.get( {aggTime:0}, function(item){
          console.log(item.aggTime);
          //temp = temp + item.aggTime;

          chrome.storage.sync.set({aggTime:(temp+item.aggTime)})
        });

        //chrome.storage.sync.set({aggTime:temp});


        chrome.storage.sync.set({hourCloud:hour});
        chrome.storage.sync.set({minCloud:min});
        chrome.storage.sync.set({secCloud:sec});

    //    document.getElementById("sec").innerHTML = printTime(sec);
    //    document.getElementById("min").innerHTML = printTime(min);
    //    document.getElementById("hour").innerHTML = printTime(hour);
    }

    function getSeconds(){
      console.log("Returning :" + timeRun);
      chrome.storage.sync.set({totalTime:timeRun});
    }
