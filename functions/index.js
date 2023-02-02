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

app.use(cors({ origin: true }));
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://socialbrowsr-cfe4b-default-rtdb.europe-west1.firebasedatabase.app"
});

const db = admin.firestore();

console.log('Set APIs');
usersApi.setApi(app, db);
console.log('loginApi set API');
loginApi.setApi(app, db);
console.log('conversationApi set API');
conversationApi.setApi(app, db);
console.log('conversationApi set API');
conversationApi.setApi(app, db);
console.log('messagesApi set API');
messagesApi.setApi(app, db);
console.log('APIs setted');

// exports.app = functions.https.onRequest(app);

// for deploy
app.listen(3000, () => {
    console.log(`Example app listening on port 3000`)
})