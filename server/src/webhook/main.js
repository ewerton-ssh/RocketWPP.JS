const axios = require('axios');
const app = require('../server/app.js');
const { botPath } = require('../chatBot/main.js');
const { MessageMedia } = require('whatsapp-web.js');

// Import global variables
const sessions = require('../globalVariables/sessions.js');

function webhook() {

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
                const [sessionId, visitor] = visitorData.phone[0].phoneNumber.split('@');
                const client = sessions[sessionId];
                async function rocketSendMessage() {
                    const { botPathText } = await botPath(sessionId);
                    let botChat = botPathText.botText;
                    if (messageData && messageData.length > 0 && messageData[0].u) {
                        //Delete user on close chat. const data = await collectionSettings.findOne({ _id: 1234567890 });
                        //Delete user on close chat. const adress = data.ip;
                        if (messageData[0].closingMessage === true) {
                            try {
                                await client.sendMessage(visitorData.username, botChat.close);
                                botChat = '';
                                return;
                            } catch (error) {
                                return;
                            }
                            // Delete user on close chat. await axios.delete(`http://${adress}/api/v1/livechat/visitor/${visitorData.token}`);
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
                res.status(200).send();
                return;
            } catch (error) {
                res.status(500).send("Internal Server Error");
                return;
            }
        });
    });
}

module.exports = { webhook };