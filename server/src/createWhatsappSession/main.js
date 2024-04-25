const path = require('path');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { sendRocketMessage } = require('../sendRocketMessage/main.js');
const fs = require('fs');

// .env config
require('dotenv').config({ path: path.join(__dirname, 'config', '.env') });


// Import global variables
const sessions = require ('../globalVariables/sessions.js')
const activedSessions = require('../globalVariables/activedSessions.js');

// .env Healdess define
const headless = process.env.HEADLESS === 'true';

// Create whatsapp Session
const createWhatsappSession = (id, socket) => {

    // Create whatsapp-media folder
    const folderPathWPP = path.join(__dirname, '../../whatsapp-media/');
    if (!fs.existsSync(folderPathWPP)) {
        fs.mkdirSync(folderPathWPP);
    }

    // Start new chat
    const { startChat }= require('../startChat/main.js')
    startChat();    

    // Start Webhook
    const { webhook } = require('../webhook/main.js')
    webhook(); 

    // New Client
    const client = new Client({
        authStrategy: new LocalAuth({
            clientId: id,
        }),
        webVersionCache: {
            type: 'remote',
            remotePath:'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2409.0.html',
        },
        puppeteer: {
            executablePath: process.env.CHROME_EXECUTABLE_PATH,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-web-security',
                '--disable-features=IsolateOrigins,site-per-process',
            ],
            headless: headless,
            timeout: 30000,
        }
    });

    client.on('disconnected', () => {
        console.log('The client has been disconnected.');
    });

    client.on('qr', (qr) => {
        socket.emit('clientqr', {
            qr,
        });
    });

    client.on('ready', () => {
        sessions[id] = client;
        activedSessions[id] = 'actived'
        socket.emit('clientisready', {
            message: "clientisready"
        });
        socket.emit('active', {
            activedSessions
        });
    });

    // Message
    client.on('message', async (message) => {
        // Media message
        if (message.from === 'status@broadcast'){
            return;
        } 
        if (message.hasMedia) {
            if (message.type === 'image' || message.type === 'sticker') {
                const media = await message.downloadMedia();
                const filename = `${message.from}_${Date.now()}.jpg`;
                const folderPath = path.join(__dirname, '../../whatsapp-media/whatsapp-images');
                if (!fs.existsSync(folderPath)) {
                    fs.mkdirSync(folderPath);
                }
                const imagePath = path.join(folderPath, filename);
                fs.writeFileSync(imagePath, media.data, 'base64');
                await sendRocketMessage(message, `./whatsapp-media/whatsapp-images/${filename}`, id);
                return;
            } else if (message.type === 'ptt' || message.type === 'audio') {
                const media = await message.downloadMedia();
                const filename = `${message.from}_${Date.now()}.mp3`;
                const folderPath = path.join(__dirname, '../../whatsapp-media/whatsapp-audios');
                if (!fs.existsSync(folderPath)) {
                    fs.mkdirSync(folderPath);
                }
                const audioPath = path.join(folderPath, filename);
                fs.writeFileSync(audioPath, media.data, 'base64');
                await sendRocketMessage(message, `./whatsapp-media/whatsapp-audios/${filename}`, id);
                return;
            } else if (message.type === 'video') {
                const media = await message.downloadMedia();
                const filename = `${message.from}_${Date.now()}.mp4`;
                const folderPath = path.join(__dirname, '../../whatsapp-media/whatsapp-videos');
                if (!fs.existsSync(folderPath)) {
                    fs.mkdirSync(folderPath);
                }
                const videoPath = path.join(folderPath, filename);
                fs.writeFileSync(videoPath, media.data, 'base64');
                await sendRocketMessage(message, `./whatsapp-media/whatsapp-videos/${filename}`, id);
                return;
            } else if (message.type === 'document') {
                const media = await message.downloadMedia();
                const filename = `${message.from}_${Date.now()}_${message.body}`;
                const folderPath = path.join(__dirname, '../../whatsapp-media/whatsapp-documents');
                if (!fs.existsSync(folderPath)) {
                    fs.mkdirSync(folderPath);
                }
                const docPath = path.join(folderPath, filename);
                fs.writeFileSync(docPath, media.data, 'base64');
                await sendRocketMessage(message, `./whatsapp-media/whatsapp-documents/${filename}`, id);
                return;
            };
        } else {
            // Text Message
            await sendRocketMessage(message, '', id);
            return;
        }
        return;
    });

    client.initialize();
    return client;
};

module.exports = { createWhatsappSession };