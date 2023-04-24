
    
// Get the video element with id="myVideo"
var x = document.getElementById("myVideo");
function enableMute(){ 
  x.muted = true;
} 
// Attach a timeupdate event to the video element, and execute a function if the current playback position has changed
x.addEventListener("timeupdate", myFunction);
var hasAlertedAt5 = false;
var hasAlertedAt10 = false;
var hasAlertedAt15 = false;

function myFunction() {
  // Display the current position of the video in a p element with id="demo"
  document.getElementById("demo").innerHTML = x.currentTime;

  if (x.currentTime >= 5 && !hasAlertedAt5) {
    x.pause()
    myalert();
    hasAlertedAt5 = true;
  }

  if (x.currentTime >= 45 && !hasAlertedAt10) {
    x.pause()
    myalert();
    hasAlertedAt10 = true;
  }

  if (x.currentTime >= 80 && !hasAlertedAt15) {
    x.pause()
    myalert();
    hasAlertedAt15 = true;
  }

}
myalert();
    function myalert() {
        Swal.fire({
        title:'<html> \
        <span class="title-class">Wait a minute!</span> <br> \
        <span class="title-class2">The following content may contain material you are not comfortable with</span>\
        </html>',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: '<html><span class="skip-button-text">Skip the scene</span></html>',
        denyButtonText: `<html><span class="skip-button-text">Dismiss</span></html>`,
        cancelButtonText:'<html><span class="skip-button-text">Play Audio Only</span></html>',
        confirmButtonClass: 'Skip-Button',
        cancelButtonClass: 'Skip-Button',
        denyButtonClass:'Skip-Button',
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
        else if (result.isDismissed) {
          x.muted=true;
          x.play();
      }
        })
        x.muted=false;
        }
      

