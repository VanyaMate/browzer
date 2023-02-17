const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const app = express();
const serviceAccount = require("./perm.json");
const usersApi = require('./api/usersApi.js');
const loginApi = require('./api/loginApi.js');
const conversationApi = require('./api/conversationsApi.js');
const messagesApi = require('./api/messagesApi.js');
const friendsApi = require('./api/friendsApi.js');
const socketServer = require('http').createServer(app);
const { Server } = require('socket.io');
const { validateUserAccess } = require('../functions/api/methods/users').methods;
const { getPrivateUserData } = require('../functions/utils/requestMethods').requestMethods;

app.use(cors({ origin: true }));
app.use(express.json())
app.use(express.static(__dirname + '/assets'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://socialbrowsr-cfe4b-default-rtdb.europe-west1.firebasedatabase.app"
});

const db = admin.firestore();

usersApi.setApi(app, db);
loginApi.setApi(app, db);
conversationApi.setApi(app, db);
messagesApi.setApi(app, db);
friendsApi.setApi(app, db);

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

const removeConnectionAfter2Minute = function (login) {
    return setTimeout(() => {
        delete connections[login];
    }, 1000 * 120) // delete socket from list after 100 seconds
}

io.on('connection', (socket) => {
    console.log('connection', socket.id);
    socket.on('message', (data) => {
        console.log(data);
        if (data.type === 'ping') {
            if (connections[data.login]) {
                clearTimeout(connections[data.login].removeTimer);
                connections[data.login].removeTimer = removeConnectionAfter2Minute(data.login);
                socket.send({
                    type: 'pong'
                })
            } else {
                socket.send({
                    error: true,
                    message: 'need auth'
                })
            }
        } else if (data.type === 'auth') {
            validateUserAccess(db, {
                login: data.login,
                sessionId: data.sessionId
            }).then((response) => {
                clearTimeout(connections[data.login] && connections[data.login].removeTimer);
                connections[data.login] = socket;
                connections[data.login].removeTimer = removeConnectionAfter2Minute(data.login);
                socket.send({
                    error: false,
                    data: {
                        user: getPrivateUserData(response.data.user)
                    }
                });
            }).catch((response) => {
                socket.send(response);
            })
        }
    })
});

socketServer.listen(5001, () => {
    console.log('Socket server start: 5001');
});

// for deploy
/*app.listen(5001, () => {
    console.log(`Backend server start: 5001`);
})*/
