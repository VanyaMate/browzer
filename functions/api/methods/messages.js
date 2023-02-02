const getMessagesFromConversation = async function (db, data) {
    console.log(data);
    const messagesAmount = data.limit + data.offset;
    const messagesQuery = db.collection('messages')
        .where('convId', '==', data.conversationId)
        .orderBy('timestamp', 'desc')
        .limit(messagesAmount)
    const messagesQueryResult = await messagesQuery.get();
    let messages = [];

    if (data.offset === undefined) {
        messages = messagesQueryResult.docs.map((result) => result.data()) || []
    } else {
        for (let i = data.offset; i < messagesAmount; i++) {
            const message = messagesQueryResult.docs[i];
            if (message) {
                messages.push(message.data());
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
            messages: messagesQueryResult.docs.map((result) => result.data()) || []
        }
    };
}

exports.methods = {
    getMessagesFromConversation,
    getMessagesFromConversationsAfter
}