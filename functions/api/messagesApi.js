const { requestHandler } = require('../utils/requestMethods').requestMethods;
const {conversationsApi, loginApi} = require('./api_list').list;

const setApi = function (app, db) {
    app.post(conversationsApi.get.url, (req, res) => {
        requestHandler(req, res, async (request) => {
            if (request.error) {
                res.status(200).send({
                    error: true,
                    data: {
                        message: request.message,
                    }
                })
            } else {
                const userQuery = db.collection('users').doc(request.data.login);
                const userQueryResult = await userQuery.get();
                const userQueryData = userQueryResult.data();

                if (userQueryData !== undefined) {
                    const validSessionId = userQueryData.sessionId === request.data.sessionId;
                    const conversation = userQueryData.conversations.filter(
                        (convId) => convId === request.data.conversationId
                    )?.[0];

                    if (validSessionId && conversation) {
                        const convQuery = db.collection('conversations').doc(conversation);
                        const convQueryResult = await convQuery.get();
                        const convQueryData = convQueryResult.data();
                        if (convQueryData !== undefined) {
                            const getMessagesAmount = request.data.limit + request.data.offset;
                            const messagesQuery = db.collection('messages')
                                .where('convId', '==', 'Vx5gIwKx3csSWjmum7t3')
                                .orderBy('timestamp', 'desc')
                                .limit(getMessagesAmount)
                            const messagesQueryResult = await messagesQuery.get();
                            let messages = [];

                            if (request.data.offset === undefined) {
                                messages = messagesQueryResult.docs.map((result) => result.data()) || []
                            } else {
                                for (let i = request.data.offset; i < getMessagesAmount; i++) {
                                    const message = messagesQueryResult.docs[i];
                                    if (message) {
                                        messages.push(message.data());
                                    }
                                }
                            }

                            res.status(200).send({
                                error: false,
                                data: {
                                    conversation: convQueryData,
                                    messages: messages
                                }
                            });
                            return;
                        } else {
                            res.status(200).send({
                                error: true,
                                data: {
                                    message: 'no conversation'
                                }
                            });
                            return;
                        }
                    }
                }

                res.status(200).send({
                    error: true,
                    data: {
                        message: 'bad request'
                    }
                });
            }
        });
    });
}

exports.setApi = setApi;