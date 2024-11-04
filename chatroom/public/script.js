// Connect to the Socket.IO server
const socket = io();

// Select DOM elements
const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const roomTitle = document.getElementById('room-title');

// Get the room name from the URL
const params = new URLSearchParams(window.location.search);
const room = params.get('room');

// Display room name in chatroom title
roomTitle.textContent = `Room: ${room}`;

// Join the specified room
socket.emit('join-room', room);

// Listen for connection confirmation and show the user ID
socket.on('user-connected', (userId) => {
    displayMessage(`${userId} connected to the chat.`);
});

// Listen for user join notifications
socket.on('user-joined', (userId) => {
    displayMessage(`${userId} joined the chat.`);
});

// Listen for incoming messages
socket.on('message', ({ userId, message }) => {
    displayMessage(`${userId}: ${message}`);
});

// Listen for disconnection messages
socket.on('user-disconnected', (data) => {
    displayMessage(`${data.text}`);
});

// Send message to the server when the send button is clicked
sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        socket.emit('message', { room, message });
        displayMessage(`You: ${message}`);
        messageInput.value = ''; // Clear the input box
    }
});

// Display messages in the chat box
function displayMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}
