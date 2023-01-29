const bcrypt = require("bcrypt");
const {checker} = require("../utils/checkerUserData");
const {requestHandler, getPrivateUserData} = require('../utils/requestMethods').requestMethods;

const setApi = function (app, db) {
    const validateUserData = function (data) {
        if (!checker.checkLogin(data.login)) {
            return {error: true, message: 'bad login'};
        }

        if (!checker.checkPassword(data.password)) {
            return {error: true, message: 'bad password'};
        }

        return {error: false, code: 200};
    }

    // Проверить логин/пароль пользователя и получить sessionId
    app.post('/api/login/pass', (req, res) => {
        requestHandler(req, res, async (request) => {
            const valid = validateUserData(request.data);

            if (valid.error) {
                res.status(400).send({
                    error: true,
                    data: {
                        message: valid.message,
                    }
                });
                return;
            }

            const doc = db.collection('users').doc(request.data.login);
            const user = await doc.get();
            const userData = user.data();

            if (userData === undefined) {
                res.status(200).send({
                    error: true,
                    data: {
                        message: 'bad login/password'
                    },
                });
                return;
            }

            await bcrypt.compare(request.data.password, userData.password, (err, result) => {
                if (result) {
                    res.status(200).send({
                        error: false,
                        data: {
                            sessionId: userData.sessionId,
                            userData: getPrivateUserData(userData)
                        }
                    });
                } else {
                    res.status(200).send({
                        error: true,
                        data: {
                            message: 'bad login/password'
                        }
                    });
                }
            })
        });
    })

    // Проверить актуальность логин/sessionId пользователя
    app.post('/api/login/id', (req, res) => {
        requestHandler(req, res, async (request) => {
            if (checker.checkLogin(request.data.login)) {
                const doc = db.collection('users').doc(request.data.login);
                const user = await doc.get();
                const userData = user.data();

                if (userData === undefined) {
                    res.status(200).send({
                        error: true,
                        data: {
                            message: 'bad login/sessionId'
                        }
                    });
                    return;
                }

                if (userData.sessionId === request.data.sessionId) {
                    res.status(200).send({
                        error: false,
                        data: {
                            sessionId: userData.sessionId,
                            userData: getPrivateUserData(userData)
                        }
                    });
                    return;
                } else {
                    res.status(200).send({
                        error: true,
                        data: {
                            message: 'bad login/sessionId'
                        }
                    });
                    return;
                }
            }

            res.status(200).send({
                error: true,
                data: {
                    message: 'bad login/sessionId'
                }
            });
        });
    })
}

exports.setApi = setApi;