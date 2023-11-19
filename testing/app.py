from flask import Flask, render_template
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")  # Allow CORS for all domains

@socketio.on('connect')
def test_connect():
    print('Client connected')

@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected')

@socketio.on('message')
def handle_message(data):
    print('received message: ' + data)
    socketio.send('Echo: ' + data)  # Echo back the received message

if __name__ == '__main__':
    socketio.run(app, debug=False)
