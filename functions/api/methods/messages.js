const getMessagesFromConversation = async function (db, data) {
    const messagesAmount = data.limit + data.offset;
    const messagesQuery = db.collection('messages')
        .where('convId', '==', data.conversationId)
        .orderBy('timestamp', 'desc')
        .limit(messagesAmount)
    const messagesQueryResult = await messagesQuery.get();
    let messages = [];

    if (data.offset === undefined) {
        messages = messagesQueryResult.docs.map((result) => {
            return {...result.data(), id: result.id};
        }) || []
    } else {
        for (let i = data.offset; i < messagesAmount; i++) {
            const message = messagesQueryResult.docs[i];
            if (message) {
                messages.push({...message.data(), id: message.id});
            }
        }
    }
    return {
        error: false,
        data: {
            messages: messages
        }
    };
}

const getMessagesFromConversationsAfter = async function (db, data) {
    const messagesQuery = db.collection('messages')
        .where('convId', '==', data.conversationId)
        .orderBy('timestamp', 'desc')
        .startAfter(data.lastMessage)
        .limit(data.messagesAmount)
    const messagesQueryResult = await messagesQuery.get();
    return {
        error: false,
        data: {
            messages: messagesQueryResult.docs.map((result) => {
                return {
                    ...result.data(),
                    id: result.id
                }
            }) || []
        }
    };
}

const addMessageTo = async function (db, data) {
    const messageData = {
        login: data.login,
        changed: false,
        convId: data.conversationId,
        timestamp: Date.now(),
        text: data.text
    };

    return await db.collection('messages').add(messageData).then((response) => {
        return {
            error: false,
            data: {
                message: {...messageData, id: response.id}
            }
        }
    }).catch(() => {
        return {
            error: true,
            data: {
                messages: 'bad request'
            }
        }
    });
}

exports.methods = {
    getMessagesFromConversation,
    getMessagesFromConversationsAfter,
    addMessageTo
}