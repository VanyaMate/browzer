const socketServer = require('http').createServer();
const { Server } = require('socket.io');
const {response} = require("express");
const io = new Server(socketServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["user-data"],
        credentials: true
    }
});
const { validateUserAccess } = require('../functions/api/methods/users').methods;

const sockets = function (app, db) {
    const connections = {

    };

    app.socketConnections = connections;

    io.on('connection', (socket) => {
        socket.on('message', (data) => {
            console.log('Message', data);
            if (data.type === 'auth') {
                validateUserAccess(db, {
                    login: data.login,
                    sessionId: data.sessionId
                }).then((response) => {
                    connections[data.login] = socket;
                    socket.send(response);
                }).catch((response) => {
                    socket.send(response);
                })
            }
        })
    });

    socketServer.listen(5002, () => {
        console.log('Socket server start: 5002');
    });
}

exports.socketInit = sockets;