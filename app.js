let mediaRecorder;
let screenStream;

const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const videoElement = document.getElementById('screen-recording');
const streamingElement = document.getElementById('streaming');
const peerConnection = new RTCPeerConnection();

startButton.addEventListener('click', startRecording);
stopButton.addEventListener('click', stopRecording);

async function startRecording() {
    try {
        screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        
        screenStream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, screenStream);
        });

        mediaRecorder = new MediaRecorder(screenStream);
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                const chunk = new Blob([event.data], { type: 'video/webm' });
                peerConnection.send(chunk);
            }
        };

        mediaRecorder.onstop = () => {
            screenStream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
        startButton.disabled = true;
        stopButton.disabled = false;
    } catch (error) {
        console.error('Error accessing screen:', error);
    }
}

function stopRecording() {
    mediaRecorder.stop();
    mediaRecorder = null;
    startButton.disabled = false;
    stopButton.disabled = true;
}

peerConnection.ontrack = (event) => {
    streamingElement.srcObject = event.streams[0];
};

