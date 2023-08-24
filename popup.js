document.getElementById("sendMessageButton").addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var activeTab = tabs[0];
      chrome.scripting.sendMessage(
        {
          target: { tabId: activeTab.id },
          message: "Hello from the popup!"
        },
        function (response) {
          console.log("Message sent to content script");
        }
      );
    });
  });
  