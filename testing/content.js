

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action == "injectButton") {
            injectButtonIntoPage();
        }
    }
);

function injectButtonIntoPage() {
    var wsButton = document.createElement('button');
    wsButton.innerText = 'Connect WebSocket';
    wsButton.id = 'wsButton';
    wsButton.addEventListener('click', function() {
        // Establish WebSocket connection only when this button is clicked
        var socket = io('http://localhost:5000');  // WebSocket server URL

        socket.on('connect', function() {
            console.log('Connected to Flask server');
            socket.send('Hello from injected button!');
        });

        socket.on('message', function(data) {
            console.log('Received message:', data);
        });
    });

    document.body.appendChild(wsButton);
}










// function injectButtonIntoPage() {
//     var wsButton = document.createElement('button');
//     wsButton.innerText = 'Connect WebSocket';
//     wsButton.id = 'wsButton';
//     wsButton.addEventListener('click', function() {
//         chrome.runtime.sendMessage({action: "startWebSocket"});
//     });

//     document.body.appendChild(wsButton);
// }

// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
//         if (request.action === "injectButton") {
//             injectButtonIntoPage();
//         }
//     }
// );
