console.log("test test")
let sidePanelOpen = false;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'toggleSidePanel') {
    sidePanelOpen = !sidePanelOpen;
    chrome.action.setPopup({
      tabId: sender.tab.id,
      popup: sidePanelOpen ? 'sidepanel.html' : ''
    });
  }
});
