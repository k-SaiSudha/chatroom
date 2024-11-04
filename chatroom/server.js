const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Initialize Express and create a server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the "public" directory
app.use(express.static('public'));

// When a client connects
io.on('connection', (socket) => {
    console.log('New client connected');

    // When a user joins a chatroom
    socket.on('join-room', (room) => {
        socket.join(room);
        const userId = `User_${Math.floor(Math.random() * 1000)}`; // Generate a unique user ID
        socket.userId = userId; // Assign the user ID to the socket
        socket.room = room; // Save room name to the socket

        // Notify others in the room that a new user has joined
        socket.to(room).emit('user-joined', userId);
        // Notify the user that they joined the chatroom
        socket.emit('user-connected', userId);
    });

    // Handle incoming messages
    socket.on('message', ({ room, message }) => {
        io.to(socket.room).emit('message', { userId: socket.userId, message }); // Broadcast message to the room
    });

    // When a user disconnects
    socket.on('disconnect', () => {
        console.log(`${socket.userId} disconnected`);
        if (socket.room) {
            io.to(socket.room).emit('user-disconnected', { text: `${socket.userId} has left the chat` });
        }
    });
});

// Start the server
const PORT = 3000;
server.listen(PORT, 'localhost', () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
