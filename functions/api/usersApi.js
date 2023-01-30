const {checker} = require('../utils/checkerUserData');
const bcrypt = require('bcrypt');
const {requestHandler, getPublicUserData, getPrivateUserData, checkLoginExist} = require('../utils/requestMethods').requestMethods;
const {usersApi} = require('./api_list').list;

const setApi = function (app, db) {
    const validateUserData = function (userData) {
        if (!checker.checkLogin(userData.login)) {
            return {error: true, message: 'bad login'};
        }

        if (!checker.checkPassword(userData.password)) {
            return {error: true, message: 'bad password'};
        }

        if (!checker.checkEmail(userData.email)) {
            return {error: true, message: 'bad email'};
        }

        if (!checker.checkName(userData.personalInfo.firstName)) {
            return {error: true, message: 'bad firstName'};
        }

        if (!checker.checkName(userData.personalInfo.lastName)) {
            return {error: true, message: 'bad lastName'};
        }

        return {error: false, data: {}};
    }
    const validateChangeUserData = function (changedUserData) {
        switch (changedUserData.name) {
            case 'personalInfo':
                if (
                    checker.checkName(changedUserData.value.firstName) &&
                    checker.checkName(changedUserData.value.lastName)
                ) {
                    return true;
                }
                break;
            default:
                return false;
        }
    }

    // Создать пользователя
    app.post(usersApi.create.url, (req, res) => {
        requestHandler(req, res, async (request) => {
            const validUserData = validateUserData(request.data);

            if (validUserData.error) {
                res.status(200).send({
                    error: true,
                    data: {
                        message: validUserData.message
                    },
                });
                return;
            } else {
                if (await checkLoginExist(request.data.login, db)) {
                    res.status(200).send({
                        error: true,
                        data: {
                            message: 'login exist'
                        },
                    });
                    return;
                }

                let sessionId = null;
                let hashPassword = null;

                await bcrypt.hash(request.data.login, 10).then((h) => {
                    sessionId = h;
                });
                await bcrypt.hash(request.data.password, 10).then((h) => {
                    hashPassword = h;
                });

                const userData = {
                    login: request.data.login,
                    password: hashPassword,
                    personalInfo: {
                        firstName: {
                            value: request.data.personalInfo.firstName,
                            hidden: true
                        },
                        lastName: {
                            value: request.data.personalInfo.lastName,
                            hidden: true
                        },
                    },
                    conversations: [],
                    friends: [],
                    avatar: './photo.jpg',
                    email: request.data.email,
                    sessionId: sessionId,
                };

                await db
                    .collection('users')
                    .doc('/' + request.data.login + '/')
                    .create(userData)

                res.status(200).send({
                    error: false,
                    data: {
                        sessionId,
                        userData: getPrivateUserData(userData)
                    },
                });
            }
        });
    });

    // Получить информацию об одном пользователе по логину
    app.post(usersApi.getUserByLogin.url, (req, res) => {
        requestHandler(req, res, async (request) => {
            const query = db.collection('users').doc(request.data.login);
            const user = await query.get();
            const userData = user.data();

            if (userData === undefined) {
                res.status(200).send({
                    error: true,
                    data: {
                        message: 'No match',
                    },
                });
            } else {
                res.status(200).send({
                    error: false,
                    data: getPublicUserData(userData)
                });
            }
        });
    });

    // Получить пользователей по совпадению в начале логина
    app.post(usersApi.getListByLogin.url, (req, res) => {
        requestHandler(req, res, async (request) => {
            const query = db.collection('users')
                .orderBy('login')
                .startAt(request.data.login)
                .limit(request.data.limit);
            const getUsers = await query.get();
            const users = getUsers.docs.map((user) => getPublicUserData(user.data()));

            res.status(200).send({
                error: false,
                data: users
            });
        });
    });

    // Изменение информации пользователя
    app.post(usersApi.change.url, (req, res) => {
        requestHandler(req, res, async (request) => {
            let valid = validateChangeUserData(request.data);

            if (valid && await checkLoginExist(request.data.login, db)) {
                const document = db.collection('users').doc(request.data.login);

                await document.update({
                    [request.data.name]: request.data.value
                });

                res.status(200).send({
                    error: false,
                    data: {
                        message: "changed"
                    }
                });
            } else {
                res.status(200).send({
                    error: true,
                    data: {
                        message: "bad data"
                    }
                });
            }
        });
    });

    // Удаление пользователя
    app.post(usersApi.delete.url, (req, res) => {
        requestHandler(req, res, async (request) => {
            if (await checkLoginExist(request.data.login, db)) {
                const document = db.collection('users').doc(request.data.login);
                await document.delete();

                // TODO: Сделать временное удаление с возможностью отмены
                res.status(200).send({
                    error: false,
                    data: {
                        message: 'init delete',
                        deleteTime: Date.now() + 1000 * 60 * 60 * 24 * 14,
                    }
                });
            } else {
                res.status(200).send({
                    error: true,
                    data: {
                        message: 'bad login',
                    }
                });
            }
        });
    });
}

exports.setApi = setApi;