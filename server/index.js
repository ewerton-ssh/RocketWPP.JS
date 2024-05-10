const app = require('./src/services/app.js');
const express = require('express');
const server = require('./src/services/httpService.js');
const path = require('path');
const fs = require('fs');

// .env config
require('dotenv').config({ path: path.join(__dirname, 'config', '.env') });

// Port for service
const port = process.env.PORT;

// WebSocket connect
const io = require('./src/webSockets/main.js');
io.on('', () => {});

// Http webCache wwebjs server
app.get('/webcache', (req, res) => {
    if (req.url === '/webcache') {
        // Read whatsapp html cache doc
        fs.readFile(path.join(__dirname, './webCache', '2.2409.0.html'), (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Internal server error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(data);
            }
        });
    } else {
        res.writeHead(404);
        res.end('Page not found, error 404');
    }
});

// Http site server
app.use(express.static(path.join(__dirname, './dist')));

app.get('/', (req, res) => {
    if (req.url === '/') {
        // Read whatsapp html cache doc
        fs.readFile(path.join(__dirname, './dist', 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Internal server error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else {
        res.writeHead(404);
        res.end('Page not found, error 404');
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './dist', 'index.html'));
});

// Console message
server.listen(port, () => {
    console.log("Server on *:", port, '🚀');
});