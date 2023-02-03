const {checker} = require('../utils/checkerUserData');
const bcrypt = require('bcrypt');
const {requestHandler, getPublicUserData, getPrivateUserData, checkLoginExist} = require('../utils/requestMethods').requestMethods;
const {usersApi} = require('./api_list').list;
const {
    createUserAccount,
    getPublicUserDataByLogin,
    getListOfPublicUsersDataByLogin,
    changeUserData,
    deleteUserData,
    validateUserAccess
} = require('./methods/users').methods;

const setApi = function (app, db) {
    // Создать пользователя
    app.post(usersApi.create.url, (req, res) => {
        requestHandler(req, res, async (request) => {
            createUserAccount(db, request.data)
                .then(body => res.status(200).send(body))
                .catch(body => res.status(200).send(body));
        });
    });

    // Получить информацию об одном пользователе по логину
    app.post(usersApi.getUserByLogin.url, (req, res) => {
        requestHandler(req, res, async (request) => {
            getPublicUserDataByLogin(db, request.data)
                .then(body => res.status(200).send(body))
                .catch(body => res.status(200).send(body));
        });
    });

    // Получить пользователей по совпадению в начале логина
    app.post(usersApi.getListByLogin.url, (req, res) => {
        requestHandler(req, res, async (request) => {
            getListOfPublicUsersDataByLogin(db, request.data)
                .then(body => res.status(200).send(body))
                .catch(body => res.status(200).send(body));
        });
    });

    // Изменение информации пользователя
    app.post(usersApi.change.url, (req, res) => {
        requestHandler(req, res, async (request) => {
            validateUserAccess(db, request.data)
                .then(() => {
                    changeUserData(db, request.data)
                        .then(body => res.status(200).send(body))
                        .catch(body => res.status(200).send(body));
                })
                .catch((body) => {
                    res.status(200).send(body);
                })
        });
    });

    // Удаление пользователя
    app.post(usersApi.delete.url, (req, res) => {
        requestHandler(req, res, async (request) => {
            deleteUserData(db, request.data)
                .then(body => res.status(200).send(body))
                .catch(body => res.status(200).send(body));
        });
    });
}

exports.setApi = setApi;