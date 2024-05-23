const axios = require('axios');
const { settingsPath } = require('../../settings/main');

async function typebotResponseChat(sessionId, body) {
    try {
        const { settings } = await settingsPath()
        const adress = settings.typebotip
        const response = await axios.post(`http://${adress}/api/v1/sessions/${sessionId}/continueChat`,
            {
                "message": `${body}`
            }
        );
        const messages = response.data.messages;
        let concatenatedMessage = '';
        let department = null;

        messages.forEach(msg => {
            if (msg.content && msg.content.richText) {
                const combinedText = msg.content.richText.map(item => {
                    return item.children.map(child => child.text).join('');
                }).join('\n');

                concatenatedMessage += combinedText + '\n';
            }
        });

        // Set department
        const lines = concatenatedMessage.trim().split('\n');
        const filteredLines = lines.filter(line => {
            const match = line.match(/^department=(\w+)$/);
            if (match) {
                department = { department: match[1] };
                return false;
            }
            return true;
        });

        const cleanedMessage = filteredLines.join('\n').trim();

        return { chatResponse: cleanedMessage, department: department };
    } catch (error) {
        return { chatResponse: null, department: null };
    }
}

module.exports = { typebotResponseChat };