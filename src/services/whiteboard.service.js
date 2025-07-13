require('dotenv').config();
const { pallet } = require('./colors.service');
const { NodeMailer } = require('./nodemailer.service');

class Whiteboard {
    constructor () { 
        this.database = new Map();
        this.nodemailer = new NodeMailer({ user: process.env.EMAIL, pass: process.env.PASS });
    }

    uuid = async () => { return ([...Array(4)]).map(() => Math.random().toString(36).substring(2, 6)).join('-') }

    encoded = async () => {
        const palletColors = pallet();
        const uid = await this.uuid();

        const whiteboard = {
            uuid: uid,
            pallet: palletColors,
            draw: [],
            clients: new Set(),
            emails: []
        };

        this.database.set(whiteboard.uuid, whiteboard);

        return whiteboard;
    };

    decode = async (uuid) => { return this.database.get(uuid) };

    clients = async ({ uuid, ws, email }) => {
        const connected = this.database.get(uuid);
        if (!connected) return;

        connected.emails.push(email);
        connected.clients.add(ws);
        ws.send(JSON.stringify({ action: 'welcome', data: { history: connected.draw } }));
    }

    connections_email = (uuid) => {
        return this.database.get(uuid).emails;
    }
    
    connections = (uuid) => {
        return this.database.get(uuid).clients;
    }

    history = (uuid, history) => {
        const connected = this.database.get(uuid);
        if (!connected) return;

        connected.draw.push(history);
    }
};

module.exports = { Whiteboard };