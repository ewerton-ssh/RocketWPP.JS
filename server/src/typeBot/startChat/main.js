const axios = require('axios');
const { settingsPath } = require('../../settings/main');

async function typebotStartChat(id) {
    try {
        const { settings } = await settingsPath();
        const address = settings.typebotip;
        const response = await axios.post(`http://${address}/api/v1/typebots/${id}/startChat`);
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

        // Filter out department lines and set department
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

        return { startChatResponse: cleanedMessage, typebotSessionId: response.data.sessionId, startChatDepartment: department };
    } catch (error) {
        console.error(error);
        return { startChatResponse: null, typebotSessionId: null, department: null };
    }
}

module.exports = { typebotStartChat };
