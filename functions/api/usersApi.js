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

    const validationUserData = function (data) {
        if (!checker.checkLogin(data.login)) {
            return {error: true, message: "bad login", code: 400};
        }

        if (!checker.checkPassword(data.password)) {
            return {error: true, message: "bad password", code: 400};
        }

        if (!checker.checkEmail(data.email)) {
            return {error: true, message: "bad email", code: 400};
        }

        if (!checker.checkName(data.personalInfo.firstName)) {
            return {error: true, message: "bad firstName", code: 400};
        }

        if (!checker.checkName(data.personalInfo.lastName)) {
            return {error: true, message: "bad lastName", code: 400};
        }

        return {error: false, code: 200};
    }

    // Создать пользователя
    app.post('/api/users', (req, res) => {
        (async () => {
            try {
                const data = typeof req.body === 'string' ? JSON.parse(req.body || "{}") : req.body;
                const validStatus = validationUserData(data);

                if (!validStatus.error) {
                    let sessionId = null;
                    let hashPassword = null;

                    await bcrypt.hash(data.login, 10).then((h) => {
                        sessionId = h;
                    });
                    await bcrypt.hash(data.password, 10).then((h) => {
                        hashPassword = h;
                    });

                    await db
                        .collection('users')
                        .doc('/' + data.login + '/')
                        .create({
                            login: data.login,
                            password: hashPassword,
                            personalInfo: {
                                firstName: {
                                    value: data.personalInfo.firstName,
                                    hidden: true
                                },
                                lastName: {
                                    value: data.personalInfo.lastName,
                                    hidden: true
                                }
                            },
                            avatar: './photo.jpg',
                            email: data.email,
                            sessionId: sessionId,
                        })

                    return res.status(200).send({sessionId, success: true});
                } else {
                    return res.status(validStatus.code).send(validStatus.message);
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).send(error);
            }
        })();
    });

    // Получить информацию об одном пользователе по логину
    app.get('/api/user/:login', (req, res) => {
        (async () => {
            try {
                const document = db.collection('users').doc(req.params.login);
                const user = await document.get();
                const response = user.data();

                return res.status(200).send(getPublicData(response));
            }
            catch (error) {
                return res.status(500).send(error);
            }
        })();
    });

    // Получить пользователей по совпадению в начале логина
    app.get('/api/users/:login', (req, res) => {
        (async () => {
            try {
                const document = db.collection('users');
                const getUsers = document.get();
                let users = [];

                await getUsers.then(({docs}) => {
                    const regexp = new RegExp(`^(${req.params.login})`);
                    for (const doc of docs) {
                        if (doc.id.match(regexp)) {
                            users.push(getPublicData(doc.data()));
                        }
                    }
                });

                return res.status(200).send(users);
            }
            catch (error) {
                return res.status(500).send(error);
            }
        })();
    });

    // Изменение информации пользователя
    app.put('/api/user/:login', (req, res) => {
        (async () => {
            const data = typeof req.body === 'string' ? JSON.parse(req.body || "{}") : req.body;

            try {
                const document = db.collection('users').doc(req.params.login);

                await document.update({
                    [data.changeParamName]: data.changeParamValue
                });

                return res.status(200).send({success: true});
            }
            catch (error) {
                return res.status(500).send(error);
            }
        })();
    });

    // Удаление пользователя
    app.delete('/api/user/:login', (req, res) => {
        (async () => {
            try {
                const document = db.collection('users').doc(req.params.login);
                await document.delete();

                return res.status(200).send({success: true});
            }
            catch (error) {
                return res.status(500).send(error);
            }
        })();
    });
}

exports.setApi = setApi;