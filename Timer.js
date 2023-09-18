let hoursInput = document.getElementById('hours');
let minutesInput = document.getElementById('minutes');
let secondsInput = document.getElementById('seconds');
let setButton = document.getElementById('set-timer-btn');
let timer;

// Function to save the timer values to Chrome storage and console log them
function saveAndLogTimerValues() {
    let hours = parseInt(hoursInput.value);
    let minutes = parseInt(minutesInput.value);
    let seconds = parseInt(secondsInput.value);

    // Save the timer values to Chrome storage
    chrome.storage.sync.set({ timer: { hours, minutes, seconds } });

    // Log the timer values to the console
    console.log('Timer values saved to storage:', { hours, minutes, seconds });

    // Send a message to the content script with the updated values
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { timer: { hours, minutes, seconds } });
    });
}

// Event listeners for input fields
hoursInput.addEventListener('input', saveAndLogTimerValues);
minutesInput.addEventListener('input', saveAndLogTimerValues);
secondsInput.addEventListener('input', saveAndLogTimerValues);

// Event listener for the "Set" button
setButton.addEventListener('click', function () {
    let hours = parseInt(hoursInput.value);
    let minutes = parseInt(minutesInput.value);
    let seconds = parseInt(secondsInput.value);

    updateTime(hours, minutes, seconds);
    showAlert(hours, minutes, seconds);

    // Save the timer values to Chrome storage
    saveAndLogTimerValues();
});

// Rest of your code...


function updateTime(hours, minutes, seconds) {
    hoursInput.value = formatDoubleDigit(hours);
    minutesInput.value = formatDoubleDigit(minutes);
    secondsInput.value = formatDoubleDigit(seconds);
}

function showAlert(hours, minutes, seconds) {
    alert(`Time saved: ${formatDoubleDigit(hours)} hours ${formatDoubleDigit(minutes)} minutes ${formatDoubleDigit(seconds)} seconds`);
}

function formatDoubleDigit(num) {
    return num < 10 ? `0${num}` : num.toString();
}

// Format input values when the page loads
window.addEventListener('load', function () {
    chrome.storage.sync.get(['timer'], function (result) {
        if (result.timer) {
            const { hours, minutes, seconds } = result.timer;
            updateTime(hours, minutes, seconds);
        } else {
            // If no timer values are stored, display "00" for all inputs
            updateTime(0, 0, 0);
        }
    });
});
