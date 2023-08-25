// sending message to background!

let v = document.getElementById("sign_in_button")

v.addEventListener("click",sendMessage)
function sendMessage() {
  chrome.runtime.sendMessage(
    "hello background i'm popupppppp",
    (response) =>{
  console.log(response)
    }
  )
}
