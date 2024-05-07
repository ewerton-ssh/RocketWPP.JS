const { ObjectId } = require('mongodb');
const path = require('path');
const { closeRooms } = require('../closeRooms/main.js');
const io = require('../server/websocket.js');
const { database } = require('../mongoServer/mongo.js');
const { createWhatsappSession } = require('../createWhatsappSession/main.js');
const fs = require('fs');

// MongoDB Config
const collectionConnectors = database.collection('connectors');
const collectionSettings = database.collection('settings');

// Import global variables
const activedSessions = require('../globalVariables/activedSessions.js');
const sessions = require('../globalVariables/sessions.js');

// Bot Id
let botId = '';

// WebSocket connections
io.on("connection", (socket) => {

    // Inicial actived sessions
    socket.emit("active", {
        activedSessions
    });

    // List connectos
    socket.on("listConnectors", () => {
        async function listConnectors() {
            const dataConnectors = await collectionConnectors.find().toArray();
            socket.emit("connectors", {
                dataConnectors
            });
            socket.emit("active", {
                activedSessions
            });
            return;
        };
        listConnectors();
    });

    // Reload Whatsapp sessions
    socket.on("reloadSessions", (data) => {
        function loadExistingSessions() {
            createWhatsappSession(data.sessionId, socket)
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
            const existingConnector = await collectionConnectors.findOne({ number: recData.data.number });
            if (existingConnector) {
                socket.emit("error", { message: "thisRegistered" });
                return;
            } else {
                await collectionConnectors.insertOne(dataConnector);
                createWhatsappSession(dataConnector.number, socket);
                return;
            };
        };
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
        await client.destroy();
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
            const deletedConnector = await collectionConnectors.deleteOne({ _id: new ObjectId(data.id) });
            if (deletedConnector) {
                const phoneNumber = data.number;
                const sessionFolder = path.join(__dirname, ".wwebjs_auth", `session-${phoneNumber}`);
                if (fs.existsSync(sessionFolder)) {
                    fs.rmSync(sessionFolder, { recursive: true });
                }
            };
            return;
        };
        deleteConnectors();
    });

    // Set Settings
    socket.on("saveSettings", async (recData) => {
        const dataSettings = {
            _id: recData.data._id,
            id: recData.data.id,
            token: recData.data.token,
            ip: recData.data.ip,
            minutes: recData.data.minutes
        };
        const existingSetting = await collectionSettings.findOne({ _id: dataSettings._id });
        if (existingSetting === null) {
            await collectionSettings.insertOne(dataSettings);
            return;
        } else {
            const filter = { _id: dataSettings._id };
            const update = {
                $set: {
                    id: dataSettings.id,
                    token: dataSettings.token,
                    ip: dataSettings.ip,
                    minutes: dataSettings.minutes
                }
            };
            await collectionSettings.updateOne(filter, update);
            return;
        };
    });

    // View Settings
    socket.on("viewSetting", async () => {
        const existingSetting = await collectionSettings.findOne({ _id: 1234567890 });
        socket.emit("viewerSetting", (existingSetting));
    });

    // Read and edit bot archives
    socket.on("botAndOptions", async (id) => {
        botId = id
        if (botId === null) {
            return;
        }
        const botPath = await collectionConnectors.findOne({ number: id });
        if (botPath.botText !== null && botPath.botOptions !== null) {
            socket.emit("textbot", (botPath.botText));
            socket.emit("botoptions", (botPath.botOptions));
        }
    });

    // Save bot dialogs
    socket.once("insertText", async (value) => {
        const success = await collectionConnectors.updateOne({ number: botId }, { $set: { botText: JSON.parse(value) } });
        if (success) {

            socket.emit("reload");
            const client = sessions[botId];
            activedSessions[botId] = 'loading';

            socket.emit("active", {
                activedSessions
            });
            
            await client.destroy();

            setTimeout(() => {
                activedSessions[botId] = ''
                socket.emit("active", {
                    activedSessions
                });
            }, 10000);

            return;
        };
    });

    // Save bot options
    socket.once("insertOptions", async (value) => {
        const success = await collectionConnectors.updateOne({ number: botId }, { $set: { botOptions: value } });
        if (success) {

            socket.emit("reload");
            const client = sessions[botId];
            activedSessions[botId] = 'loading';

            socket.emit("active", {
                activedSessions
            });
            
            await client.destroy();

            setTimeout(() => {
                activedSessions[botId] = ''
                socket.emit("active", {
                    activedSessions
                });
            }, 10000);

            return;
        };
    });

});

module.exports = io 