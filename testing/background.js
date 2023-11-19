
let socket = null;

function connectWebSocket() {
        socket = io('http://localhost:5000'); // Your WebSocket server URL

        socket.on('connect', function() {
            console.log('Connected to Flask server');
        });

        socket.on('message', function(data) {
            console.log('Received message:', data);
        });

        socket.on('disconnect', function() {
            console.log('Disconnected from Flask server');
        });
    
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action === "startWebSocket") {
            connectWebSocket();
        }
    }
);
