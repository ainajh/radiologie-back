const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const socket = new Server(server, {
    cors: {
      origin: "*",
    },
});

module.exports = { socket, server, app };
