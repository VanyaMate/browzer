const bcrypt = require("bcrypt");
const {checker} = require("../utils/checker");
const setApi = function (app, db) {

    const validateData = function (data) {
        if (!checker.checkLogin(data.login)) {
            return {error: true, code: 400, message: 'bad login'};
        }

        if (!checker.checkPassword(data.password)) {
            return {error: true, code: 400, message: 'bad password'};
        }

        return {error: false, code: 200};
    }

    // Проверить логин/пароль пользователя и получить sessionId
    app.post('/api/login/pass', (req, res) => {
        (async () => {
            try {
                const data = typeof req.body === 'string' ? JSON.parse(req.body || "{}") : req.body;

                if (validateData(data).error) {
                    res.status(400).send({message: 'bad login/password'});
                    return false;
                }

                const doc = db.collection('users').doc(data.login);
                const user = await doc.get();
                const userData = user.data();

                if (userData === undefined) {
                    res.status(400).send({message: 'bad login/password'});
                    return false;
                }

                await bcrypt.compare(data.password, userData.password, (err, result) => {
                    if (result) {
                        res.status(200).send({sessionId: userData.sessionId, success: true});
                    } else {
                        res.status(400).send({message: 'bad login/password'});
                    }
                })
            } catch (error) {
                console.log(error);
                res.status(500).send(error);
            }
        })();
    })

    // Проверить актуальность логин/sessionId пользователя
    app.post('/api/login/id', (req, res) => {
        (async () => {
            try {
                const data = typeof req.body === 'string' ? JSON.parse(req.body || "{}") : req.body;

                if (checker.checkLogin(data.login)) {
                    const doc = db.collection('users').doc(data.login);
                    const user = await doc.get();
                    const userData = user.data();

                    if (userData.sessionId === data.sessionId) {
                        res.status(200).send({success: true});
                        return false;
                    } else {
                        res.status(400).send({message: 'bad login/sessionId'});
                        return false;
                    }
                }

                res.status(400).send({message: 'bad login/sessionId'});
                return false;
            } catch (error) {
                console.log(error);
                res.status(500).send(error);
            }
        })();
    })
}

exports.setApi = setApi;