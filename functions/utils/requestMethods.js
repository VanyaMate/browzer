const getPublicUserData = function (userData) {
    return {
        login: userData.login,
        personalInfo: {
            firstName: (!userData.personalInfo.firstName.hidden && userData.personalInfo.firstName.value) || '',
            lastName: (!userData.personalInfo.lastName.hidden && userData.personalInfo.lastName.value) || '',
        },
        lastTimeOnline: userData.lastTimeOnline || 0,
        avatar: userData.avatar || './photo.jpg'
    };
}
const getPrivateUserData = function (userData) {
    const privateData = JSON.parse(JSON.stringify(userData));

    delete privateData.password;
    delete privateData.sessionId;

    return privateData;
}
const getRequestData = function (requestBody) {
    return typeof requestBody === 'string' ? JSON.parse(requestBody || "{}") : requestBody;
}

const checkLoginExist = async function (db, login) {
    return (await db.collection('users').doc(login).get()).data();
}

const validateRequestIP = function (request) {
    return true;
}
const validateRequest = function (request) {
    const data = getRequestData(request.body);
    const validRequestIP = validateRequestIP(request);

    if (validRequestIP.error) {
        return {error: true, data: {message: 'bad request'}};
    } else {
        return {error: false, data};
    }
}

const requestHandler = function (req, res, callback, db) {
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
            callback(request, req, res, db);
        }
    }
    catch (error) {
        res.status(500).send({
            error: true,
            data: error,
        });
    }
}

exports.requestMethods = {
    requestHandler,
    getPublicUserData,
    getPrivateUserData,
    checkLoginExist,
}