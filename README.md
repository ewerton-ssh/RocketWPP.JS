# RocketWPP.JS v3.1.0

![RocketWPP.JS](https://i.imgur.com/M7iSCgd.png)
![Rocket.Chat](https://img.shields.io/badge/Rocket.Chat-4.8.7-ed4359.svg)
![Node.js Version](https://img.shields.io/badge/Node.js-20.10.0-green.svg)
![React Version](https://img.shields.io/badge/React-18.2.0-5ed3f3.svg)
![PM2 Version](https://img.shields.io/badge/PM2-5.3.1-5f05ec.svg)
![Typebot](https://img.shields.io/badge/Typebot-2.25.2-blue.svg)

RocketWPP.JS is an aplication in Nodejs and React for create connectors with Whatsapp and Rocket.Chat.  

If you wants for help, enter this whatsapp group: [RocketWPP.JS Help](https://chat.whatsapp.com/FaCeyAth56GIy2nWr0fDjt)  

## Features

|                                      |     |
| ------------------------------------ | --- |
| Multiple Sessions                    | ✔   |
| Send   text, image, video and docs   | ✔   |
| Receive text, image, video and docs  | ✔   |
| Receive/Send messages                | ✔   |
| Open/Close Session                   | ✔   |
| Join Group by invicted               | ✔   |

## Windows and Linux easy installation
- [Install Node min version 20.10.0](https://nodejs.org/en/download)
- Windows: execute the setup-windows.bat
- Linux: execute the setup-linux.sh
- Open your browser and access [http://localhost:3001](http://localhost:3001)
- Pattern login: admin
- Pattern password: rocket123@

## Docker compose up
Paste in terminal:
$ docker-compose -f "docker-compose.yml" up -d --build

## Configure Typebot
<br />
<p align="center">
  <a href="https://typebot.io/#gh-light-mode-only" target="_blank">
    <img src="https://raw.githubusercontent.com/baptisteArno/typebot.io/main/.github/images/logo-dark.png" alt="Typebot illustration" width="350px">
  </a>
  <a href="https://typebot.io/#gh-dark-mode-only" target="_blank">
    <img src="https://raw.githubusercontent.com/baptisteArno/typebot.io/main/.github/images/logo-dark.png" alt="Typebot illustration" width="350px">
  </a>
</p>
<br />

### Typebot share link exemple:  
- URL: https://typebot.youdomain.com:3006/551199999999/  (set the share link equal to the connector number)  
- Import The JSON exemple for typebot [Download](https://downgit.github.io/#/home?url=https://github.com/ewerton-ssh/RocketWPP.JS/blob/main/typebot_exemple_export.json)

## Requires version installed on your server
- NPM 10.2.3
- Node 20.10.0
- Rocket.Chat 4.8.7
- PM2 5.3.1

## For use
### server/.env
- Adjuste CHROME_EXECUTABLE_PATH directory(this project use puppeteer, and pupperter use your installed chrome or chromium in Docker).
- Adjuste HEADLESS true or false(pupeeteer control open or close web browser, set "false" if you use proxy).

## Chatbot syntax save
Follow the form below and avoid mistakes.

### Case Dialogs(JSON):
```json
{
  "no_service": "Desculpe, mas no momento não temos ninguém no setor para atende-lo, tente outro setor por gentileza.",
  "close": "Atendimento encerrado!",
  "start_chat_error": "_Número ou comando invalido, verifique por favor!_"
}
```

### Outgoing Webhook Integrations RocketChat (Start Whatsapp new chat):

- Channel: Set created channel.
- Triggers word: enviawpp
- URL: http://localhost:3001/start-chat
- Token: 551199999999/SAC (Connector_resgistered_number/Department)

After setup webhook integration, send the 'enviawpp number, text' command in setted channel, example:  
  _enviawpp 551199999999, hello_

## _RocketWPP.JS Server_

### Run the comand in SERVER directory:

$ npm install

### After installation, run the comand in SERVER directory:

$ pm2 start server.config.js

### Libraries used

- Whatsapp.web-js
- Axios
- Cors
- Dotenv
- Express
- Socket.IO
- NeDB

## _RocketWPP.JS Client_

### Run the comand in CLIENT directory:

$ npm install

### After, tun the comand in CLIENT directory:

$ npm run build

### After create DIST paste, move DIST to server paste: 

## _ChatBot_(Basic chatbot, modify for client side)

For config the ChatBot JSON, don't modify field for objects, only strings  

For config the Chatbot JS, don't modify **"default: return 'falseOption';"**, just case 1, 2, 3...

## Congratulations and credits  

### Developers  

<a href="https://github.com/ewerton-ssh/RocketWPP.JS/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ewerton-ssh/RocketWPP.JS" />
</a>

Made with [contrib.rocks](https://contrib.rocks).

For lib _Typebot_
- [@typebot](https://typebot.io/)  


For lib _Whatsapp.web-js_
- [@whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js)
