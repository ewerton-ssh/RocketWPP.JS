#!/bin/bash

# Pausa inicial para uma melhor visualização
read -p "Pressione Enter para continuar..."

# Pergunta ao usuário se deseja instalar o RocketWPP.JS
read -p "Deseja instalar o RocketWPP.JS? [Y/N]: " answer

# Verifica a resposta do usuário
if [[ "$answer" == [Yy] ]]; then
    echo "Instalando RocketWPP.JS..."
    npm install pm2@5.3.1 -g && npm install && pm2 start server.config.js && pm2 startup && pm2 save
else
    echo "Instalação do RocketWPP.JS cancelada."
fi

# Pausa final antes de sair
read -p "Pressione Enter para sair..."