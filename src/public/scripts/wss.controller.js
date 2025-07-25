class WebConnection {
    constructor ({ url, connection_id, email }) {
        this.wss = new WebSocket(url);
        this.connection_id = connection_id;
        this.email = email;
        this.callback = {};

        this.wss.addEventListener('open', this.room);
        this.wss.addEventListener('message', (message) => {
            const { action, data } = JSON.parse(message.data);

            switch (action) {
                case 'welcome':
                    this.history(data.history);
                    console.log('Enter on room successfuly');
                break;
                case 'mouse_event':
                    this.runCb('drawing', data)
                break;
                case 'notification_event':
                    console.log(data);
                break;
            }
        });

    };

    history = (history) => {
        if (!history || history.length !== 0)
            for (const point of history) {
                this.runCb('drawing', point);
            }


        this.runCb('erase_points');
    }

    room = () => {
        this.wss.send(
            JSON.stringify({ action: 'room', data: { uuid: this.connection_id, email: this.email }})
        );
    };

    draw = ({ x_, y_, color, erase }) => {
        this.wss.send(
            JSON.stringify({ 
                action: 'mouse_event', 
                data: { 
                    uuid: this.connection_id,
                    x_,
                    y_,
                    color,
                    erase
                }
            })
        );
    };

    notification = () => {
        this.wss.send(
            JSON.stringify({ action: 'notification_event', data: { uuid: this.connection_id, email: this.email }})
        );
    }

    setCb = (param, func) => this.callback[param] = func;

    runCb = (func, ...args) => {
        if (typeof this.callback?.[func] === 'function') {
            this.callback[func](...args);
        }
    };
}