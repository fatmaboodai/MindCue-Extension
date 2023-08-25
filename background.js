// chrome.tabs.onUpdated.addListener((tab)=> {
//     console.log(tab)
    
//     chrome.tabs.get(tab.tabId,(currentTabData)=>{
//         if (currentTabData.url != "chrome://newtab/") {
//     chrome.scripting.excutescript({
//         target:{tabId:currentTabData.id},
//         files: ["content_script.js"]
//     })
//     }
    
//     })
    
//     })
chrome.tabs.onActivated.addListener((tab) => {
    console.log(tab);
  
    chrome.tabs.get(tab.tabId, (currentTabData) => {
      if (currentTabData.url != "chrome://newtab/") {
        chrome.scripting.executeScript({
          target: { tabId: currentTabData.id },
          files: ["content_script.js", "content_script.css"]
        });
      }
    });
  });
  

// reciving a message from the popup 
chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
    console.log(message)
    console.log(sender)
    sendResponse("hello from the other sideeeee i'm backgrounddd")

})