const axios = require('axios');
const app = require('../server/app.js');
const { database } = require('../mongoServer/mongo.js');
const { botPath } = require('../chatBot/main.js');

// MongoDB Config
const collectionSettings = database.collection('settings');

// Import global variables
const sessions = require ('../globalVariables/sessions.js');

function startChat(){

    // Start Chat
    app.post('/start-chat', (req, res) => {
        let requestData = '';
        req.on('data', (chunk) => {
            requestData += chunk;
        });
        req.on('end', () => {
            try {
                const data = JSON.parse(requestData);
                const splitIDandDepartment = data.token.split('/');
                const sessionId = splitIDandDepartment[0]
                const department = splitIDandDepartment[1]
                const client = sessions[sessionId];
                const match = data.text.match(/enviawpp\s*(\d+)(?:,\s*(.+))?/);
                if (match) {
                    const phoneNumber = match[1] + "@c.us";
                    if (match[2]) {
                        const messageText = match[2];
                        async function sendMessage() {
                            const { botPathText } = await botPath(sessionId);
                            let botChat = botPathText.botText;
                            const configData = await collectionSettings.findOne({ _id: 1234567890 });
                            const adress = configData.ip;
                            const headers = {
                                'Content-Type': 'application/json',
                                'X-Auth-Token': configData.token,
                                'X-User-Id': configData.id,
                            };
                            // Send Whatsapp Message
                            try {
                                await client.sendMessage(phoneNumber, `${messageText}`);
                            } catch (error) {
                                console.log(error)
                                await axios.post(`http://${adress}/api/v1/chat.postMessage`, {
                                    channel: "general",
                                    text: `🤖\n_${botChat.start_chat_error}_ ${match[1]}!`
                                }, {
                                    headers: headers
                                })
                                    .then(response => {
                                        requestData = '';
                                        return;
                                    })
                                    .catch(error => {
                                        requestData = '';
                                        return;
                                    });
                                botChat = '';
                                requestData = '';
                                return;
                            };
                            // Create visitor
                            await axios.post(`http://${adress}/api/v1/livechat/visitor/`, {
                                visitor: {
                                    token: phoneNumber,
                                    name: phoneNumber,
                                    username: phoneNumber,
                                    phone: sessionId + '@' + phoneNumber,
                                    department: department
                                }
                            },
                                {
                                    headers: headers
                                })
                                .then(response => {
                                    requestData = '';
                                    return;
                                })
                                .catch(error => {
                                    requestData = '';
                                    return;
                                });
                            // Create room
                            await axios.get(`http://${adress}/api/v1/livechat/room?token=${phoneNumber}`);
                            requestData = '';
                            return;
                        };
                        sendMessage();
                    };
                    res.status(200).send('Sucess');
                    requestData = '';
                } else {
                    res.status(400).send("Bad Request");
                    requestData = '';
                }
                requestData = '';
                return;

            } catch (error) {
                console.error(error);
                res.status(500).send("Internal Server Error");
                requestData = '';
                return;
            }
        });
    });
}

module.exports = { startChat };