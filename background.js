var urlarray = [];
var objarray = [{urlContains: "reddit.com"}];

//work to be done when extension is installed
//document.addEventListener('DOMContentLoaded', primeURLarray(primeURLarray2()));
chrome.runtime.onInstalled.addListener(primeURLarray());

function listenURLs(){
  chrome.webNavigation.onBeforeNavigate.addListener(blockWebsite, {url: objarray});
}

function stopListening(){
    chrome.extension.onRequest.removeListener(blockWebsite);
}

function blockWebsite(){
  alert("BLOCKED");
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
