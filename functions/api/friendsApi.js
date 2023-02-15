const { friendsApi } = require('./api_list').list;
const {requestHandler, getPublicUserData} = require('../utils/requestMethods').requestMethods;
const {addFriend, removeFriends} = require('./methods/friends').methods;
const {validateUserAccess} = require('./methods/users').methods;

const setApi = function (app, db) {
    app.post(friendsApi.add.url, (req, res) => {
        requestHandler(req, res, (response) => {
            validateUserAccess(db, response.data)
                .then(({ data: { user }}) => {
                    response.data.user = user;
                    addFriend(db, response.data)
                        .then((body) => {
                            const { type, add, me } = body.data;

                            switch (type) {
                                case 'add-to-request':
                                    app.socketConnections[add.login]?.send({
                                        type: 'friends-request-in',
                                        data: me
                                    });
                                    app.socketConnections[me.login]?.send({
                                        type: 'friends-request-out',
                                        data: add
                                    });
                                    break;
                                case 'add-to-friends':
                                    app.socketConnections[add.login]?.send({
                                        type: 'friends-add-in',
                                        data: me
                                    });
                                    app.socketConnections[me.login]?.send({
                                        type: 'friends-add-out',
                                        data: add
                                    });
                                    break;
                                default:
                                    break;
                            }

                            res.status(200).send({
                                error: false,
                                data: {type, add, me}
                            });
                        })
                        .catch((body) => res.status(200).send(body))
                })
                .catch((body) => res.status(200).send(body))
        });
    })

    app.post(friendsApi.remove.url, (req, res) => {
        requestHandler(req, res, (response) => {
            validateUserAccess(db, response.data)
                .then(({ data: { user }}) => {
                    response.data.user = user;
                    removeFriends(db, response.data)
                        .then((body) => {
                            const { type, remove, me } = body.data;

                            switch (type) {
                                case 'remove-friend':
                                    app.socketConnections[remove.login]?.send({
                                        type: 'friends-remove-in',
                                        data: me
                                    });
                                    app.socketConnections[me.login]?.send({
                                        type: 'friends-remove-out',
                                        data: remove
                                    });
                                    break;
                                case 'remove-in-request':
                                    app.socketConnections[remove.login]?.send({
                                        type: 'friends-remove-in-request-in',
                                        data: me
                                    });
                                    app.socketConnections[me.login]?.send({
                                        type: 'friends-remove-in-request-out',
                                        data: remove
                                    });
                                    break;
                                case 'remove-out-request':
                                    app.socketConnections[remove.login]?.send({
                                        type: 'friends-remove-out-request-in',
                                        data: me
                                    });
                                    app.socketConnections[me.login]?.send({
                                        type: 'friends-remove-out-request-out',
                                        data: remove
                                    });
                                    break;
                                default: break;
                            }

                            res.status(200).send({
                                error: false,
                                data: {type, remove, me}
                            });
                        })
                        .catch((body) => res.status(200).send(body))
                })
                .catch((body) => res.status(200).send(body))
        })
    })
}

exports.setApi = setApi;