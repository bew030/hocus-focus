//global array for storing URLs to block
var urlarray = [];

//function that adds a URL to blacklist
function addURL(){

   //take input from textbox and create relevant objects
   var ul = document.getElementById("dynamic-list");
   var input = document.getElementById("input");
   var li = document.createElement("div");

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
    //update background array
    chrome.runtime.getBackgroundPage(function(bgWindow) {
           bgWindow.primeURLarray(bgWindow.primeURLarray2)});
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

   //update background array
   chrome.runtime.getBackgroundPage(function(bgWindow) {
          bgWindow.primeURLarray(bgWindow.primeURLarray2)});
}

//restore the state of options page as user left it on previous use
function restoreOptions(){
  //retrive array from cloud
  chrome.storage.sync.get({
    blockList:[ "youtube.com", "reddit.com",
    "twitter.com","instagram.com","facebook.com",
    "twitch.tv", "netflix.com", "hulu.com"],
  }, function(items) {
    urlarray = items.blockList;
    //add each element to html list and display
    for(var i =0; i < urlarray.length; i++){
      var ul = document.getElementById("dynamic-list");
      var input = urlarray[i];
      console.log(urlarray);
      var li = document.createElement("div");
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



//////////////////////////TODO LIST///////////////////////////////////


var array_possible_audio = ["Travis Scott It's Lit.mp3","Travis Scott Skrt.mp3","Travis Scott Straight Up Two.mp3","Travis Scott Straight Up.mp3"];

var id_iterator = 0
var list_ids;

// ACTIONS 
var el = document.getElementById("submitter");
if(el){
  el.addEventListener("click", addToDoList);
}

// FUNCTIONS
function addToDoList() { 
    var ul = document.getElementById('list_tasks'); 
    var input = document.getElementById("userInput");

    var li = document.createElement("div");
    // li.setAttribute('id','li'+id_iterator);  

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.setAttribute('id', String(id_iterator));

    id_iterator = id_iterator + 1;

    li.appendChild(document.createTextNode(input.value));
    li.appendChild(checkbox);
    ul.appendChild(li);   

    var lis = document.getElementById('list_tasks').getElementsByTagName('input');
    
    list_ids = []; 
    for (var i = 0; i < lis.length; i++) {
        list_ids.push(lis[i].id)
    }

    for (var i = 0; i < list_ids.length; i++) {
        document.getElementById(list_ids[i]).addEventListener('click',checkboxAction);
    }
}

function checkboxAction() {
    var checkBox = this;
    var finishList = document.getElementById('finish_list');
    var soundCondition = document.getElementById('soundOption').checked;
    var random_option = Math.floor(Math.random() * array_possible_audio.length); 
    var audio = new Audio(array_possible_audio[random_option]);
    if (soundCondition == false ){
      audio.play();
    }

    if (checkBox.checked == true){
        var li = document.createElement("div");
        var element = checkBox.parentNode;
        var text = element.innerText;
        li.append(text); 
        finishList.append(li);
        element.parentNode.removeChild(element);
    } 
  }

