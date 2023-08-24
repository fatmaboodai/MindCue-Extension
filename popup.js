document.getElementById('toggleButton').addEventListener('click', function () {
    chrome.runtime.sendMessage({ action: 'toggleSidePanel' });
  });
  