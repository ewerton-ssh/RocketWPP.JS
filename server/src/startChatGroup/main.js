const axios = require('axios');
const app = require('../services/app.js');
const { settingsPath } = require('../settings/main.js');
const { botPath } = require('../chatBot/main.js');

// Import global variables
const sessions = require('../globalVariables/sessions.js');

async function startChatGroup() {

    //Settings config
    const { settings } = await settingsPath();

    // Start Chat
    app.post('/start-chat-group', (req, res) => {
        let requestData = '';
        req.on('data', (chunk) => {
            requestData += chunk;
        });
        req.on('end', async () => {
            try {
                const data = JSON.parse(requestData);
                const splitIDandDepartment = data.token.split('/');
                const sessionId = splitIDandDepartment[0];
                const department = splitIDandDepartment[1];
                const client = sessions[sessionId];
                const match = data.text.match(/enviawpp\s*(\d+)(?:,\s*(.+))?/);
                if (match) {
                    const phoneNumber = match[1] + "@g.us";
                    if (match[2]) {
                        const messageText = match[2];
                        const { botPathText } = await botPath(sessionId);
                        const botChat = botPathText;
                        const adress = settings.ip;
                        const headers = {
                            'Content-Type': 'application/json',
                            'X-Auth-Token': settings.token,
                            'X-User-Id': settings.id,
                        };
                        // Send whatsapp message
                        try {
                            await client.sendMessage(phoneNumber, `${messageText}`);
                        } catch (error) {
                            console.log(error);
                            await axios.post(`http://${adress}/api/v1/chat.postMessage`, {
                                channel: "general",
                                text: `🤖\n_${botChat.start_chat_error}_ ${match[1]}!`
                            }, {
                                headers: headers
                            });
                        }
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
                            });
                        // Create room
                        await axios.get(`http://${adress}/api/v1/livechat/room?token=${phoneNumber}`);
                    }
                    res.status(200).send('Success');
                } else {
                    res.status(400).send('Invalid Request');
                }
            } catch (error) {
                console.error('Start group chat error:', error);
                res.status(500).send('Internal Server Error');
            }
        });
    });
};

module.exports = { startChatGroup };