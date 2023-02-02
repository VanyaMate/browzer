const {checker} = require("../../utils/checkerUserData");
const bcrypt = require("bcrypt");
const {getPrivateUserData} = require('../../utils/requestMethods').requestMethods;

const validateUserData = function (data) {
    if (!checker.checkLogin(data.login)) {
        return {error: true, message: 'bad login'};
    }

    if (!checker.checkPassword(data.password)) {
        return {error: true, message: 'bad password'};
    }

    return {error: false, code: 200};
}

const checkLoginPass = function (db, data) {
    return new Promise(async (resolve, reject) => {
        const valid = validateUserData(data);

        if (valid.error) {
            reject({
                error: true,
                data: {
                    message: valid.message,
                }
            });
            return;
        }

        const doc = db.collection('users').doc(data.login);
        const user = await doc.get();
        const userData = user.data();

        if (userData === undefined) {
            reject({
                error: true,
                data: {
                    message: 'bad login',
                }
            });
            return;
        }

        await bcrypt.compare(data.password, userData.password, (err, result) => {
            if (result) {
                resolve({
                    error: false,
                    data: {
                        sessionId: userData.sessionId,
                        userData: getPrivateUserData(userData)
                    }
                });
            } else {
                reject({
                    error: true,
                    data: {
                        message: 'bad password',
                    }
                });
            }
        })
    });
}

const checkLoginSessionId = function (db, data) {
    console.log('checkLoginSsessionId', data);
    return new Promise(async (resolve, reject) => {
        console.log('Data is');
        console.log(data);
        if (checker.checkLogin(data.login)) {
            const doc = db.collection('users').doc(data.login);
            const user = await doc.get();
            const userData = user.data();

            if ((userData !== undefined) && (userData.sessionId === data.sessionId)) {
                resolve({
                    error: false,
                    data: {
                        sessionId: userData.sessionId,
                        userData: getPrivateUserData(userData)
                    }
                });
                return;
            }
        }

        reject({
            error: true,
            data: {
                message: 'bad login/sessionId'
            }
        });
    });
}

exports.methods = {
    checkLoginPass,
    checkLoginSessionId
}