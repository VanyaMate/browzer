const { requestHandler } = require('../utils/requestMethods').requestMethods;
const {conversationsApi, loginApi} = require('./api_list').list;
const {
    getConversation,
    getConversationsList,
    validateConversationUserAccess,
    validateConversationsListUserAccess,
    createConversation,
    deleteConversation
} = require('./methods/conversations').methods;


const setApi = function (app, db) {
    app.post(conversationsApi.get.url, (req, res) => {
        requestHandler(req, res, async (request) => {
            validateConversationUserAccess(db, request.data)
                .then(async ({ data: id }) => {
                    const conversation = await getConversation(db, request.data);

                    if (conversation) {
                        res.status(200).send({
                            error: false,
                            data: {
                                info: conversation.info,
                                messages: conversation.messages
                            }
                        });
                    } else {
                        res.status(200).send({
                            error: true,
                            data: {
                                message: 'bad id'
                            }
                        })
                    }
                })
                .catch((body) => res.status(200).send(body));
        });
    });

    app.post(conversationsApi.getList.url, (req, res) => {
        requestHandler(req, res, async(request) => {
            validateConversationsListUserAccess(db, request.data)
                .then(async ({ data: ids }) => {
                    const conversationsList = await getConversationsList(db, {...request.data, ids});

                    if (conversationsList) {
                        res.status(200).send({
                            error: false,
                            data: {
                                conversations: conversationsList
                            }
                        });
                    } else {
                        res.status(200).send({
                            error: true,
                            data: 'no match'
                        })
                    }
                })
                .catch((body) => res.status(200).send(body));
        });
    });

    app.post(conversationsApi.create.url, (req, res) => {
        requestHandler(req, res, async(request) => {
            createConversation(db, request.data)
                .then((body) => {
                    request.data.members.forEach((login) => {
                        app.socketConnections[login]?.send({
                            type: 'new-conversation',
                            data: body
                        })
                    })
                    res.status(200).send(body)
                })
                .catch((body) => res.status(200).send(body));
        })
    });

    app.post(conversationsApi.delete.url, (req, res) => {
        requestHandler(req, res, async(request) => {
            deleteConversation(db, request.data)
                .then((body) => {
                    body.data.members.forEach(({ login }) => {
                        app.socketConnections[login]?.send({
                            type: 'delete-conversation',
                            data: {
                                id: body.data.id
                            }
                        })
                    })
                    res.status(200).send(body);
                })
                .catch(body => {
                    res.status(200).send(body)
                })
        })
    })
}

exports.setApi = setApi;