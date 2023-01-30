const { requestHandler } = require('../utils/requestMethods').requestMethods;
const {messagesApi, loginApi} = require('./api_list').list;
const makeRequest = require('request');

const setApi = function (app, db) {
    app.post(messagesApi.getConversation.url, (req, res) => {
        requestHandler(req, res, async (request) => {
            if (request.error) {
                res.status(200).send({
                    error: true,
                    data: {
                        message: request.message,
                    }
                })
            } else {
                // userLogin
                // sessionId
                // conversationId

                makeRequest(loginApi.id, (error, response, body) => {
                    console.log(response);
                    console.log(body);
                })


                res.status(200).send(true);
            }
        });
    });
}

exports.setApi = setApi;