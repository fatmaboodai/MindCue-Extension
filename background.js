// background.js

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("Received message from content script:", request);
  
    // You can send a response back to the content script if needed
    sendResponse({message: "Message received in background script!"});
  });
// background.js

// Function to start monitoring screen recording status
function startMonitoringScreenRecording() {
    chrome.desktopCapture.chooseDesktopMedia(
      ["screen", "window"],
      chrome.runtime.id,
      function (streamId) {
        if (streamId) {
          // Screen recording has started, open the timer page
          chrome.tabs.create({ 'url': 'chrome://extensions/?popup=' + chrome.runtime.id });
        } else {
          // User canceled or didn't grant permission
          console.log("Screen recording canceled.");
        }
      }
    );
  }
  
  // Listen for a message to start monitoring
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.startRecording) {
      startMonitoringScreenRecording();
    }
  });
  