const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let context = { drawing: false, color: null, lastX: null, lastY: null, erase: false };
const connection = new WebConnection({ url: window.wss_url, connection_id: window.uuid });

const draw = {
    drawing: ({ x_, y_, color, erase }) => {
        console.log(context);
        if (x_ === null || y_ === null) {
            context.lastX = null;
            context.lastY = null;
            return;
        }

        const rec = canvas.getBoundingClientRect();

        const x = x_ * rec.width;
        const y = y_ * rec.height;

        if (erase) {
            ctx.globalCompositeOperation = "destination-out";
            ctx.strokeStyle = "rgba(0,0,0,1)";
            ctx.lineWidth = 10;
        }
        else {
            ctx.globalCompositeOperation = "source-over";
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.lineCap = "round";
        }    

        if (context.lastX != null && context.lastY != null) {
            ctx.beginPath();
            ctx.moveTo(context.lastX, context.lastY);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
        else {
            ctx.fillStyle = color
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        context.lastX = x;
        context.lastY = y;
    },
    mouse_event: (e) => {
        if (!context.drawing || (context.color === null && context.erase === false)) return;

        const rec = canvas.getBoundingClientRect();
        const x = (e.clientX - rec.left) / rec.width;
        const y = (e.clientY - rec.top) / rec.height;

        console.log({ x_: x, y_: y, color: context.color, erase: context.erase });
        

        draw.drawing({ x_: x, y_: y, color: context.color, erase: context.erase });
        connection.draw({ x_: x, y_: y, color: context.color, erase: context.erase });
    },
    touch_event: (e) => {
        if (!context.drawing || (context.color === null && context.erase === false)) return;

        const rec = canvas.getBoundingClientRect();
        const x = (e.touches[0].clientX - rec.left) / rec.width;
        const y = (e.touches[0].clientY - rec.top) / rec.height;

        draw.drawing({ x_: x, y_: y, color: context.color, erase: context.erase });
        connection.draw({ x_: x, y_: y, color: context.color, erase: context.erase });

        e.preventDefault();
    }
};

canvas.addEventListener('mousedown', () => context.drawing = true);
canvas.addEventListener('mouseup', () => {
    connection.draw({ x_: null, y_: null, color: null });
    context.drawing = false;
    context.lastX = null;
    context.lastY = null;
});
canvas.addEventListener('mousemove', draw.mouse_event);

canvas.addEventListener('touchstart', () => context.drawing = true);
canvas.addEventListener('touchend', () => {
    connection.draw({ x_: null, y_: null, color: null });
    context.drawing = false;
    context.lastX = null;
    context.lastY = null;
});
canvas.addEventListener('touchmove', draw.touch_event);

const resize = () => {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
};

resize();
window.addEventListener('resize', resize);

connection.setCb('drawing', draw.drawing);
connection.setCb('erase_points', () => {
    context.lastX = null;
    context.lastY = null;
});

pallet.invoke(window.colors);