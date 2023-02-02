const {requestHandler} = require('../utils/requestMethods').requestMethods;
const {loginApi} = require('./api_list').list;
const {checkLoginPass, checkLoginSessionId} = require('./methods/login').methods;

const setApi = function (app, db) {

    // Проверить логин/пароль пользователя и получить sessionId
    app.post(loginApi.pass.url, (req, res) => {
        requestHandler(req, res, async (request) => {
            checkLoginPass(db, request.data)
                .then(body => res.status(200).send(body))
                .catch(body => res.status(200).send(body));
        });
    })

    // Проверить актуальность логин/sessionId пользователя
    app.post(loginApi.id.url, (req, res) => {
        requestHandler(req, res, async (request) => {
            checkLoginSessionId(db, request.data)
                .then(body => res.status(200).send(body))
                .catch(body => res.status(200).send(body))
        });
    })
}

exports.setApi = setApi;