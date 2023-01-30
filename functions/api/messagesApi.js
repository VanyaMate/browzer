const { requestHandler } = require('../utils/requestMethods').requestMethods;
const {conversationsApi, loginApi} = require('./api_list').list;
const { collectionGroup, query, where, getDocs } = require("firebase/firestore");

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
                        const messagesQuery = db.collection('messages')
                            .orderBy('timestamp')
                            .limit(request.data.limit || 25)
                        const messagesQueryResult = await messagesQuery.get();
/*
                        const messagesQuery = query(
                            collectionGroup(db, 'messages'),
                            where('convId', '==', 'Vx5gIwKx3csSWjmum7t3')
                        );
                        // // ///
                        const messagesQueryResult = await getDocs(messagesQuery);*/

                        if (convQueryData !== undefined) {
                            res.status(200).send({
                                error: false,
                                data: {
                                    conversation: convQueryData,
                                    messages: messagesQueryResult.docs.map((result) => result.data()) || []
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