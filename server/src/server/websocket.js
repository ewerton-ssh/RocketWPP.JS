const { Server } = require('socket.io');
const server = require('./server');

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
    },
});

module.exports = io;