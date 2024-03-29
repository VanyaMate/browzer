const usersApi = {
    create: {
        url: '/api/users/create',
        type: 'post',
        description: '',
        params: {
            login: {
                type: 'string',
                pattern: '',
            },
            password: {
                type: 'string',
                pattern: '',
            },
            personalInfo: {
                type: 'object',
                sub: {
                    firstName: {
                        type: 'string',
                        pattern: '',
                    },
                    lastName: {
                        type: 'string',
                        pattern: '',
                    },
                }
            },
            email: {
                type: 'string',
                pattern: '',
            },
        },
        ret: {
            type: 'privateUserData'
        }
    },
    getUserByLogin: {
        url: '/api/users/getUserByLogin',
        params: {},
        ret: {}
    },
    getListByLogin: {
        url: '/api/users/getListByLogin',
        params: {},
        ret: {}
    },
    change: {
        url: '/api/users/change',
        params: {},
        ret: {}
    },
    delete: {
        url: '/api/users/delete',
        params: {},
        ret: {}
    }
};

const loginApi = {
    pass: {
        url: '/api/login/pass',
        params: {},
        ret: {}
    },
    id: {
        url: '/api/login/id',
        params: {},
        ret: {}
    },
};

const conversationsApi = {
    get: {
        url: '/api/conversations/get',
        params: {},
        ret: {}
    },
    getList: {
        url: '/api/conversations/getList',
        params: {},
        ret: {}
    },
    create: {
        url: '/api/conversations/create',
        params: {},
        ret: {}
    },
    change: {
        url: '/api/conversations/change',
        params: {},
        ret: {}
    },
    delete: {
        url: '/api/conversations/delete',
        params: {},
        ret: {}
    }
};

const messagesApi = {
    getFromConversation: {
        url: '/api/messages/getFromConversation',
        params: {},
        ret: {}
    },
    addMessage: {
        url: '/api/messages/addMessage',
        params: {},
        ret: {}
    }
}

const friendsApi = {
    add: {
        url: '/api/friends/add',
        params: {},
        ret: {}
    },
    remove: {
        url: '/api/friends/remove',
        params: {},
        ret: {}
    }
}

exports.list = {
    usersApi,
    loginApi,
    conversationsApi,
    messagesApi,
    friendsApi
}