const { database } = require('../mongoServer/mongo.js');
const { botPath } = require('../chatBot/main.js');
const axios = require('axios');
const fs = require('fs');

// MongoDB collections
const collectionSettings = database.collection('settings');

// Rocket send message
async function sendRocketMessage(message, hasMedia, id) {

    const { botPathText } = await botPath(id);
    const { botPathOptions } = await botPath(id)

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
    let nickSender = null;
    let visitorHeader = null;
    let mediaHeader = null;
    let messageData = null;
    let matchingRoom = null;

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
                };
                return;
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
                return;
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
                return;
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
                return;
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
        };

        // Send Whatsapp message text to RocketChat
        await axios.post(`http://${adress}/api/v1/livechat/message`, messageData, {
            header: header
        })
            .then(response => {
            })
            .catch(error => {
            });
        return;
    };

    // Chose the department or bot response
    const botChat = botPathText.botText;
    const options = eval('(' + botPathOptions.botOptions + ')');
    const chosedOption = options(body);
    let department = null;
    if (chosedOption !== 'bot_response' && chosedOption !== 'falseOption') {
        department = chosedOption;
    } else {
        department = null;
    }  

    // Header of visitors
    if (getInfoChat.isGroup) {
        nickSender = `(${getInfoChat.name})`;
        visitorHeader = {
            token: getInfoChat.name,
            name: nickSender,
            username: number,
            phone: id + '@' + number,
            department: department,
        }
        nickSender = null;
        mediaHeader = null;
        messageData = null;
        matchingRoom = null;
        department = null;
    } else {
        nickSender = message._data.notifyName;
        visitorHeader = {
            token: number,
            name: nickSender,
            username: number,
            phone: id + '@' + number,
            department: department,
        }
        nickSender = null;
        mediaHeader = null;
        messageData = null;
        matchingRoom = null;
        department = null;
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
                    visitorHeader = null;
                })
                .catch(error => {
                    visitorHeader = null;
                });
            await message.reply(botChat.welcome_text);
        } else if (data === 'closedRoom') {
            if (chosedOption === 'falseOption') {
                await message.reply(botChat.error);
            } else if (chosedOption === 'bot_response') {
                await message.reply(botChat.bot_response);
            } else {
                // Create Room
                async function createRoom() {
                    if (getInfoChat.isGroup) {
                        await axios.get(`http://${adress}/api/v1/livechat/room?token=${getInfoChat.name}`)
                            .then(response => {
                                async function messageResponse() {
                                    await message.reply(botChat.success);
                                    return;
                                };
                                messageResponse();
                            })
                            .catch(error => {
                                async function errorResponse() {
                                    if (!error.response.data.success) {
                                        await message.reply(botChat.no_service);
                                        return;
                                    };
                                };
                                errorResponse();
                            });
                    } else {
                        await axios.get(`http://${adress}/api/v1/livechat/room?token=${number}`)
                            .then(response => {
                                async function messageResponse() {
                                    await message.reply(botChat.success);
                                    return;
                                };
                                messageResponse();
                            })
                            .catch(error => {
                                async function errorResponse() {
                                    if (!error.response.data.success) {
                                        await message.reply(botChat.no_service);
                                        return;
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
                        visitorHeader = null;
                    })
                    .catch(error => {
                        visitorHeader = null;
                    });
            };
        } else if (data === 'openedRoom') {
            rocketMessage(roomId);
            return;
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
    };

    // Decide the message is the new or old visitor
    if (getInfoChat.isGroup) {
        await axios.get(`http://${adress}/api/v1/livechat/visitor/${getInfoChat.name}`)
            .then(response => {
                openRooms();
                return;
            })
            .catch(error => {
                if (error.response.status === 400) {
                    createVisitor('newVisitor');
                    return;
                };
            });
    } else {
        await axios.get(`http://${adress}/api/v1/livechat/visitor/${number}`)
            .then(response => {
                openRooms();
                return;
            })
            .catch(error => {
                if (error.response.status === 400) {
                    createVisitor('newVisitor');
                    return;
                };
            });
    };
};

module.exports = { sendRocketMessage };