const streamingElement = document.getElementById('streaming');
const ws = new WebSocket('ws://your-server-address:8080'); // Replace with your WebSocket server address

ws.onmessage = (event) => {
    const chunk = event.data;
    streamingElement.src = URL.createObjectURL(chunk);
};
