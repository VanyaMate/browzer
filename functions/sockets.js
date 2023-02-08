const socketServer = require('http').createServer();
const { Server } = require('socket.io');
const { validateUserAccess } = require('../functions/api/methods/users').methods;

const sockets = function (app, db) {
    const io = new Server(socketServer, {
        // https://browzer.onrender.com
        // http://localhost:3000
        cors: {
            origin: true,
            methods: ["GET", "POST"],
            allowedHeaders: ["user-data"]
        }
    });

    const connections = {

    };

    app.socketConnections = connections;
    console.log('io is: ', io);

    io.on('connection', (socket) => {
        console.log('connection', socket.id);
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