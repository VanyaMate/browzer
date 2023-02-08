const {messagesApi} = require('./api_list').list;
const { requestHandler } = require('../utils/requestMethods').requestMethods;
const {validateConversationUserAccess, getConversationMembers} = require('./methods/conversations').methods;
const {getMessagesFromConversation, getMessagesFromConversationsAfter, addMessageTo} = require('./methods/messages').methods;

const setApi = function (app, db) {
    app.post(messagesApi.getFromConversation.url, (req, res) => {
        requestHandler(req, res, (request) => {
            validateConversationUserAccess(db, request.data)
                .then(({ data: id }) => {
                    getMessagesFromConversation(db, request.data)
                        .then((body) => res.status(200).send(body))
                        .catch((error) => res.status(200).send({
                            error: true,
                            data: error
                        }))
                })
                .catch((body) => res.status(200).send(body));
        });
    });

    app.post(messagesApi.addMessage.url, (req, res) => {
        requestHandler(req, res, (request) => {
            validateConversationUserAccess(db, request.data)
                .then((body) => {
                    addMessageTo(db, request.data)
                        .then((body) => {
                            getConversationMembers(db, request.data).then((members) => {
                                members.forEach((user) => {
                                    console.log(user.login);
                                    app.socketConnections[user.login]?.send(body.data.message);
                                });
                            });
                            res.status(200).send(body)
                        })
                        .catch((body) => res.status(200).send(body));
                })
                .catch((body) => res.status(200).send(body));
        });
    });
}

exports.setApi = setApi;