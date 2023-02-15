const {getPublicUserData} = require('../../utils/requestMethods').requestMethods;

const fillFriendsData = function (data) {
    if (!data.friendsOutRequests) {
        data.friendsOutRequests = [];
    }
    if (!data.friendsInRequests) {
        data.friendsInRequests = [];
    }
    if (!data.friends) {
        data.friends = [];
    }
    if (!data.preference) {
        data.preference = { friends: 'all' };
    }
    if (!data.preference.friends) {
        data.preference.friends = 'all';
    }
}

const addFriend = function (db, data) {
    return new Promise(async (resolve, reject) => {
        const {addLogin, user} = data;
        const getOtherUserDataQuery = db.collection('users').doc(addLogin);
        const otherUserData = (await getOtherUserDataQuery.get()).data();

        // TODO: Удалить после обновления БД
        fillFriendsData(otherUserData);
        fillFriendsData(user);

        const publicMe = getPublicUserData(user);
        const publicAdd = getPublicUserData(otherUserData);

        if (otherUserData.friendsOutRequests.some(({login}) => login === user.login)) {
            for (let i = 0; i < otherUserData.friendsOutRequests.length; i++) {
                const {login} = otherUserData.friendsOutRequests[i];
                if (login === user.login) {
                    otherUserData.friendsOutRequests.splice(i, 1);
                    break;
                }
            }
            for (let i = 0; i < user.friendsInRequests.length; i++) {
                const {login} = user.friendsInRequests[i];
                if (login === otherUserData.login) {
                    user.friendsInRequests.splice(i, 1);
                    break;
                }
            }

            user.friends.push(publicAdd);
            otherUserData.friends.push(publicMe);

            return await Promise.all([
                await db.collection('users').doc(user.login).set(user),
                await db.collection('users').doc(otherUserData.login).set(otherUserData)
            ]).then(() => {
                resolve({
                    error: false,
                    data: {
                        type: 'add-to-friends',
                        add: publicAdd,
                        me: publicMe
                    }
                })
            });
        } else if (
            otherUserData.preference.friends === 'all' &&
            !otherUserData.friendsInRequests.some((login) => login === user.login)
        ) {
            otherUserData.friendsInRequests.push(publicMe);
            user.friendsOutRequests.push(publicAdd);

            return await Promise.all([
                await db.collection('users').doc(user.login).set(user),
                await db.collection('users').doc(otherUserData.login).set(otherUserData)
            ]).then(() => {
                resolve({
                    error: false,
                    data: {
                        type: 'add-to-request',
                        add: publicAdd,
                        me: publicMe
                    }
                })
            });
        }

        reject({
            error: true,
            data: {
                message: 'bad request'
            }
        })
    });
}
const removeFriends = function (db, data) {
    return new Promise(async (resolve, reject) => {
        const {removeLogin, user} = data;
        const getOtherUserDataQuery = db.collection('users').doc(removeLogin);
        const otherUserData = (await getOtherUserDataQuery.get()).data();

        // TODO: Удалить после обновления БД
        fillFriendsData(otherUserData);
        fillFriendsData(user);

        const publicMe = getPublicUserData(user);
        const publicRemove = getPublicUserData(otherUserData);

        if (user.friends.some(({login}) => login === otherUserData.login)) {
            const changed = {
                me: false,
                other: false
            };
            for (let i = 0; i < user.friends.length; i++) {
                if (user.friends[i].login === otherUserData.login) {
                    const deleted = user.friends.splice(i, 1);
                    user.friendsInRequests.push(deleted);
                    changed.me = true;
                    break;
                }
            }
            for (let i = 0; i < otherUserData.friends.length; i++) {
                const {login} = otherUserData.friends[i];
                if (login === user.login) {
                    const deleted = otherUserData.friends.splice(i, 1);
                    otherUserData.friendsOutRequests.push(deleted);
                    changed.other = true;
                    break;
                }
            }

            return await Promise.all([
                await db.collection('users').doc(user.login).set(user),
                await db.collection('users').doc(otherUserData.login).set(otherUserData)
            ]).then(() => {
                resolve({
                    error: false,
                    data: {
                        type: 'remove-friend',
                        remove: changed.other ? publicRemove : false,
                        me: changed.me ? publicMe : false
                    }
                })
            });
        }

        if (user.friendsInRequests.some(({login}) => login === otherUserData.login)) {
            const changed = {
                me: false,
                other: false
            };
            for (let i = 0; i < user.friendsInRequests.length; i++) {
                if (user.friendsInRequests[i].login === otherUserData.login) {
                    user.friendsInRequests.splice(i, 1);
                    changed.me = true;
                    break;
                }
            }
            for (let i = 0; i < otherUserData.friendsOutRequests.length; i++) {
                const {login} = otherUserData.friendsOutRequests[i];
                if (login === user.login) {
                    otherUserData.friendsOutRequests.splice(i, 1);
                    changed.other = true;
                    break;
                }
            }

            return await Promise.all([
                await db.collection('users').doc(user.login).set(user),
                await db.collection('users').doc(otherUserData.login).set(otherUserData)
            ]).then(() => {
                resolve({
                    error: false,
                    data: {
                        type: 'remove-in-request',
                        remove: changed.other ? publicRemove : false,
                        me: changed.me ? publicMe : false
                    }
                })
            });
        }

        if (user.friendsOutRequests.some(({login}) => login === otherUserData.login)) {
            const changed = {
                me: false,
                other: false
            };
            for (let i = 0; i < user.friendsOutRequests.length; i++) {
                if (user.friendsOutRequests[i].login === otherUserData.login) {
                    user.friendsOutRequests.splice(i, 1);
                    changed.me = true;
                    break;
                }
            }
            for (let i = 0; i < otherUserData.friendsInRequests.length; i++) {
                const {login} = otherUserData.friendsInRequests[i];
                if (login === user.login) {
                    otherUserData.friendsInRequests.splice(i, 1);
                    changed.other = true;
                    break;
                }
            }

            return await Promise.all([
                await db.collection('users').doc(user.login).set(user),
                await db.collection('users').doc(otherUserData.login).set(otherUserData)
            ]).then(() => {
                resolve({
                    error: false,
                    data: {
                        type: 'remove-out-request',
                        remove: changed.other ? publicRemove : false,
                        me: changed.me ? publicMe : false
                    }
                })
            });
        }

        reject({
            error: true,
            data: {
                message: 'bad request'
            }
        })
    });
}

exports.methods = {
    addFriend,
    removeFriends
}