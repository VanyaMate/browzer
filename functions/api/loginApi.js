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
    app.post('/api/login', (req, res) => {
        (async () => {
            try {
                if (validateData(req.body).error) {
                    res.status(400).send({message: 'bad login/password'});
                    return false;
                }

                const doc = db.collection('users').doc(req.body.login);
                const user = await doc.get();
                const userData = user.data();

                if (userData === undefined) {
                    res.status(400).send({message: 'bad login/password'});
                    return false;
                }

                await bcrypt.compare(req.body.password, userData.password, (err, result) => {
                    if (result) {
                        res.status(200).send(userData.sessionId);
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
    app.get('/api/login', (req, res) => {
        (async () => {
            try {
                if (checker.checkLogin(req.body.login)) {
                    const doc = db.collection('users').doc(req.body.login);
                    const user = await doc.get();
                    const userData = user.data();

                    if (userData.sessionId === req.body.sessionId) {
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