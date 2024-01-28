# RocketWPP.JS

![RocketWPP.JS](https://i.imgur.com/M7iSCgd.png)

If you wants for help, enter this whatsapp group: [RocketWPP.JS Help](https://chat.whatsapp.com/FaCeyAth56GIy2nWr0fDjt)

![Node.js Version](https://img.shields.io/badge/Node.js-10.20.0-green.svg)
![React Version](https://img.shields.io/badge/React-18.2.0-5ed3f3.svg)

RocketWPP.JS is an aplication in Nodejs and React for create connectors with Whatsapp and Rocket.Chat.

## Features

|                                      |     |
| ------------------------------------ | --- |
| Multiple Sessions                    | ✔   |
| Send   text, image, video and docs   | ✔   |
| Receive text, image, video and docs  | ✔   |
| Receive/Send messages                | ✔   |
| Open/Close Session                   | ✔   |
| Join Group by Invite Code            | ✔   |

## Require version install in your PC
- NPM 10.2.3
- MongoDB Community 7.0.5
- Node 10.20.0
- Rocket.Chat 4.8.7

## For user
### server/.env
- Adjuste MONGOURL uri(mongodb login has in URL).
- Adjuste CHROME_EXECUTABLE_PATH directory(this project use puppeteer, and pupperter use your installed chrome).
- Adjuste HEADLESS true or false(pupeeteer control open or close web browser, set "false" if you use proxy).

## _WPPConnect Server_

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

## _WPPConnect Client_

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
