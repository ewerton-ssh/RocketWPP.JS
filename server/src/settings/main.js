const { dbSettings } = require('../db/neDb.js');

// Chatbot
async function settingsPath() {
    return new Promise((resolve, reject) => {
        dbSettings.findOne({ _id: 1234567890 }, function(err, doc) {
            if (err) {
                reject(err);
            } else {
                resolve(doc);
            }
        });
    })
    .then(doc => {
        return { settings: doc };
    })
    .catch(err => {
        console.error('dbSettings:', err);
    });   
}

module.exports = { settingsPath };