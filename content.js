chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "captureScreenshot") {
      chrome.tabs.captureVisibleTab(sender.tab.windowId, { format: "png" }, dataUrl => {
        sendResponse({ screenshotDataUrl: dataUrl });
      });
      return true; // To keep the messaging channel open
    }
  });
  