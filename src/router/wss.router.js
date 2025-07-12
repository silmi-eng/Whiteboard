require('dotenv').config();
const WebSocket = require('ws');

class WebConnection {
    constructor ({ server, whiteboard }) {
        this.wss = new WebSocket.Server({ port: 3000 });
        this.whiteboard = whiteboard;

        this.wss.on('connection', (ws) => {
            ws.on('message', (message) => {
                const { action, data } = JSON.parse(message);

                switch (action) {
                    case 'room': 
                        this.whiteboard.clients({ uuid: data.uuid, ws });
                    break;
                    case 'mouse_event': 
                        this.mouse_event(data, ws);
                        this.history_event(data);
                    break;
                }
            });
        });
    }

    history_event = ({ x_, y_, color, uuid, erase }) => {
        this.whiteboard.history(uuid, { x_, y_, color, erase });
    }

    mouse_event = ({ x_, y_, color, erase, uuid }, ws) => {
        const connections = this.whiteboard.connections(uuid);

        for (const client of connections) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(
                    JSON.stringify({
                        action: 'mouse_event',
                        data: { x_, y_, color, erase }
                    })
                )
            }
        }
    };

    
}

module.exports = ({ server, whiteboard }) => { new WebConnection({ server, whiteboard })};