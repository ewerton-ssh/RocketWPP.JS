const app = require('./src/services/app.js');
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

// Http server
app.get('/', (req, res) => {
    res.send("<h1 style='background-color:green;' >Active!!!</h1>");
});

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

// Console message
server.listen(port, () => {
    console.log("Server on *:", port, '🚀');
});