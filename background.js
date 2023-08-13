chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "getThumbnails") {
      const thumbnails = [];
  
      function fetchTabData(tabs, windowNumber) {
        tabs.forEach(function (tab) {
          const tabData = {
            id: tab.id,
            type: "tab",
            dataUrl: tab.url.startsWith('http') ? `https://www.google.com/s2/favicons?domain=${tab.url}` : null,
            title: tab.title || "Untitled Tab",
            window: `Window ${windowNumber}`
          };
          thumbnails.push(tabData);
        });
      }
  
      function fetchWindowData(windows, index) {
        if (index >= windows.length) {
          sendResponse({ thumbnails });
          return;
        }
  
        const window = windows[index];
  
        chrome.tabs.query({ windowId: window.id }, function (tabs) {
          fetchTabData(tabs, index + 1);
          fetchWindowData(windows, index + 1);
        });
      }
  
      chrome.windows.getAll({ populate: true }, function (windows) {
        fetchWindowData(windows, 0);
      });
  
      return true; // Signal async response
    }
  });



