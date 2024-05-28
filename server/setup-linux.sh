#!/bin/bash
read -p "Press for continue..."
read -p "Install RocketWPP.JS? [Y/N]: " answer
if [[ "$answer" == [Yy] ]]; then
    echo "Installing RocketWPP.JS..."
    npm install pm2@5.3.1 -g && npm install && pm2 start server.config.js && pm2 startup && pm2 save
else
    echo "Install exit"
fi
read -p "Press Enter for exit..."
