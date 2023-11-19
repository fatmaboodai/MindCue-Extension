import { createServer } from 'http';
import { Server, OPEN } from 'ws';
import fs from 'fs';

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('WebSocket Server is running');
});

const wss = new Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    // Broadcast received messages to all connected clients (viewers).
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === OPEN) {
        // You may want to handle different message types here.
        client.send(message);
      }
    });
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(8080, () => {
  console.log('WebSocket Server is running on port 8080');
});
