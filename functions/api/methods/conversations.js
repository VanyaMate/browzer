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
const validateMembersToAdd = function (db, data) {
    return new Promise((resolve, reject) =>
        Promise.all(data.members.map((login) =>
            new Promise(async (resolve, reject) => {
                await getPublicUserDataByLogin(db, {login})
                    .then((body) => {
                        if (body.data.preference.conversations === 'all') {
                            resolve();
                        } else if (body.data.preference.conversations === 'friends') {
                            if (body.data.friends.some((login) => login === data.login)) {
                                resolve();
                            } else {
                                reject();
                            }
                        } else {
                            // TODO: Change to reject after reset DB
                            resolve();
                        }
                    })
                    .catch(reject);
        }))).then(resolve).catch(reject)
    );
}
const validateConversationData = function (db, data) {
    return Promise.all([
        validateMembersToAdd(db, data)
    ])
}
const getConversationPreferenceByType = function (data) {
    switch (data.type) {
        case 'single':
            return {
                members: [...data.members, data.login].map((login) => ({login})),
                type: 'single',
                creationTime: Date.now()
            }
            break;
        case 'group':
            return {
                members: [
                    ...data.members.map((login) => {
                        return {
                            login,
                            role: 'user',
                            addTime: Date.now()
                        }
                    }),
                    {
                        login: data.login,
                        role: 'admin',
                        addTime: Date.now()
                    }
                ],
                type: 'group',
                icon: 'https://www.zmoji.me/wp-content/uploads/2019/11/sige--1024x988.jpg',
                name: 'Conversation Name ' + Math.random().toFixed(1),
                creationTime: Date.now()
            }
            break;
        default:
            return false;
    }
}

const createConversation = function (db, data) {
    return new Promise(async (resolve, reject) => {
        validateConversationData(db, data)
            .then(async () => {
                const conversationPref = getConversationPreferenceByType(data);
                const conversation = await db.collection('conversations').add(conversationPref);
                const members = await Promise.all(conversationPref.members.map(async ({login}) => {
                    const query = await db.collection('users').doc(login).get();
                    const userData = query.data();
                    if (userData.conversations) {
                        userData.conversations.push(conversation.id);
                    } else {
                        userData.conversations = [conversation.id];
                    }
                    await db.collection('users').doc(login).set(userData);
                    return {userData: getPublicUserData(userData)};
                }));

                conversationPref.members = members;

                if (conversation) {
                    resolve({
                        error: false,
                        data: {
                            id: conversation.id,
                            info: conversationPref,
                            messages: []
                        }
                    })
                } else {
                    reject({
                        error: true,
                        data: error
                    })
                }
            })
            .catch(() => {
                reject({
                    error: true,
                    data: {
                        message: 'bad request'
                    }
                })
            })
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