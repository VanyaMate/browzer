const {messagesApi} = require('./api_list').list;
const { requestHandler } = require('../utils/requestMethods').requestMethods;
const {validateConversationUserAccess} = require('./methods/conversations').methods;
const {getMessagesFromConversation, getMessagesFromConversationsAfter} = require('./methods/messages').methods;

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
}

exports.setApi = setApi;