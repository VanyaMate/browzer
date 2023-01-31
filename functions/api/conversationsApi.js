const { requestHandler } = require('../utils/requestMethods').requestMethods;
const {conversationsApi, loginApi} = require('./api_list').list;
const {getMessagesFromConversation} = require('./methods/messages').messages;

const getConversation = async function (db, conversationId, messagesLimit, offset) {
    const convQuery = db.collection('conversations').doc(conversationId);
    const convQueryResult = await convQuery.get();
    const convQueryData = convQueryResult.data();
    if (convQueryData !== undefined) {
        const messagesAmount = messagesLimit + offset;
        const messages = await getMessagesFromConversation(
            db,
            conversationId,
            messagesAmount,
            offset
        );

        return {
            convQueryData,
            messages
        };
    } else {
        return false;
    }
}

const setApi = function (app, db) {
    app.post(conversationsApi.get.url, (req, res) => {
        requestHandler(req, res, async (request) => {
            const userQuery = db.collection('users').doc(request.data.login);
            const userQueryResult = await userQuery.get();
            const userQueryData = userQueryResult.data();

            if (userQueryData !== undefined) {
                const validSessionId = userQueryData.sessionId === request.data.sessionId;
                const conversationId = userQueryData.conversations.filter(
                    (convId) => convId === request.data.conversationId
                )?.[0];

                if (validSessionId && conversationId) {
                    const conversation = await getConversation(
                        db,
                        request.data.conversationId,
                        request.data.limit,
                        request.data.offset
                    );

                    if (conversation) {
                        res.status(200).send({
                            error: false,
                            data: {
                                conversation: conversation.convQueryData,
                                messages: conversation.messages
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
        });
    });
}

exports.setApi = setApi;