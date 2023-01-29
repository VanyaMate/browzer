const checkLogin = function (login) {
    if (login === undefined || login === null) {
        return false;
    }

    if (login.length < 3 || login.length > 16) {
        return false;
    }

    if (login.match(/[\d\w_]/gi)?.join('') !== login) {
        return false;
    }

    return true;
}

const checkPassword = function (password) {
    if (password === undefined || password === null) {
        return false;
    }

    if (password.length < 8 || password.length > 24) {
        return false;
    }

    if (password.match(/[\d\w_!*+-]/gi)?.join('') !== password) {
        return false;
    }

    return true;
}

const checkEmail = function (email) {
    if (email === undefined || email === null) {
        return false;
    }

    if (email.length > 50 || email.length < 4) {
        return false;
    }

    if (email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)?.join('') !== email) {
        return false;
    }

    return true;
}

const checkName = function (name) {
    if (name === undefined || name === null) {
        return false;
    }

    if (name.length > 24 || name.length < 2) {
        return false;
    }

    if (name.match(/[а-яa-z\s]/gi)?.join('') !== name) {
        return false;
    }

    return true;
}

exports.checker = {
    checkLogin,
    checkName,
    checkPassword,
    checkEmail
}