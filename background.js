var urlarray = [];
var objarray = [{urlContains: "reddit.com"}];
console.log("background running");

//work to be done when extension is installed
//document.addEventListener('DOMContentLoaded', primeURLarray(primeURLarray2()));
chrome.runtime.onInstalled.addListener(primeURLarray());

function listenURLs(){
  chrome.webNavigation.onBeforeNavigate.addListener(blockWebsite,
    {url: [{urlContains: "reddit"}]});
}

function stopListening(){
    chrome.runtime.onMessage.removeListener(blockWebsite);
}

function blockWebsite(callback){
  //alert("fuck off!!!");

    chrome.tabs.query({active: true, currentWindow:true}, function(tabs)
{chrome.tabs.remove(tabs[0].id, function() { });
});
}

function primeURLarray(){
  chrome.storage.sync.get('blockList',function(result){
    urlarray = result.blockList;
  });
  objarray = [];
  for(var i = 0; i < urlarray.length; i++){
    var tempObj = {urlContains: urlarray[i]};
    console.log("adding" + urlarray[i]);
    objarray.push(tempObj);
  }
}
