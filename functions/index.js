const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const app = express();
const serviceAccount = require("./perm.json");
const usersApi = require('./api/usersApi.js');
const loginApi = require('./api/loginApi.js');
const messagesApi = require('./api/conversationsApi.js');

app.use(cors({ origin: true }));
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://socialbrowsr-cfe4b-default-rtdb.europe-west1.firebasedatabase.app"
});

const db = admin.firestore();

usersApi.setApi(app, db);
loginApi.setApi(app, db);
messagesApi.setApi(app, db);

exports.app = functions.https.onRequest(app);