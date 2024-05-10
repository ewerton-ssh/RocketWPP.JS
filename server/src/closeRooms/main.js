const { settingsPath } = require('../settings/main.js');
const axios = require('axios');

async function closeRooms() {

    //Settings config
    const { settings } = await settingsPath();

    const adress = settings.ip;
    const headers = {
        'Content-Type': 'application/json',
        'X-Auth-Token': settings.token,
        'X-User-Id': settings.id,
    };
    await axios.get(`http://${adress}/api/v1/livechat/rooms?open`, {
        headers: headers
    })
        .then(response => {
            async function verifyLastMessage(room) {
                if (room.v.token.includes('_group')) {
                    return;
                } else {
                    const lastMessage = new Date(room.lm);
                    const currentTime = new Date();
                    const diffMs = currentTime - lastMessage;
                    const diffMinutes = diffMs / (1000 * 60);
                    if (diffMinutes > settings.minutes) {
                        await axios.post(`http://${adress}/api/v1/livechat/room.close`, {
                            'rid': room._id,
                            'token': room.v.token
                        })
                            .then(response => {
                                console.log('Room closed:', room.v);
                            })
                            .catch(error => {
                                console.log('error:', error);
                            })
                    };
                };
            };
            response.data.rooms.forEach(verifyLastMessage);
        })
        .catch(error => {
            console.error('Connect error: RocketChat not listening.');
        });
};

module.exports = { closeRooms };