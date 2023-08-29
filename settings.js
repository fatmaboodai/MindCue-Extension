
// // appending the sidebar 

document.addEventListener("DOMContentLoaded",()=>{
    const StartButton = document.getElementById("startRecording")
    chrome.tabs.query({active:true , currentWindow:true},(tabs)=>{
        const tab = tabs[0]
        if(tab.url === undefined || tab.url.indexOf('chrome') == 0){
            StartButton.innerHTML="MindCue Can't Access Chrome page"
        }
        else if (tab.url.indexOf('file') === 0) {
            StartButton.innerHTML="MindCue Can't Access local files"}
        else{
            StartButton.addEventListener("click",async ()=>{
            chrome.tabs.sendMessage(
                tabs[0].id,
                {from :"settings",query:"inject_side_bar"},

            )
          // close the window of the settings page 
            window.close()
            })
    
            }
})
})

 