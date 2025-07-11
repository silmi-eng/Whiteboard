const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

const { Whiteboard } = require('./services/whiteboard.service');
const whiteboard = new Whiteboard();

require('./router/pages.router')(app, express, whiteboard);
require('./router/wss.router')({ server, whiteboard });

module.exports = app;