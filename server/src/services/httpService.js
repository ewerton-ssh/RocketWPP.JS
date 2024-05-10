const app = require('./app.js');
const http = require('http');
const server = http.createServer(app);

module.exports = server;