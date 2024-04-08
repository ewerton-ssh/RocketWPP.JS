const {database} = require('../mongoServer/mongo.js');
const axios = require('axios');

// MongoDB Config
const collectionSettings = database.collection('settings');

async function closeRooms() {
    const data = await collectionSettings.findOne({ _id: 1234567890 });
    const adress = data.ip;
    const headers = {
        'Content-Type': 'application/json',
        'X-Auth-Token': data.token,
        'X-User-Id': data.id,
    };
    await axios.get(`http://${adress}/api/v1/livechat/rooms?open`, {
        headers: headers
    })
        .then(response => {
            async function verifyLastMessage(room) {
                const lastMessage = new Date(room.lm);
                const currentTime = new Date();
                const diffMs = currentTime - lastMessage;
                const diffMinutes = diffMs / (1000 * 60);
                if (diffMinutes > data.minutes) {
                    await axios.post(`http://${adress}/api/v1/livechat/room.close`, {
                        'rid': room._id,
                        'token': room.v.token
                    })
                        .then(response => {
                        })
                        .catch(error => {
                            console.log("erro:", error)
                        })
                }
            };
            response.data.rooms.forEach(verifyLastMessage);
        })
        .catch(error => {
            console.log('error:', error)
        });
};

module.exports = { closeRooms };