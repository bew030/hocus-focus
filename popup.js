var el = document.getElementById('checkPage');
if(el){
  el.addEventListener("click", myFunction);
}
function myFunction() {
    document.getElementById("demo").innerHTML = "Paragraph changed.";
   }
