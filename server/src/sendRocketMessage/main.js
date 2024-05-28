const axios = require('axios');
const { settingsPath } = require('../settings/main.js');
const fs = require('fs');

const { typebotStartChat } = require('../typeBot/startChat/main.js');
const { typebotResponseChat } = require('../typeBot/responseChat/main.js');
const typebotSessions = require('../typeBot/sessions/main.js');


async function sendRocketMessage(message, hasMedia, id) {

    //Settings config
    const { settings } = await settingsPath();

    const adress = settings.ip;
    const headers = {
        'Content-Type': 'application/json',
        'X-Auth-Token': settings.token,
        'X-User-Id': settings.id,
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
                'x-visitor-token': getInfoChat.name + '_group'
            };
        } else {
            mediaHeader = {
                'x-visitor-token': number
            };
        };

        if (hasMedia !== undefined) {
            sendMediaMessage();
        };

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
                    return;
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
                    return;
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
                    return;
                }
                return;
            } else if (message.type === 'document') {
                const arquivo = fs.readFileSync(filePath);
                const blob = new Blob([arquivo], { type: 'document/archive' });
                mediaData.append('file', blob, `${message.from}_${Date.now()}_${message.body}`);
                //mediaData.append('description', 'document file');
                try {
                    await axios.post(`http://${adress}/api/v1/livechat/upload/${roomId}`, mediaData, {
                        headers: mediaHeader
                    });
                } catch (error) {
                    return;
                }
                return;
            }
        };

        if (getInfoChat.isGroup) {
            messageData = {
                token: getInfoChat.name + '_group',
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

    // Header of visitors
    if (getInfoChat.isGroup) {
        nickSender = `(${getInfoChat.name})`;
        visitorHeader = {
            token: getInfoChat.name + '_group',
            name: nickSender,
            username: number,
            phone: id + '@' + number,
        }
    } else {
        nickSender = message._data.notifyName;
        visitorHeader = {
            token: number,
            name: nickSender,
            username: number,
            phone: id + '@' + number
        }
    };



    // Create new visitor and manager bot & messages
    async function createVisitor(data, roomId) {
        if (data === 'newVisitor') {
            //TypeBot
            const { startChatResponse, typebotSessionId} = await typebotStartChat(id);
            await axios.post(`http://${adress}/api/v1/livechat/visitor/`, {
                visitor: visitorHeader
            },
                {
                    headers: headers
                })
                .then(response => {
                    typebotSessions[visitorHeader.token] = typebotSessionId;
                })
                .catch(error => {
                    visitorHeader = null;
                });
            
            await message.reply(startChatResponse);
        } else if (data === 'closedRoom') {

            const { chatResponse, department } = await typebotResponseChat(typebotSessions[visitorHeader.token], body);
            const { startChatResponse, typebotSessionId, startChatDepartment } = await typebotStartChat(id);
            
            if (chatResponse !== null) {
                await message.reply(chatResponse);
            } else {
                typebotSessions[visitorHeader.token] = typebotSessionId;
                await message.reply(startChatResponse);
            };

            //Choose department
            if (department !== null || startChatDepartment !== null) {
                if (getInfoChat.isGroup) {
                    nickSender = `(${getInfoChat.name})`;
                    visitorHeader = {
                        token: getInfoChat.name + '_group',
                        name: nickSender,
                        username: number,
                        phone: id + '@' + number,
                        department: startChatDepartment ? startChatDepartment.department : department.department
                    };
                } else {
                    nickSender = message._data.notifyName;
                    visitorHeader = {
                        token: number,
                        name: nickSender,
                        username: number,
                        phone: id + '@' + number,
                        department: startChatDepartment ? startChatDepartment.department : department.department
                    };
                };                

                await axios.post(`http://${adress}/api/v1/livechat/visitor/`, {
                    visitor: visitorHeader
                },
                    {
                        headers: headers
                    })
                    .then(response => {
                        typebotSessions[visitorHeader.token] = typebotSessionId;
                    })
                    .catch(error => {
                        visitorHeader = null;
                    });
            } else {
                return;
            };

            // Create Room
            async function createRoom() {
                if (getInfoChat.isGroup) {
                    await axios.get(`http://${adress}/api/v1/livechat/room?token=${getInfoChat.name + '_group'}`)
                        .then(response => {
                            return;
                        })
                        .catch(error => {
                            return;
                        });
                } else {
                    await axios.get(`http://${adress}/api/v1/livechat/room?token=${number}`)
                        .then(response => {
                            async function messageResponse() {
                                rocketMessage(response.data.room._id);
                                return;
                            };
                            messageResponse();
                        })
                        .catch(error => {
                            async function errorResponse() {
                                if (!error.response.data.success) {
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
        } else if (data === 'openedRoom') {
            //Rename Visitor Headers
            if (getInfoChat.isGroup) {
                nickSender = `(${getInfoChat.name})`;
                renameHeader = {
                    token: getInfoChat.name + '_group',
                    name: nickSender,
                    username: number,
                    phone: id + '@' + number
                }
            } else {
                nickSender = message._data.notifyName;
                renameHeader = {
                    token: number,
                    name: nickSender,
                    username: number,
                    phone: id + '@' + number,
                }
            };

            // Rename started contact chat
            await axios.post(`http://${adress}/api/v1/livechat/visitor/`, {
                visitor: renameHeader
            },
                {
                    headers: headers
                })
                .then(response => {
                })
                .catch(error => {
                    return;
                });
            rocketMessage(roomId);
            return;
        };
    };

    // Open room
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
                    matchingRoom = idToTokenMap.find(obj => obj.token === getInfoChat.name + '_group');
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
        await axios.get(`http://${adress}/api/v1/livechat/visitor/${getInfoChat.name + '_group'}`)
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