
  // SHOWS ONLY THE ACTIVE TAB SCREENSHOOT
// popup.js
// function updateTabList(tabs) {
//   var tabList = document.getElementById('tabList');
//   tabList.innerHTML = '';

//   tabs.forEach(function (tab) {
//     var li = document.createElement('li');
//     var img = document.createElement('img');

//     if (tab.dataUrl) {
//       img.src = tab.dataUrl;
//       li.appendChild(img);
//       tabList.appendChild(li);
//     }
//   });
// }

// chrome.windows.getAll({ populate: true }, function (windows) {
//   var uniqueTabs = [];
//   var tabUrls = [];

//   windows.forEach(function (window) {
//     window.tabs.forEach(function (tab) {
//       if (!tabUrls.includes(tab.url)) {
//         tabUrls.push(tab.url);
        
//         chrome.tabs.captureVisibleTab(tab.windowId, { format: "jpeg" }, function(dataUrl) {
//           tab.dataUrl = dataUrl; // Store the captured dataUrl in the tab object
//           uniqueTabs.push(tab);   // Push the tab to the uniqueTabs array
          
//           if (uniqueTabs.length === tabUrls.length) {
//             updateTabList(uniqueTabs); // Update the tab list once all unique tabs are captured
//           }
//         });
//       }
//     });
//   });
// });


chrome.runtime.sendMessage({ action: "getThumbnails" }, function (response) {
    const thumbnailsContainer = document.getElementById("thumbnails");
  
    let currentWindow = null;
  
    response.thumbnails.forEach(thumbnailData => {
      if (thumbnailData.dataUrl) {
        if (thumbnailData.window !== currentWindow) {
          const windowTitle = document.createElement("h2");
          windowTitle.textContent = thumbnailData.window;
          thumbnailsContainer.appendChild(windowTitle);
          currentWindow = thumbnailData.window;
        }
  
        const tabContainer = document.createElement("div");
        tabContainer.className = "tab-container";
  
        const img = document.createElement("img");
        img.src = thumbnailData.dataUrl;
        tabContainer.appendChild(img);
  
        const title = document.createElement("p");
        title.textContent = thumbnailData.title;
        tabContainer.appendChild(title);
  
        thumbnailsContainer.appendChild(tabContainer);
      }
    });
  });
chrome.runtime.sendMessage({ action: "getThumbnails" }, function (response) {
  const thumbnailsContainer = document.getElementById("thumbnails");
  
  let currentWindow = null;
  
  response.thumbnails.forEach(thumbnailData => {
    if (thumbnailData.screenshotDataUrl) { // Assuming you have screenshot data URL
      if (thumbnailData.window !== currentWindow) {
        const windowTitle = document.createElement("h2");
        windowTitle.textContent = thumbnailData.window;
        thumbnailsContainer.appendChild(windowTitle);
        currentWindow = thumbnailData.window;
      }
  
      const tabContainer = document.createElement("div");
      tabContainer.className = "tab-container";
  
      const screenshotImg = document.createElement("img");
      screenshotImg.src = thumbnailData.screenshotDataUrl;
      tabContainer.appendChild(screenshotImg);
  
      const title = document.createElement("p");
      title.textContent = thumbnailData.title;
      tabContainer.appendChild(title);
  
      thumbnailsContainer.appendChild(tabContainer);
    }
  });
});


