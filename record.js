let mediaRecorder;
let screenStream;
let ws;

const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const videoElement = document.getElementById('screen-recording');

startButton.addEventListener('click', startRecording);
stopButton.addEventListener('click', stopRecording);

async function startRecording() {
    try {
        screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        
        mediaRecorder = new MediaRecorder(screenStream);
        const chunks = [];

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                chunks.push(event.data);
                ws.send(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            videoElement.src = url;
        };

        mediaRecorder.start();
        startButton.disabled = true;
        stopButton.disabled = false;
    } catch (error) {
        console.error('Error accessing screen:', error);
    }

    ws = new WebSocket('ws://your-server-address:8080'); // Replace with your WebSocket server address
}

function stopRecording() {
    mediaRecorder.stop();
    screenStream.getTracks().forEach((track) => track.stop());
    startButton.disabled = false;
    stopButton.disabled = true;
    ws.close();
}
