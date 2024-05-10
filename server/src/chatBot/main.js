const { dbConnectors } = require('../neDbServer/neDb.js');

// Chatbot
async function botPath(id) {
    return new Promise((resolve, reject) => {
        dbConnectors.findOne({ number: id }, function(err, doc) {
            if (err) {
                reject(err);
            } else {
                resolve(doc);
            }
        });
    })
    .then(doc => {
        return { botPathText: doc.botText, botPathOptions: doc.botOptions };
    })
    .catch(err => {
        console.error('dbConnectors(chatBot):', err);
    });   
}

module.exports = { botPath };