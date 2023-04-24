
    
// Get the video element with id="myVideo"
var x = document.getElementById("myVideo");

// Attach a timeupdate event to the video element, and execute a function if the current playback position has changed
x.addEventListener("timeupdate", myFunction);
var hasAlertedAt5 = false;
var hasAlertedAt10 = false;
var hasAlertedAt15 = false;

function myFunction() {
  // Display the current position of the video in a p element with id="demo"
  document.getElementById("demo").innerHTML = x.currentTime;

  if (x.currentTime >= 5 && !hasAlertedAt5) {
    myalert();
    hasAlertedAt5 = true;
  }

  if (x.currentTime >= 10 && !hasAlertedAt10) {
    myalert();
    hasAlertedAt10 = true;
  }

  if (x.currentTime >= 80 && !hasAlertedAt15) {
    myalert();
    hasAlertedAt15 = true;
  }

}
myalert();
    function myalert() {
        Swal.fire({
        title:'<html> \
        <span class="title-class">Wait a minute!</span> <br> \
        <span class="title-class2">The following scene may contain harmful material</span>\
        </html>',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Skip the scene',
        denyButtonText: `Dismiss`,
        background:'#F5F5F5',
        showClass:{
          popup: 'pop-up-class',
          container: 'container-class',
        }

        }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            x.currentTime+=30;
            x.play();
        
        } else if (result.isDenied) {
            x.play();
        }
        })
        }
        