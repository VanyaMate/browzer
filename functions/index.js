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

app.use(cors({ origin: true }));
app.use(express.json())

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

socketServer.listen(5001, () => {
    console.log('Socket server start: 5001');
});

// for deploy
/*app.listen(5001, () => {
    console.log(`Backend server start: 5001`);
})*/
