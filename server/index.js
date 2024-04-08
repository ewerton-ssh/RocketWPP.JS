const app = require('./src/server/app.js');
const server = require('./src/server/server.js');
const path = require('path');

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

// Console message
server.listen(port, () => {
    console.log("Listening on *:", port);
});