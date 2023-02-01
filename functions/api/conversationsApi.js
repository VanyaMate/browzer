const { requestHandler } = require('../utils/requestMethods').requestMethods;
const {conversationsApi, loginApi} = require('./api_list').list;
const {getConversation, validateUserAccess} = require('./methods/conversations').methods;


const setApi = function (app, db) {
    app.post(conversationsApi.get.url, (req, res) => {
        requestHandler(req, res, async (request) => {
            validateUserAccess(db, request.data)
                .then(async ({ data: id }) => {
                    const conversation = await getConversation(db, request.data);

                    if (conversation) {
                        res.status(200).send({
                            error: false,
                            data: {
                                conversation: conversation.convQueryData,
                                messages: conversation.messages
                            }
                        });
                    } else {
                        res.status(200).send({
                            error: true,
                            data: {
                                message: 'bad id'
                            }
                        })
                    }
                })
                .catch((body) => res.status(200).send(body));
        });
    });
}

exports.setApi = setApi;