const getMessagesFromConversation = async function (db, conversationId, messagesAmount, offset) {
    const messagesQuery = db.collection('messages')
        .where('convId', '==', conversationId)
        .orderBy('timestamp', 'desc')
        .limit(messagesAmount)
    const messagesQueryResult = await messagesQuery.get();
    let messages = [];

    if (offset === undefined) {
        messages = messagesQueryResult.docs.map((result) => result.data()) || []
    } else {
        for (let i = offset; i < messagesAmount; i++) {
            const message = messagesQueryResult.docs[i];
            if (message) {
                messages.push(message.data());
            }
        }
    }
    return messages;
}

exports.messages = {
    getMessagesFromConversation
}