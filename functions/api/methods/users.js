const {checker} = require("../../utils/checkerUserData");
const bcrypt = require("bcrypt");
const {requestHandler, getPublicUserData, getPrivateUserData, checkLoginExist} = require('../../utils/requestMethods').requestMethods;


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
        case 'browzer':
            return true;
            break;
        default:
            return false;
    }
}
const validateUserAccess = function (db, data) {
    return new Promise(async (resolve, reject) => {
        const user = (await db.collection('users').doc(data.login).get()).data()
        if (user !== undefined && user.sessionId === data.sessionId) {
            resolve({
                error: false,
                data: {}
            })
        } else {
            reject({
                error: true,
                data: {
                    message: 'bad request'
                }
            })
        }
    });
}

const createUserAccount = function (db, data) {
    return new Promise(async (resolve, reject) => {
        const validUserData = validateUserData(data);

        if (validUserData.error) {
            reject({
                error: true,
                data: {
                    message: validUserData.message
                },
            });
            return;
        } else {
            if (await checkLoginExist(db, data.login)) {
                reject({
                    error: true,
                    data: {
                        message: 'login exist'
                    },
                });
                return;
            }

            let sessionId = null;
            let hashPassword = null;

            Promise.all([
                new Promise((resolve) => {
                    bcrypt.hash(data.password, 10).then((h) => {
                        hashPassword = h;
                        resolve();
                    });
                }),
                new Promise((resolve) => {
                    bcrypt.hash(data.login, 10).then((h) => {
                        sessionId = h;
                        resolve();
                    });
                })
            ])
                .then(async () => {
                    const userData = {
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
                            },
                        },
                        conversations: [],
                        friends: [],
                        avatar: 'https://t3.ftcdn.net/jpg/02/43/51/48/360_F_243514868_XDIMJHNNJYKLRST05XnnTj0MBpC4hdT5.jpg',
                        email: data.email,
                        sessionId: sessionId,
                        creationDate: Date.now(),
                        preference: {
                            conversations: 'all'
                        }
                    };

                    await db
                        .collection('users')
                        .doc('/' + data.login + '/')
                        .create(userData)

                    resolve({
                        error: false,
                        data: {
                            sessionId,
                            userData: getPrivateUserData(userData)
                        },
                    });
                })
                .catch((error) => {
                    reject({
                        error: true,
                        data: error
                    })
                });
        }
    });
}
const getPublicUserDataByLogin = function (db, data) {
    return new Promise(async (resolve, reject) => {
        const query = db.collection('users').doc(data.login);
        const user = await query.get();
        const userData = user.data();

        if (userData === undefined) {
            reject({
                error: true,
                data: {
                    message: 'no match',
                },
            });
        } else {
            resolve({
                error: false,
                data: getPublicUserData(userData)
            });
        }
    });
}
const getListOfPublicUsersDataByLogin = function (db, data) {
    return new Promise(async (resolve, reject) => {
        const query = db.collection('users')
            .orderBy('login');
        const getUsers = await query.get();

        const users = [];
        const docs = getUsers.docs;
        for (let i = 0; i < docs.length; i++) {
            const user = docs[i].data();
            if (user.login.match(new RegExp(`^${data.login}`, 'i'))) {
                users.push(getPublicUserData(user));
                if (users.length === data.limit) break;
            }
        }

        resolve({
            error: false,
            data: users
        });
    });
}
const changeUserData = function (db, data) {
    return new Promise(async (resolve, reject) => {
        let valid = validateChangeUserData(data);

        if (valid) {
            const document = db.collection('users').doc(data.login);

            await document.update({
                [data.name]: data.value
            });

            resolve({
                error: false,
                data: {
                    message: "changed",
                }
            });
        } else {
            reject({
                error: true,
                data: {
                    message: 'bad data'
                }
            })
        }
    });
}
const deleteUserData = function (db, data) {
    return new Promise(async (resolve, reject) => {
        if (await checkLoginExist(db, data.login)) {
            const document = db.collection('users').doc(data.login);
            await document.delete();

            // TODO: Сделать временное удаление с возможностью отмены

            resolve({
                error: false,
                data: {
                    message: 'init delete',
                    deleteTime: Date.now() + 1000 * 60 * 60 * 24 * 14,
                }
            });
        } else {
            reject({
                error: true,
                data: {
                    message: 'bad login',
                }
            });
        }
    });
}

exports.methods = {
    createUserAccount,
    getPublicUserDataByLogin,
    getPublicUserData,
    getListOfPublicUsersDataByLogin,
    changeUserData,
    deleteUserData,
    validateUserAccess
}