const { exec } = require('child_process');

// Retart pm2 all process function
async function restartPm2Process() {
    const command = 'pm2 restart all';
    exec(command, (erro, stdout, stderr) => {
        if (erro) {
            console.error(`Comand error: ${erro.message}`);
            return;
        }

        if (stderr) {
            console.error(`Stderr error: ${stderr}`);
            return;
        }
        console.log(`command log:\n${stdout}`);
    });
    return;
};

module.exports = { restartPm2Process };