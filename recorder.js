// recorder.js
const recordedVideoElement = document.getElementById("recordedVideo");
let mediaRecorder;
let recordedChunks = [];

async function startRecording() {
    try {
        const constraints = {
            video: {
                displaySurface: 'browser',
                logicalSurface: false,
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
    } catch (error) {
        console.error("Error starting recording:", error);
    }
}

// Call the startRecording function when the recorder page is loaded
startRecording();
