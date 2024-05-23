const axios = require('axios');
const { settingsPath } = require('../../settings/main');

async function typebotStartChat(id){
    try {
        const { settings } = await settingsPath()
        const adress = settings.typebotip
        const response = await axios.post(`http://${adress}/api/v1/typebots/${id}/startChat`);      
        if (response.data && response.data.messages && Array.isArray(response.data.messages)) {
            for (const msg of response.data.messages) {
                if (msg.content && msg.content.richText && Array.isArray(msg.content.richText)) {
                    const concatenatedMessage = msg.content.richText.map(richTextBlock => {
                        return richTextBlock.children.map(child => child.text).join('');
                    }).join('\n');
                    return {startChatResponse: concatenatedMessage, typebotSessionId: response.data.sessionId};
                }
            }
        }
    } catch (error) {
        console.error(error);
    }
}

module.exports = { typebotStartChat };