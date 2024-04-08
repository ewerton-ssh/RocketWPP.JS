const { database } = require('../mongoServer/mongo.js');

// MongoDB collections
const collectionConnectors = database.collection('connectors');

// Chatbot
async function botPath(id) {
    const botPathText = await collectionConnectors.findOne({ number: id });
    const botPathOptions = await collectionConnectors.findOne({ number: id });
    if (botPathText.botText === undefined || botPathOptions.botOptions === undefined) {
        return;
    };
    return { botPathText, botPathOptions };
};

module.exports = { botPath };