const {query} = require("express");
const {queryAllByAttribute} = require("@testing-library/react");
const {getMessagesFromConversation} = require('./messages').methods;
const {getPublicUserDataByLogin, getPublicUserData} = require('./users').methods;

const validateConversationUserAccess = function (db, data) {
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
                return;
            }
        }

        reject({
            error: true,
            data: {
                message: 'bad request'
            }
        });
    });
}
const validateConversationsListUserAccess = function (db, data) {
    return new Promise(async (resolve, reject) => {
        const userQuery = db.collection('users').doc(data.login);
        const userQueryResult = await userQuery.get();
        const userQueryData = userQueryResult.data();

        if (userQueryData !== undefined) {
            const validSessionId = userQueryData.sessionId === data.sessionId;
            const conversationIds = data.ids.filter(
                (id) => userQueryData.conversations.some((convId) => convId === id)
            );

            if (validSessionId && conversationIds) {
                resolve({
                    error: false,
                    data: conversationIds
                });
                return;
            }
        }

        reject({
            error: true,
            data: {
                message: 'bad request'
            }
        });
    });
}
const validateConversationData = function (db, data) {

}

const createConversation = function (db, data) {
    // TODO: Не безопасно
    return new Promise(async (resolve, reject) => {
        const conversation = await db.collection('conversations').add({
            members: data.members.map((login) => { return {login}}),
            type: 'single',
            creationTime: Date.now()
        });

        const members = await Promise.all(data.members.map(async (login) => {
            const query = await db.collection('users').doc(login).get();
            const userData = query.data();
            if (userData.conversations) {
                userData.conversations.push(conversation.id);
            } else {
                userData.conversations = [conversation.id];
            }
            await db.collection('users').doc(login).set(userData);
            return {userData: getPublicUserData(userData), info: data.members};
        }));

        if (conversation) {
            resolve({
                error: false,
                data: {
                    id: conversation.id,
                    info: {
                        members,
                        type: 'single'
                    },
                    messages: []
                }
            })
        } else {
            reject({
                error: true,
                data: error
            })
        }
    });
}
const getConversationMembers = async function (db, data) {
    const convQuery = db.collection('conversations').doc(data.conversationId);
    const convQueryResult = await convQuery.get();
    const convQueryData = convQueryResult.data();

    if (convQueryData !== undefined) {
        return convQueryData.members;
    } else {
        return false;
    }
}
const getConversation = async function (db, data) {
    const convQuery = db.collection('conversations').doc(data.conversationId);
    const convQueryResult = await convQuery.get();
    const convQueryData = convQueryResult.data();
    if (convQueryData !== undefined) {
        const messages = await getMessagesFromConversation(db, data);
        const members = await Promise.all(convQueryData.members.map(async (member) => {
            return {userData: (await getPublicUserDataByLogin(db, { login: member.login })).data, info: member};
        }));

        return {
            info: {...convQueryData, members},
            messages: messages.data.messages,
            id: data.conversationId
        };
    } else {
        return false;
    }
}
const getConversationsList = async function (db, data) {
    const queriesData = {};

    data.ids.forEach((id) => {
        queriesData[id] = {info: null, messages: null};
    });

    return await Promise.all(data.ids.map(async (id) => {
        queriesData[id].info = (await db.collection('conversations').doc(id).get()).data();
        if (queriesData[id].info) {
            queriesData[id].messages = await getMessagesFromConversation(db, {
                conversationId: id,
                limit: data.limit,
                offset: 0
            });

            const members = await Promise.all(queriesData[id].info.members.map(async (member) => {
                return {userData: (await getPublicUserDataByLogin(db, { login: member.login })).data, info: member};
            }));

            queriesData[id].info.members = members;

            if (!queriesData[id].messages.error) {
                queriesData[id].messages = queriesData[id].messages.data.messages;
                queriesData[id].id = id;
            }
        }
        return true;
    })).then(() => {
        let conversations = [];
        for (const id in queriesData) {
            conversations.push(queriesData[id]);
        }
        return conversations;
    });
}
const deleteConversation = async function (db, data) {
    const query = db.collection('conversations').doc(data.conversationId);
    const conversation = (await query.get()).data();
    const members = conversation.members;
    const deleted = await query.delete();

    const userChanges = await Promise.all(members.map(async ({login}) => {
        const query = await db.collection('users').doc(login).get();
        const userData = query.data();
        if (userData.conversations) {
            userData.conversations = userData.conversations.filter(
                (conversationId) => conversationId !== data.conversationId
            );
        }
        return await db.collection('users').doc(login).set(userData);
    }));

    return {
        error: false,
        data: {
            message: 'deleted',
            members: members,
            id: data.conversationId
        }
    }
}

exports.methods = {
    getConversation,
    getConversationsList,
    getConversationMembers,
    createConversation,
    deleteConversation,
    validateConversationUserAccess,
    validateConversationsListUserAccess
}