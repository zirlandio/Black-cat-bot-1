const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('Black Cat Bot online!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`);
});

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage'
        ]
    }
});

client.on('qr', (qr) => {
    console.log('ESCANEIE O QR CODE:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('🐈‍⬛ BLACK CAT BOT CONECTADO!');
});

client.on('message', async (msg) => {
    const comando = msg.body.trim().toLowerCase();
    const chat = await msg.getChat();

    if (comando === '!ping') {
        await msg.reply('🏓 Pong! Bot funcionando.');
    }

    if (comando === '!menu') {
        await msg.reply(
`🐈‍⬛ *BLACK CAT DUEL'S BOT*

📋 COMANDOS

🏓 !ping
📜 !menu
🔒 !fechar
🔓 !abrir`
        );
    }

    if (comando === '!fechar') {
        if (!chat.isGroup) {
            return msg.reply('❌ Este comando só funciona em grupos.');
        }

        try {
            await chat.setMessagesAdminsOnly(true);
            await msg.reply('🔒 Grupo fechado!');
        } catch (erro) {
            console.error(erro);
            await msg.reply('❌ Não consegui fechar o grupo. O bot precisa ser administrador.');
        }
    }

    if (comando === '!abrir') {
        if (!chat.isGroup) {
            return msg.reply('❌ Este comando só funciona em grupos.');
        }

        try {
            await chat.setMessagesAdminsOnly(false);
            await msg.reply('🔓 Grupo aberto!');
        } catch (erro) {
            console.error(erro);
            await msg.reply('❌ Não consegui abrir o grupo. O bot precisa ser administrador.');
        }
    }
});

client.initialize();
