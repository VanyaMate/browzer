const {checker} = require('../utils/checker');
const bcrypt = require('bcrypt');

const setApi = function (app, db) {
    const getPublicData = function (userData) {
        return {
            login: userData.login,
            personalInfo: {
                firstName: (!userData.personalInfo.firstName.hidden && userData.personalInfo.firstName.value) || '',
                lastName: (!userData.personalInfo.lastName.hidden && userData.personalInfo.lastName.value) || '',
            },
            lastTimeOnline: userData.lastTimeOnline || 0,
            avatar: './photo.jpg'
        };
    }
    const getUserData = function (userData) {
        return {
            ...userData,
            ...{
                password: null,
                sessionId: null
            }
        };
    }
    const getRequestData = function (requestBody) {
        return typeof requestBody === 'string' ? JSON.parse(requestBody || "{}") : requestBody;
    }
    const checkLoginExist = async function (login) {
        return (await db.collection('users').doc(login).get()).data();
    }
    const validationUserData = function (userData) {
        if (!checker.checkLogin(userData.login)) {
            return {error: true, message: 'bad login', code: 400};
        }

        if (!checker.checkPassword(userData.password)) {
            return {error: true, message: 'bad password', code: 400};
        }

        if (!checker.checkEmail(userData.email)) {
            return {error: true, message: 'bad email', code: 400};
        }

        if (!checker.checkName(userData.personalInfo.firstName)) {
            return {error: true, message: 'bad firstName', code: 400};
        }

        if (!checker.checkName(userData.personalInfo.lastName)) {
            return {error: true, message: 'bad lastName', code: 400};
        }

        return {error: false, data: {}, code: 200};
    }
    const validationRequestIP = function (request) {
        return true;
    }
    const validateRequest = function (request) {
        const data = getRequestData(request.body);
        const validRequestIP = validationRequestIP(request);

        if (validRequestIP.error) {
            return {error: true, data: {message: 'bad request'}};
        } else {
            return {error: false, data};
        }
    }
    const validationChangeUserData = function (changeUserData) {
        switch (changeUserData.name) {
            case 'personalInfo':
                if (
                    checker.checkName(changeUserData.value.firstName) &&
                    checker.checkName(changeUserData.value.lastName)
                ) {
                    return true;
                }
                break;
            default:
                return false;
                break;
        }
    }

    const requestHandler = function (req, res, callback) {
        try {
            const request = validateRequest(req);

            if (request.error) {
                res.status(request.code).send({
                    error: true,
                    data: {
                        message: request.data.message
                    },
                });
            } else {
                callback(request);
            }
        }
        catch (error) {
            res.status(500).send({
                error: true,
                data: error,
            });
        }
    }

    // Создать пользователя
    app.post('/api/users/create', (req, res) => {
        requestHandler(req, res, async (request) => {
            const validUserData = validationUserData(request.data);

            if (validUserData.error) {
                res.status(200).send({
                    error: true,
                    data: {
                        message: validUserData.message
                    },
                });
                return;
            } else {
                if (await checkLoginExist(request.data.login)) {
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
                        userData: getUserData(userData)
                    },
                });
            }
        });
    });

    // Получить информацию об одном пользователе по логину
    app.post('/api/users/getUserByLogin', (req, res) => {
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
                    data: getPublicData(userData)
                });
            }
        });
    });

    // Получить пользователей по совпадению в начале логина
    app.post('/api/users/getListByLogin', (req, res) => {
        requestHandler(req, res, async (request) => {
            const query = db.collection('users')
                .orderBy('login')
                .startAt(request.data.login)
                .limit(request.data.limit);
            const getUsers = await query.get();
            const users = getUsers.docs.map((user) => getPublicData(user.data()));

            res.status(200).send({
                error: false,
                data: users
            });
        });
    });

    // Изменение информации пользователя
    app.post('/api/users/change', (req, res) => {
        requestHandler(req, res, async (request) => {
            let valid = validationChangeUserData(request.data);

            if (valid && await checkLoginExist(request.data.login)) {
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
    app.post('/api/users/delete', (req, res) => {
        requestHandler(req, res, async (request) => {
            if (await checkLoginExist(request.data.login)) {
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
                return res.status(200).send({
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