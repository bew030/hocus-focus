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

// todo list global variables
var array_possible_audio = ["Travis Scott It's Lit.mp3","Travis Scott Straight Up Two.mp3","Travis Scott Straight Up.mp3","wow.mp3","bell.mp3","applause8.mp3"];
var id_iterator = 0
var list_ids;

// ACTIONS
var el = document.getElementById("submitter");
if(el){
  el.addEventListener("click", addToDoList);
}

var array_tasks = [];

// adds tasks to todolist and also adds to cloud to allow for memory in extension
function addToDoList() {
  var ul = document.getElementById('list_tasks');
  var input = document.getElementById("userInput");

  //loop through array to avoid duplicate insertion
  var duplicate = false;
  for(var i = 0; i < array_tasks.length; i++){
    if( array_tasks[i] === input.value ){
      duplicate = true;
    }
  }
  //if not duplicate add new task to options.html
  if(!duplicate){
    var li = document.createElement("tr");
    li.setAttribute('id','tr'+id_iterator);

    var col_1 = document.createElement("th");
    col_1.setAttribute('id', 'col1'+id_iterator);
    col_1.appendChild(document.createTextNode(input.value));

    array_tasks.push(input.value);

    var col_2 = document.createElement("th");
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.setAttribute('id', String(id_iterator)); // double check
    col_2.appendChild(checkbox);

    id_iterator = id_iterator + 1;

    li.appendChild(col_1);
    li.appendChild(col_2);
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

  //store on cloud
    console.log("storing to cloud...");
    chrome.storage.sync.set({todoTable:array_tasks});
}

//function to be called when options.html first loads
// retrieves tasks from cloud and reupdates options.html
function restoreTODO(){
  chrome.storage.sync.get({
    todoTable:[],
  }, function(items){
    array_tasks = items.todoTable;
    console.log(array_tasks);


    //perform reinsertion into html file for each task in array
    for(var k = 0; k < array_tasks.length; k++){
      console.log("IN LOOP");
      var ul = document.getElementById('list_tasks');

      var li = document.createElement("tr");
      li.setAttribute('id','tr'+id_iterator);

      var col_1 = document.createElement("th");
      col_1.setAttribute('id', 'col1'+id_iterator);
      col_1.appendChild(document.createTextNode(array_tasks[k]));

      var col_2 = document.createElement("th");
      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.setAttribute('id', String(id_iterator)); // double check
      col_2.appendChild(checkbox);

      id_iterator = id_iterator + 1;

      li.appendChild(col_1);
      li.appendChild(col_2);
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

  });

}

document.addEventListener('DOMContentLoaded', restoreTODO);

//moves task from uncompleted to completed section upon checkbox clicks
//also removes from array since task is outdated
function checkboxAction() {
  //sound effect accompanying action
  var checkBox = this;
  var finishList = document.getElementById('finish_list');
  var soundCondition = document.getElementById('soundOption').checked;
  if (soundCondition == true){
    var random_option = Math.floor(Math.random() * array_possible_audio.length);
    var audio = new Audio('audiofiles/'+array_possible_audio[random_option]);
    audio.play();
  }

  // If the checkbox is checked, display the output text
  if (checkBox.checked == true){

      //physical removal and addition across sections
      var li = document.createElement("div");
      var text = checkBox.id;
      var element = document.getElementById('tr'+text);
      var str = document.getElementById('col1'+text).innerText;
      li.append(document.getElementById('col1'+text).innerText);
      finishList.append(li);
      element.parentNode.removeChild(element);

      console.log("String: "+str);

      //find outdated task in array and remove
      for(var k =0; k < array_tasks.length; k++){
        if(array_tasks[k] === str){
          array_tasks.splice(k,1);
        }
      }

      //reupload updated array to cloud
      chrome.storage.sync.set({todoTable:array_tasks}, function(){
      })
  }
}
