//global array for storing URLs to block
var urlarray = [];

//function that adds a URL to blacklist
function addURL(){

   //take input from textbox and create relevant objects
   var ul = document.getElementById("dynamic-list");
   var input = document.getElementById("input");
   var li = document.createElement("li");

    //check array for duplicate URL against input
    var duplicate = false;
    for(var i = 0; i < urlarray.length; i++){
      if( urlarray[i] === input.value ){
        duplicate = true;
      }
    }

    //if url is unique and new
    if(!duplicate){
      //update HTML list
      li.setAttribute('id',input.value);
      li.appendChild(document.createTextNode(input.value));
      ul.appendChild(li);

      //add URL to array of blacklisted url
      urlarray.push(input.value);

      //store array on the cloud
      chrome.storage.sync.set({blockList:urlarray}, function() {
           console.log(input.value +' was saved');
         });
    }
}

//remove a URL from the blacklist, if it exists
function removeURL(){
    //take input on url to remove and create objects
    var ul = document.getElementById("dynamic-list");
    var input = document.getElementById("input");
    var item = document.getElementById(input.value);
    //remove from html visual
    ul.removeChild(item);

    //remove URL from array
    for(var i = 0; i < urlarray.length; i++){
      if( urlarray[i] === input.value ){
        urlarray.splice(i,1);
      }
    }

    //store updated array in cloud
    chrome.storage.sync.set({blockList:urlarray}, function() {
         console.log('array updated after element removal');
       });
}

//restore the state of options page as user left it on previous use
function restoreOptions(){
  //retrive array from cloud
  chrome.storage.sync.get({
    blockList:[],
  }, function(items) {
    urlarray = items.blockList;
    //add each element to html list and display
    for(var i =0; i < urlarray.length; i++){
      var ul = document.getElementById("dynamic-list");
      var input = urlarray[i];
      console.log(urlarray);
      var li = document.createElement("li");
      li.setAttribute('id',input);
      li.appendChild(document.createTextNode(input));
      ul.appendChild(li);
    }
  });
}

//button events
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('addURL').addEventListener('click',addURL);
document.getElementById('removeURL').addEventListener('click',removeURL);
