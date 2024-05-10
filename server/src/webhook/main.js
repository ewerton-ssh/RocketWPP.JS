const app = require('../services/app.js');
const { botPath } = require('../chatBot/main.js');
const { MessageMedia } = require('whatsapp-web.js');

// Import global variables
const sessions = require('../globalVariables/sessions.js');

async function webhook(id) {

    // Webhook
    app.post('/rocketjs-webhook', (req, res) => {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });
        req.on('end', () => {
            try {
                const jsonData = JSON.parse(data);
                const visitorData = jsonData.visitor;
                const messageData = jsonData.messages;
                const [sessionId] = visitorData.phone[0].phoneNumber.split('@');
                const client = sessions[sessionId];
                async function rocketSendMessage() {
                    const { botPathText } = await botPath(sessionId);
                    const botChat = botPathText;
                    if (messageData && messageData.length > 0 && messageData[0].u) {
                        if (messageData[0].closingMessage === true) {
                            try {
                                await client.sendMessage(visitorData.username, botChat.close);
                                return;
                            } catch (error) {
                                return;
                            }
                        } else {
                            if (messageData[0].msg === '') {
                                try {
                                    const media = await MessageMedia.fromUrl(messageData[0].fileUpload.publicFilePath, { unsafeMime: true });
                                    await client.sendMessage(visitorData.username, media);
                                    return;
                                } catch (error) {
                                    console.error('Media process error:', error);
                                }
                                return;
                            } else {
                                await client.sendMessage(visitorData.username, `*${messageData[0].u.name}* \n${messageData[0].msg}`);
                                return;
                            };
                        };
                    };
                };
                rocketSendMessage();
                res.status(200).send('Success');
                return;
            } catch (error) {
                res.status(500).send('Internal Server Error');
                return;
            }
        });
    });
}

module.exports = { webhook };