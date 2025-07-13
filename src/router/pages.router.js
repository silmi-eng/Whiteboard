require('dotenv').config();
const path = require('path');

module.exports = (app, express, whiteboard) => {
    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "..", "views"));
    app.use("/public", express.static(path.join(__dirname, "..", "public")));

    app.get('/whiteboard/:uuid/:email', async (req, res, next) => {
        const RESPNSE = await whiteboard.decode(req.params.uuid);
        const email = decodeURIComponent(req.params.email);

        if (RESPNSE === undefined)
            return res.status(200).redirect('/');

        const { pallet, draw, uuid } = RESPNSE;
        res.status(200).render('whiteboard', { colors: pallet, draw, uuid, wss_url: process.env.WSS, email });
    });

    app.get('/whiteboard/:uuid', async (req, res, next) => {
        const RESPNSE = await whiteboard.decode(req.params.uuid);

        if (RESPNSE === undefined)
            return res.status(200).redirect('/');


        res.status(200).render('email', { url: `/whiteboard/${req.params.uuid}` });
    });

    app.get('/', async (req, res, next) => {
        const { uuid } = await whiteboard.encoded();

        res.status(200).render('index', { url: `/whiteboard/${uuid}` });
    });
};