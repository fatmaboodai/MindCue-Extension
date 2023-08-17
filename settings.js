
// with the tab select


const startRecordingButton = document.getElementById("startRecording");
const recordedVideoElement = document.getElementById("recordedVideo");
let mediaRecorder;
let recordedChunks = [];

async function startRecording() {
    try {
        const constraints = {
            video: {
                displaySurface: 'browser',
                logicalSurface: false,
                mediaSource: 'window'
            },
            audio: false
        };

        const stream = await navigator.mediaDevices.getDisplayMedia(constraints);

        mediaRecorder = new MediaRecorder(stream);
        
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const recordedBlob = new Blob(recordedChunks, { type: 'video/webm' });
            recordedVideoElement.src = URL.createObjectURL(recordedBlob);
        };

        mediaRecorder.start();
        startRecordingButton.disabled = true;
    } catch (error) {
        console.error("Error starting recording:", error);
    }
}

startRecordingButton.addEventListener("click", startRecording);


const openRecorder = async () => {
    // Get the URL of the recorder page from the extension's resources
    const recorderUrl = chrome.runtime.getURL("recorder.html");
    
    // Open the recorder page in a new tab
    const tab = await chrome.tabs.create({ url: recorderUrl });
};

startRecordingButton.addEventListener("click", openRecorder);












//////////////////////////////////////////////////////



// //  without the tab select
// var btnStopRecording = document.getElementById("stopRecording");
// var btnStartRecording = document.getElementById("startRecording");
// var video = document.getElementById("recordedVideo");
// var recorder;

// btnStartRecording.onclick = function () {
//     btnStartRecording.disabled = true;
//     btnStopRecording.disabled = false;

//     recorder = new RecordRTC_Extension();
//     recorder.startRecording({
//         enableScreen: true,
//     });
// };

// btnStopRecording.onclick = function () {
//     btnStartRecording.disabled = false;
//     btnStopRecording.disabled = true;

//     recorder.stopRecording(function (blob) {
//         var url = URL.createObjectURL(blob);
//         video.src = url;
//     });
// };














