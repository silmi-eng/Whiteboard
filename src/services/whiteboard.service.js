const { pallet } = require('./colors.service');

class Whiteboard {
    constructor () { this.database = new Map() }

    uuid = async () => { return ([...Array(4)]).map(() => Math.random().toString(36).substring(2, 6)).join('-') }

    encoded = async () => {
        const palletColors = pallet();
        const uid = await this.uuid();

        const whiteboard = {
            uuid: uid,
            pallet: palletColors,
            draw: [],
            clients: new Set()
        };

        this.database.set(whiteboard.uuid, whiteboard);

        return whiteboard;
    };

    decode = async (uuid) => { return this.database.get(uuid) };

    clients = async ({ uuid, ws }) => {
        const connected = this.database.get(uuid);
        if (!connected) return;

        connected.clients.add(ws);
        ws.send(JSON.stringify({ action: 'welcome', data: { history: connected.draw } }));
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