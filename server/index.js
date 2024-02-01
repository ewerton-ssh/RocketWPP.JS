require("dotenv").config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const http = require('http');
const https = require('https');
const server = http.createServer(app);
const { Server } = require('socket.io');
const { ObjectId, MongoClient } = require('mongodb');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { exec } = require('child_process');

// Bot Config
const textbot = require('./bot_dialogs/main.json');
const options = require('./bot_dialogs/options');
const headless = require('./headless.json');

// MongoDB Config
const uri = process.env.MONGOURL;
const dbclient = new MongoClient(uri);
const database = dbclient.db(process.env.DBNAME);
const collectionConnectors = database.collection('connectors');
const collectionSettings = database.collection('settings');

// Control active status
let active = false;

// Http server
app.get('/', (req, res) => {
    res.send("<h1 style='background-color:green;' >Active!!!</h1>");
});
server.listen(port, () => {
    console.log("Listening on *:", port);
});

// Whatsapp-web.js
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');

const createWhatsappSession = (id, socket) => {
    const client = new Client({
        puppeteer: {
            executablePath: process.env.CHROME_EXECUTABLE_PATH,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-web-security',
                '--disable-features=IsolateOrigins,site-per-process',
            ],
            headless: Boolean(process.env.HEADLESS),
            timeout: 30000,
        },
        authStrategy: new LocalAuth({
            clientId: id,
        }),
    });

    client.on('disconnected', () => {
        console.log('The client has been disconnected.');
    });

    client.on('qr', (qr) => {
        socket.emit('clientqr', {
            qr,
        });
    });

    client.on('ready', () => {
        socket.emit('clientisready', {
            message: "clientisready"
        });
        active = true;

        // Start Chat
        app.post('/start-chat', (req, res) => {

            let requestData = '';

            req.on('data', (chunk) => {
                requestData += chunk;
            });

            req.on('end', () => {
                try {
                    const data = JSON.parse(requestData);
                    const match = data.text.match(/enviawpp\s*(\d+)(?:,\s*(.+))?/);
                    if (match) {
                        const phoneNumber = match[1] + "@c.us";
                        if (match[2]) {
                            const messageText = match[2];
                            async function sendMessage() {
                                const configData = await collectionSettings.findOne({ _id: 1234567890 });
                                const adress = configData.ip;
                                const headers = {
                                    'Content-Type': 'application/json',
                                    'X-Auth-Token': configData.token,
                                    'X-User-Id': configData.id,
                                };
                                // Send Whatsapp Message
                                try {
                                    await client.sendMessage(phoneNumber, `*${data.user_name}*\n${messageText}`);
                                } catch (error) {
                                    await axios.post(`http://${adress}/api/v1/chat.postMessage`, {
                                        channel: "general",
                                        text: `🤖\n_Invalid number or comand, please check the number_ ${phoneNumber}!`
                                    }, {
                                        headers: headers
                                    })
                                        .then(response => {
                                        })
                                        .catch(error => {
                                        });
                                    return;
                                };
                                // Create visitor
                                await axios.post(`http://${adress}/api/v1/livechat/visitor/`, {
                                    visitor: {
                                        token: phoneNumber,
                                        name: phoneNumber,
                                        username: phoneNumber,
                                        phone: phoneNumber,
                                    }
                                },
                                    {
                                        headers: headers
                                    })
                                    .then(response => {
                                    })
                                    .catch(error => {
                                    });
                                // Create room
                                await axios.get(`http://${adress}/api/v1/livechat/room?token=${phoneNumber}`);
                            };
                            sendMessage();
                        };
                        res.status(200).send('Sucess');
                    } else {
                        res.status(400).send("Bad Request");
                    }
                } catch (error) {
                    console.error(error);
                    res.status(500).send("Internal Server Error");
                }
            });
        });

        // Webhook
        app.post('/rocketjs-webhook', (req, res) => {

            let data = '';

            req.on('data', (chunk) => {
                data = chunk;
            });
            req.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    const visitorData = jsonData.visitor;
                    const messageData = jsonData.messages;
                    async function rocketSendMessage() {
                        if (messageData && messageData.length > 0 && messageData[0].u) {
                            const data = await collectionSettings.findOne({ _id: 1234567890 });
                            //const adress = data.ip;
                            if (messageData[0].closingMessage === true) {
                                try {
                                    await client.sendMessage(visitorData.phone[0].phoneNumber, textbot.encerramento);
                                } catch (error) {
                                    return;
                                }
                                // Delete user on close chat. await axios.delete(`http://${adress}/api/v1/livechat/visitor/${visitorData.token}`);
                                return;
                            } else {
                                if (messageData[0].msg === '') {
                                    try {
                                        const media = await MessageMedia.fromUrl(messageData[0].fileUpload.publicFilePath, { unsafeMime: true });
                                        await client.sendMessage(visitorData.phone[0].phoneNumber, media);
                                        return;
                                    } catch (error) {
                                        console.error('Media process error:', error);
                                    }
                                    return;
                                } else {
                                    await client.sendMessage(visitorData.phone[0].phoneNumber, `*${messageData[0].u.name}* \n${messageData[0].msg}`);
                                    return;
                                };
                            };
                        };
                    };
                    rocketSendMessage();
                    res.status(200).send();
                } catch (error) {
                    res.status(500).send("Internal Server Error");
                }
            });
        });
    });

    // Rocket send message
    async function sendRocketMessage(message, hasMedia) {
        const data = await collectionSettings.findOne({ _id: 1234567890 });
        const adress = data.ip;
        const headers = {
            'Content-Type': 'application/json',
            'X-Auth-Token': data.token,
            'X-User-Id': data.id,
        };
        const header = {
            'Content-Type': 'application/json'
        }

        const getInfoChat = await message.getChat();
        const body = message.body;
        const number = message.from;
        let nickSender = '';
        let visitorHeader = {};
        let mediaHeader = {};
        let messageData = {};
        let matchingRoom = {};

        async function rocketMessage(roomId) {
            // Has media, send media
            const mediaData = new FormData();
            const filePath = hasMedia;

            if (getInfoChat.isGroup) {
                mediaHeader = {
                    'x-visitor-token': getInfoChat.name
                };
            } else {
                mediaHeader = {
                    'x-visitor-token': number
                };
            }

            if (hasMedia !== undefined) {
                sendMediaMessage();
            }

            async function sendMediaMessage() {
                if (message.type === 'image' || message.type === 'sticker') {
                    const arquivo = fs.readFileSync(filePath);
                    const blob = new Blob([arquivo], { type: 'image/jpeg' });
                    mediaData.append('file', blob, `${message.from}_${Date.now()}.jpg`);
                    //mediaData.append('description', 'image file');
                    try {
                        await axios.post(`http://${adress}/api/v1/livechat/upload/${roomId}`, mediaData, {
                            headers: mediaHeader
                        });
                    } catch (error) {
                    }
                } else if (message.type === 'ptt' || message.type === 'audio') {
                    const arquivo = fs.readFileSync(filePath);
                    const blob = new Blob([arquivo], { type: 'audio/mp3' });
                    mediaData.append('file', blob, `${message.from}_${Date.now()}.mp3`);
                    //mediaData.append('description', 'audio file');
                    try {
                        await axios.post(`http://${adress}/api/v1/livechat/upload/${roomId}`, mediaData, {
                            headers: mediaHeader
                        });
                    } catch (error) {
                    }
                } else if (message.type === 'video') {
                    const arquivo = fs.readFileSync(filePath);
                    const blob = new Blob([arquivo], { type: 'video/mp4' });
                    mediaData.append('file', blob, `${message.from}_${Date.now()}.mp4`);
                    //mediaData.append('description', 'video file');
                    try {
                        await axios.post(`http://${adress}/api/v1/livechat/upload/${roomId}`, mediaData, {
                            headers: mediaHeader
                        });
                    } catch (error) {
                    }
                } else if (message.type === 'document') {
                    const arquivo = fs.readFileSync(filePath);
                    const blob = new Blob([arquivo], { type: 'document/archive' });
                    mediaData.append('file', blob, `${message.from}_${Date.now()}_${message.body}`);
                    //mediaData.append('description', 'document');
                    try {
                        await axios.post(`http://${adress}/api/v1/livechat/upload/${roomId}`, mediaData, {
                            headers: mediaHeader
                        });
                    } catch (error) {
                    }
                }
            };

            if (getInfoChat.isGroup) {
                messageData = {
                    token: getInfoChat.name,
                    rid: roomId,
                    msg: `*${message._data.notifyName}*\n${message.body}`
                }
            } else {
                messageData = {
                    token: number,
                    rid: roomId,
                    msg: message.body
                }
            }

            await axios.post(`http://${adress}/api/v1/livechat/message`, messageData, {
                header: header
            })
                .then(response => {
                })
                .catch(error => {
                });
        }

        if (getInfoChat.isGroup) {
            nickSender = `(${getInfoChat.name})`;
            visitorHeader = {
                token: getInfoChat.name,
                name: nickSender,
                username: number,
                phone: number,
            }
        } else {
            nickSender = message._data.notifyName;
            visitorHeader = {
                token: number,
                name: nickSender,
                username: number,
                phone: number,
            }
        }

        // Create new vistor and manager bot & messages
        async function createVisitor(data, roomId) {
            if (data === 'newVisitor') {
                await axios.post(`http://${adress}/api/v1/livechat/visitor/`, {
                    visitor: visitorHeader
                },
                    {
                        headers: headers
                    })
                    .then(response => {
                    })
                    .catch(error => {
                    });
                await message.reply(textbot.mensagem_texto);
            } else if (data === 'closedRoom') {
                const chosedOption = options(body);
                if (chosedOption === 'falseOption') {
                    await message.reply(textbot.erro);
                } else if (chosedOption === 'resposta_bot') {
                    await message.reply(textbot.resposta_bot);
                } else {
                    // Create Room
                    async function createRoom() {
                        if (getInfoChat.isGroup) {
                            await axios.get(`http://${adress}/api/v1/livechat/room?token=${getInfoChat.name}`)
                                .then(response => {
                                    async function messageResponse() {
                                        await message.reply(textbot.sucesso);
                                    };
                                    messageResponse();
                                })
                                .catch(error => {
                                    async function errorResponse() {
                                        if (!error.response.data.success) {
                                            await message.reply(textbot.sem_atendimento);
                                        };
                                    };
                                    errorResponse();
                                });
                        } else {
                            await axios.get(`http://${adress}/api/v1/livechat/room?token=${number}`)
                                .then(response => {
                                    async function messageResponse() {
                                        await message.reply(textbot.sucesso);
                                    };
                                    messageResponse();
                                })
                                .catch(error => {
                                    async function errorResponse() {
                                        if (!error.response.data.success) {
                                            await message.reply(textbot.sem_atendimento);
                                        };
                                    };
                                    errorResponse();
                                });
                        }
                    }
                    // Create Room
                    await axios.post(`http://${adress}/api/v1/livechat/visitor/`, {
                        visitor: visitorHeader
                    },
                        {
                            headers: headers
                        })
                        .then(response => {
                            // Create Room
                            createRoom();
                        })
                        .catch(error => {
                        });
                }

            } else if (data === 'openedRoom') {
                rocketMessage(roomId);
            };
        };

        //Open room
        async function openRooms() {
            await axios.get(`http://${adress}/api/v1/livechat/rooms?open`, {
                headers: headers
            })
                .then(response => {
                    let idToTokenMap = response.data.rooms.map(function (data, index) {
                        const roomId = data._id;
                        const token = data.v.token;
                        return { index, roomId, token };
                    });

                    if (getInfoChat.isGroup) {
                        matchingRoom = idToTokenMap.find(obj => obj.token === getInfoChat.name);
                    } else {
                        matchingRoom = idToTokenMap.find(obj => obj.token === number);
                    }

                    if (matchingRoom) {
                        createVisitor('openedRoom', matchingRoom.roomId);
                        matchingRoom = {};
                        return;
                    } else {
                        createVisitor('closedRoom');
                        matchingRoom = {};
                        return;
                    }
                })
                .catch(error => {
                });
        }

        // Decide the message is the new or old visitor
        if (getInfoChat.isGroup) {
            await axios.get(`http://${adress}/api/v1/livechat/visitor/${getInfoChat.name}`)
                .then(response => {
                    openRooms();
                })
                .catch(error => {
                    if (error.response.status === 400) {
                        createVisitor('newVisitor');
                    };
                });
        } else {
            await axios.get(`http://${adress}/api/v1/livechat/visitor/${number}`)
                .then(response => {
                    openRooms();
                })
                .catch(error => {
                    if (error.response.status === 400) {
                        createVisitor('newVisitor');
                    };
                });
        }
    }

    // Message
    client.on('message', async (message) => {
        // Media message
        if (message.hasMedia) {
            if (message.type === 'image' || message.type === 'sticker') {
                const media = await message.downloadMedia();
                const filename = `${message.from}_${Date.now()}.jpg`;
                const folderPath = path.join(__dirname, 'whatsapp-images');
                if (!fs.existsSync(folderPath)) {
                    fs.mkdirSync(folderPath);
                }
                const imagePath = path.join(folderPath, filename);
                fs.writeFileSync(imagePath, media.data, 'base64');
                await sendRocketMessage(message, `whatsapp-images/${filename}`);
            } else if (message.type === 'ptt' || message.type === 'audio') {
                const media = await message.downloadMedia();
                const filename = `${message.from}_${Date.now()}.mp3`;
                const folderPath = path.join(__dirname, 'whatsapp-audios');
                if (!fs.existsSync(folderPath)) {
                    fs.mkdirSync(folderPath);
                }
                const audioPath = path.join(folderPath, filename);
                fs.writeFileSync(audioPath, media.data, 'base64');
                await sendRocketMessage(message, `whatsapp-audios/${filename}`);
            } else if (message.type === 'video') {
                const media = await message.downloadMedia();
                const filename = `${message.from}_${Date.now()}.mp4`;
                const folderPath = path.join(__dirname, 'whatsapp-videos');
                if (!fs.existsSync(folderPath)) {
                    fs.mkdirSync(folderPath);
                }
                const audioPath = path.join(folderPath, filename);
                fs.writeFileSync(audioPath, media.data, 'base64');
                await sendRocketMessage(message, `whatsapp-videos/${filename}`);
            } else if (message.type === 'document') {
                const media = await message.downloadMedia();
                const filename = `${message.from}_${Date.now()}_${message.body}`;
                const folderPath = path.join(__dirname, 'whatsapp-documents');
                if (!fs.existsSync(folderPath)) {
                    fs.mkdirSync(folderPath);
                }
                const audioPath = path.join(folderPath, filename);
                fs.writeFileSync(audioPath, media.data, 'base64');
                await sendRocketMessage(message, `whatsapp-documents/${filename}`);
            }
        } else {
            // Text Message
            await sendRocketMessage(message);
        }
    });

    // Close and delete sessions
    socket.on("closeSession", async () => {
        await client.destroy();
        socket.emit("active", { message: "dead" });
    });

    socket.on("deleteConnectors", async (data) => {
        async function deleteConnectors() {
            const deletedConnector = await collectionConnectors.deleteOne({ _id: new ObjectId(data.id) });
            if (deletedConnector) {
                const phoneNumber = data.number;
                const sessionFolder = path.join(__dirname, ".wwebjs_auth", `session-${phoneNumber}`);
                if (fs.existsSync(sessionFolder)) {
                    fs.rmSync(sessionFolder, { recursive: true });
                    console.log("Session deleted!");
                }
            }
        }
        deleteConnectors();
    });
    client.initialize();
};


// Socket io connection
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {

    socket.emit("connected", { message: "approved!" });

    socket.on("reloadSessions", () => {
        const loadExistingSessions = async () => {
            const existingSessions = await collectionConnectors.find().toArray();
            for (const session of existingSessions) {
                const number = session.number;
                createWhatsappSession(number, socket);
            };
            socket.emit("active", { message: "loading" });

        };
        loadExistingSessions();
    });

    socket.on("add", (recData) => {
        const dataConnector = {
            number: recData.data.number,
            department: recData.data.department
        }
        async function addConnector() {
            const existingConnector = await collectionConnectors.findOne({ number: recData.data.number })
            if (existingConnector) {
                socket.emit("error", { message: "thisRegistered" });
            } else {
                await collectionConnectors.insertOne(dataConnector);
                createWhatsappSession(dataConnector.number, socket);
            }
        }
        addConnector();
    });

    socket.on("listConnectors", () => {
        async function listConnectors() {
            const dataConnectors = await collectionConnectors.find().toArray();
            socket.emit("connectors", { dataConnectors });
            if (active) {
                socket.emit("active", { message: "actived" });
            }
        }
        listConnectors();
    });

    if (!active) {
        socket.emit("active", { message: "dead" });
    }

    socket.on("deleteConnectors", (data) => {
        async function deleteConnectors() {
            const deletedConnector = await collectionConnectors.deleteOne({ _id: new ObjectId(data.id) });
            if (deletedConnector) {
                const phoneNumber = data.number;
                const sessionFolder = path.join(__dirname, ".wwebjs_auth", `session-${phoneNumber}`);
                if (fs.existsSync(sessionFolder)) {
                    fs.rmSync(sessionFolder, { recursive: true });
                }
            }
        }
        deleteConnectors();
    });

    socket.on("saveSettings", async (recData) => {
        const dataSettings = {
            _id: recData.data._id,
            id: recData.data.id,
            token: recData.data.token,
            ip: recData.data.ip
        };
        const existingSetting = await collectionSettings.findOne({ _id: dataSettings._id });
        if (existingSetting === null) {
            await collectionSettings.insertOne(dataSettings);
        } else {
            const filter = { _id: dataSettings._id };
            const update = {
                $set: {
                    id: dataSettings.id,
                    token: dataSettings.token,
                    ip: dataSettings.ip
                }
            };
            await collectionSettings.updateOne(filter, update);
        };
    });

    socket.on("viewSetting", async () => {
        const existingSetting = await collectionSettings.findOne({ _id: 1234567890 });
        socket.emit("viewerSetting", (existingSetting));
    });

    // Retart pm2 all process function

    async function retartPm2Process() {
        const command = 'pm2 restart all';

        exec(command, (erro, stdout, stderr) => {
            if (erro) {
                console.error(`Comand error: ${erro.message}`);
                return;
            }

            if (stderr) {
                console.error(`Stderr error: ${stderr}`);
                return;
            }

            console.log(`command log:\n${stdout}`);
        });
    }

    // Read and edit bot archives

    const dialogsFilePath = './bot_dialogs/main.json';
    const optionsFilePath = './bot_dialogs/options.js';

    socket.on("botAndOptions", async () => {
        socket.emit("textbot", (textbot));
        socket.emit("botoptions", (`${options}`));
    });

    socket.on("editDialogs", async (data) => {
        const newContent = data;

        fs.writeFile(dialogsFilePath, newContent, 'utf8', (err) => {
            if (err) {
                console.error(err);
                return;
            }
            socket.emit("sucess");
            retartPm2Process()
        });
    });

    socket.on("editOptions", async (data) => {
        const newOptions = data.trim();
        fs.readFile(optionsFilePath, 'utf-8', (err, obj) => {
            if (err) {
                return;
            }
            const regex = /(function options[\s\S]*?\{)([\s\S]*?)(\}\s*};)/m;
            let newContent;
            if (newOptions.startsWith("function options")) {
                newContent = newOptions;
            } else {
                newContent = obj.replace(regex, `$1 ${newOptions} $3`);
            }
            if (!newContent.includes("module.exports")) {
                newContent += "\n\nmodule.exports = options;";
            }
            fs.writeFile(optionsFilePath, newContent, 'utf8', (err) => {
                if (err) {
                    return;
                }
                socket.emit("sucess");
                retartPm2Process()
            });
        });
    });
});
