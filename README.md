# RocketWPP.JS

![RocketWPP.JS](https://i.imgur.com/M7iSCgd.png)
![Rocket.Chat](https://img.shields.io/badge/Rocket.Chat-4.8.7-ed4359.svg)
![Node.js Version](https://img.shields.io/badge/Node.js-20.10.0-green.svg)
![React Version](https://img.shields.io/badge/React-18.2.0-5ed3f3.svg)
![MongoDB Version](https://img.shields.io/badge/MongoDB%20Community-7.0.5-00ed64.svg)
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
- MongoDB Community 7.0.5
- Node 20.10.0
- Rocket.Chat 4.8.7
- PM2 5.3.1

## For user
### server/.env
- Adjuste MONGOURL uri(mongodb login has in URL).
- Adjuste CHROME_EXECUTABLE_PATH directory(this project use puppeteer, and pupperter use your installed chrome).
- Adjuste HEADLESS true or false(pupeeteer control open or close web browser, set "false" if you use proxy).
- Adjuste DBNAME for diferent names case use multiple instances.

## Chatbot syntax save
Follow the form below and avoid mistakes.

### Case Dialogs(JSON):
```json
{
  "welcome_text": "Bem-vindo a EMPRESA Teste! Escolha uma opção:\n*1* - HORARIOS\n*2* - Department 1\n*3* - Departarment 2",<br/>
  "bot_response": "Segue nossos horarios no link:",<br/>
  "error": "Opção invalida, por gentileza digite apenas os números abaixo, opção:\n*1* - HORARIOS\n*2* - SAC\n*3* - TI",<br/>
  "success": "Ok, já transferimos para o setor selecionado, por gentileza aguarde o atendimento 😉",<br/>
  "no_service": "Desculpe, mas no momento não temos ninguém no setor para atende-lo, tente outro setor por gentileza.",<br/>
  "close": "Atendimento encerrado!",<br/>
  "start_chat_error": "_Invalid number or comand, please check the number_"<br/>
}
```

### Case Options (JavaScript):
```javascript
function options(option) {
    switch (option) {
        case '1':
            return 'resposta_bot';
        case '2':
            return 'SAC';
        case '3':
            return 'TI';
        default:
            return 'falseOption';
    }
}
```

## _RocketWPP.JS Server_

### Run the comand in SERVER directory:

$ npm run install

### After installation, run the comand in SERVER directory:

$ pm2 start server.config.js

### Libraries used

- Whatsapp.web-js
- Axios
- Cors
- Dotenv
- Express
- Socket.IO
- Mongodb

## _RocketWPP.JS Client_

### Run the comand in CLIENT directory:

$ npm install

### After, tun the comand in CLIENT directory:

$ npm run build

### After create DIST paste, run the comand in root DIST directory: 

$ pm2 serve --spa --port 5173

### Libraries used

- Axios
- React Icons
- React Loading
- React Qr Code
- React Router Dom
- React Toastify
- Socket.IO Client


## _ChatBot_(Basic chatbot, modify for client side)

For config the ChatBot JSON, don't modify field for objects, only strings  

For config the Chatbot JS, don't modify **"default: return 'falseOption';"**, just case 1, 2, 3...

## Congratulations and credits
For lib Whatsapp.web-js
- [@pedroslopez](https://github.com/pedroslopez)
