# RocketWPP.JS v1.5.1

![RocketWPP.JS](https://i.imgur.com/M7iSCgd.png)
![Rocket.Chat](https://img.shields.io/badge/Rocket.Chat-4.8.7-ed4359.svg)
![Node.js Version](https://img.shields.io/badge/Node.js-20.10.0-green.svg)
![React Version](https://img.shields.io/badge/React-18.2.0-5ed3f3.svg)
![PM2 Version](https://img.shields.io/badge/PM2-5.3.1-5f05ec.svg)

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

## Requires version installed on your server
- NPM 10.2.3
- Node 20.10.0
- Rocket.Chat 4.8.7
- PM2 5.3.1

## For use
### server/.env
- Adjuste CHROME_EXECUTABLE_PATH directory(this project use puppeteer, and pupperter use your installed chrome).
- Adjuste HEADLESS true or false(pupeeteer control open or close web browser, set "false" if you use proxy).

## Chatbot syntax save
Follow the form below and avoid mistakes.

### Case Dialogs(JSON):
```json
{
  "welcome_text": "Bem-vindo a EMPRESA Teste! Escolha uma opção:\n*1* - HORARIOS\n*2* - Department 1\n*3* - Department 2",
  "bot_response": "Segue nossos horarios no link:",
  "error": "Opção invalida, por gentileza digite apenas os números abaixo, opção:\n*1* - HORARIOS\n*2* - Department 1\n*3* - Department 2",
  "success": "Ok, já transferimos para o setor selecionado, por gentileza aguarde o atendimento 😉\n\nCaso o chat permaneça sem interação por mais de 5 minutos, o atendimento será encerrado automaticamente!",
  "no_service": "Desculpe, mas no momento não temos ninguém no setor para atende-lo, tente outro setor por gentileza.",
  "close": "Atendimento encerrado!",
  "start_chat_error": "_Número ou comando invalido, verifique por favor!_"
}
```

### Case Options (JavaScript):
```javascript
function options(option) {
    switch (option) {
        case '1':
            return 'bot_response';
        case '2':
            return 'Department_1';
        case '3':
            return 'Department_2';
        default:
            return 'falseOption';
    }
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

### After create DIST paste, run the comand in root DIST directory: 

$ pm2 serve --spa --port 3002

## _ChatBot_(Basic chatbot, modify for client side)

For config the ChatBot JSON, don't modify field for objects, only strings  

For config the Chatbot JS, don't modify **"default: return 'falseOption';"**, just case 1, 2, 3...

## Congratulations and credits
For lib Whatsapp.web-js
- [@pedroslopez](https://github.com/pedroslopez)
