const path = require('path');
const { closeRooms } = require('../closeRooms/main.js');
const io = require('../services/websocket.js');
const { createWhatsappSession } = require('../createWhatsappSession/main.js');
const fs = require('fs');

//NeDB Imports
const { dbSettings, dbConnectors } = require('../db/neDb.js')

// Import global variables
const activedSessions = require('../globalVariables/activedSessions.js');
const sessions = require('../globalVariables/sessions.js');

// Bot Id
let botId = '';

// WebSocket connections
io.on("connection", (socket) => {

    // Actived sessions
    socket.emit("active", {
        activedSessions
    });

    // List connectors
    socket.on("listConnectors", () => {
        async function listConnectors() {
            dbConnectors.find({}, (err, dataConnectors) => {
                if (err) {
                    return;
                } else {
                    socket.emit("connectors", { dataConnectors });
                    socket.emit("active", { activedSessions });
                }
            });
        }
        listConnectors();
    });

    // Reload Whatsapp sessions
    socket.on("reloadSessions", (data) => {
        function loadExistingSessions() {
            createWhatsappSession(data.sessionId, socket);
            closeRooms();
            setInterval(closeRooms, 60000);
            return;
        }
        loadExistingSessions();
        activedSessions[data.sessionId] = 'loading'
        socket.emit("active", {
            activedSessions
        });
    });

    // Add connector
    socket.on("add", (recData) => {
        const dataConnector = {
            number: recData.data.number,
            department: recData.data.department
        };
        async function addConnector() {
            dbConnectors.findOne({ number: recData.data.number }, (err, existingConnector) => {
                if (err) {
                    socket.emit("error", { message: "internalError" });
                    return;
                }
                if (existingConnector) {
                    socket.emit("error", { message: "thisRegistered" });
                    return;
                } else {
                    dbConnectors.insert(dataConnector, (err, newConnector) => {
                        if (err) {
                            socket.emit("error", { message: "internalError" });
                            return;
                        };
                        createWhatsappSession(newConnector.number, socket);
                    });
                }
            });
        }
        addConnector();
    });

    // Close and delete sessions
    socket.on("closeSession", async (data) => {
        const sessionId = data.number;
        const client = sessions[sessionId];
        activedSessions[data.number] = 'loading'
        socket.emit("active", {
            activedSessions
        });
        if (client !== undefined){
            client.destroy();
        }
        setTimeout(() => {
            activedSessions[data.number] = ''
            socket.emit("active", {
                activedSessions
            });
        }, 10000);
    });

    // Delete connector data for database
    socket.on("deleteConnectors", (data) => {
        async function deleteConnectors() {
            dbConnectors.remove({ _id: data.id }, {}, (err, numRemoved) => {
                if (err) {
                    console.error('Delete connector error:', err);
                    return;
                }
                if (numRemoved > 0) {
                    const phoneNumber = data.number;
                    const sessionFolder = path.join(__dirname, ".wwebjs_auth", `session-${phoneNumber}`);
                    if (fs.existsSync(sessionFolder)) {
                        fs.rmSync(sessionFolder, { recursive: true });
                    }
                }
            });
        }
        deleteConnectors();
    });


    // Set settings
    socket.on("saveSettings", async (recData) => {
        const dataSettings = {
            _id: recData.data._id,
            id: recData.data.id,
            token: recData.data.token,
            ip: recData.data.ip,
            minutes: recData.data.minutes
        };
        dbSettings.update({ _id: 1234567890 }, dataSettings, { upsert: true }, (err) => {
            return;
        });
    });

    // View settings
    socket.on("viewSetting", async () => {
        dbSettings.findOne({ _id: 1234567890 }, (err, existingSetting) => {
            if (err) {
                return;
            } else {
                socket.emit("viewerSetting", existingSetting);
            }
        });
    });

    // Read and edit bot archives
    socket.on("botAndOptions", async (id) => {
        botId = id;
        if (botId === null) {
            return;
        }
        dbConnectors.findOne({ number: id }, (err, botPath) => {
            if (err) {
                return;
            }
            if (botPath && botPath.botText !== null && botPath.botOptions !== null) {
                socket.emit("textbot", botPath.botText);
                socket.emit("botoptions", botPath.botOptions);
            }
        });
    });

    // Save bot dialogs
    socket.once("insertText", async (value) => {
        dbConnectors.update({ number: botId }, { $set: { botText: JSON.parse(value) } }, {}, (err, numAffected) => {
            if (err) {
                return;
            }
            if (numAffected > 0) {
                socket.emit("reload");
                const client = sessions[botId];
                activedSessions[botId] = 'loading';
                socket.emit("active", {
                    activedSessions
                });
                if (client !== undefined){
                    client.destroy();
                }
                setTimeout(() => {
                    activedSessions[botId] = '';
                    socket.emit("active", {
                        activedSessions
                    });
                }, 10000);
            }
        });
    });

    // Save bot options
    socket.once("insertOptions", async (value) => {
        dbConnectors.update({ number: botId }, { $set: { botOptions: value } }, {}, (err, numAffected) => {
            if (err) {
                return;
            }
            if (numAffected > 0) {
                socket.emit("reload");
                const client = sessions[botId];
                activedSessions[botId] = 'loading';
                socket.emit("active", {
                    activedSessions
                });
                if (client !== undefined){
                    client.destroy();
                }
                setTimeout(() => {
                    activedSessions[botId] = '';
                    socket.emit("active", {
                        activedSessions
                    });
                }, 10000);
            }
        });
    });

});

module.exports = io 