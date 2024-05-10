@echo off

pause

choice /M "Deseja instalar o RocketWPP.JS?"

if errorlevel 2 (
    echo Instalação do PM2 cancelada.
) else (
    echo Instalando PM2 globalmente...
    npm install pm2@5.3.1 -g && npm install && pm2 start server.config.js && pm2 startup && pm2 save
)

pause

echo Execução do script concluída.

pause