chrome.tabs.onActivated.addListener((tab) => {
    console.log(tab);

    chrome.tabs.get(tab.tabId, (currentTabData) => {
      if (currentTabData.url !== "chrome://newtab") {
        chrome.scripting.executeScript({
          target: { tabId: currentTabData.id },
          files: ["content_script.js","content_script.css"]
        });
        setTimeout(()=>{
          chrome.tabs.sendMessage(
            tab.tabId,
        "hey i have injected you tab : "+ tab.tabId ,
            (response) => {
             console.log(response)
            }
          );
        },5000)
      }

    });
  });
  


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.reloadTab) {
    // Reload the current tab when requested
    chrome.tabs.reload();
  }
});
