const {query} = require("express");
const {queryAllByAttribute} = require("@testing-library/react");
const {getMessagesFromConversation} = require('./messages').methods;
const {getPublicUserDataByLogin} = require('./users').methods;

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

exports.methods = {
    getConversation,
    getConversationsList,
    getConversationMembers,
    validateConversationUserAccess,
    validateConversationsListUserAccess
}