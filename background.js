var objarray = [{urlContains: "youtube.com"}, {urlContains: "reddit.com"},
{urlContains: "twitter.com"},{urlContains: "instagram.com"},{urlContains: "facebook.com"},
{urlContains: "twitch.tv"}, {urlContains: "netflix.com"}, {urlContains: "hulu.com"}];
var urlarray = [];


//work to be done when extension is installed
//document.addEventListener('DOMContentLoaded', primeURLarray(primeURLarray2()));
chrome.runtime.onInstalled.addListener();

function listenURLs(){
  chrome.webNavigation.onBeforeNavigate.addListener(blockWebsite,
    {url: objarray});
}

function stopListening(){
    chrome.webNavigation.onBeforeNavigate.removeListener(blockWebsite);
}

function blockWebsite(callback){
    chrome.tabs.query({active: true, currentWindow:true}, function(tabs)
{chrome.tabs.remove(tabs[0].id, function() { console.log("blocked " + tabs[0].url);
});
});

console.log("object array in blockwebsite" + objarray);
}

function primeURLarray(callback){

  chrome.webNavigation.onBeforeNavigate.removeListener(blockWebsite);

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
    console.log("adding" + urlarray[i]);
    objarray.push(tempObj);
  }
  console.log("new object array");
  console.log(objarray);

  chrome.webNavigation.onBeforeNavigate.addListener(blockWebsite,
    {url: objarray});

}
