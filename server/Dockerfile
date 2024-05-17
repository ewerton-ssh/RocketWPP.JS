FROM node:20-alpine
RUN mkdir -p /home/node/RocketWPP.JS/server && chown -R node:node /home/node/RocketWPP.JS/server
WORKDIR /home/node/RocketWPP.JS/server
COPY . .
RUN npm install
RUN npm install pm2@5.3.1 -g
COPY --chown=node:node . .
EXPOSE 3001
CMD [ "pm2-runtime", "start", "server.config.js" ]