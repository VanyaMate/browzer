const {getMessagesFromConversation} = require('./messages').methods;

const validateUserAccess = function (db, data) {
    return new Promise(async (resolve, reject) => {
        const userQuery = db.collection('users').doc(data.login);
        const userQueryResult = await userQuery.get();
        const userQueryData = userQueryResult.data();

        if (userQueryData !== undefined) {
            const validSessionId = userQueryData.sessionId === data.sessionId;
            const conversationId = userQueryData.conversations.filter(
                (convId) => convId === data.conversationId
            )?.[0];

            if (validSessionId && conversationId) {
                resolve({
                    error: false,
                    data: conversationId
                });
            } else {
                reject({
                    error: true,
                    data: {
                        message: 'bad data'
                    }
                });
            }
        } else {
            reject({
                error: true,
                data: {
                    message: 'bad login'
                }
            });
        }
    });
}

const getConversation = async function (db, data) {
    console.log(data);
    const convQuery = db.collection('conversations').doc(data.conversationId);
    const convQueryResult = await convQuery.get();
    const convQueryData = convQueryResult.data();
    if (convQueryData !== undefined) {
        const messages = await getMessagesFromConversation(db, data);

        return {
            convQueryData,
            messages: messages.data.messages
        };
    } else {
        return false;
    }
}

exports.methods = {
    getConversation,
    validateUserAccess
}