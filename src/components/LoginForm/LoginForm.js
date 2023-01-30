import React, {useContext, useEffect, useRef, useState} from 'react';
import css from './LoginForm.module.scss';
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import {checkLogin, checkPassword} from "../../utils/Checker";
import {UserData} from "../../App";
import {serverUrl, sessionStorageUserData} from "../../utils/conts";

const LoginForm = () => {
    const userData = useContext(UserData);
    const [login, setLogin] = useState({ value: '', confirmed: false });
    const [password, setPassword] = useState({ value: '', confirmed: false });
    const [confirmed, setConfirmed] = useState(false);
    const logInButton = useRef();

    const loginInputHandler = function ({ target }) {
        setLogin({
            value: target.value,
            confirmed: checkLogin(target.value)
        });
    }

    const passwordInputHandler = function ({ target }) {
        setPassword({
            value: target.value,
            confirmed: checkPassword(target.value)
        });
    }

    const logIn = function () {
        logInButton.current.classList.add('sending');

        const sendData = {
            login: login.value,
            password: password.value
        };

        fetch(`${ serverUrl }/api/login/pass`, {
            method: 'post',
            body: JSON.stringify(sendData),
        }).then(async (response) => {
            const body = await response.text();
            const bodyData = JSON.parse(body);

            logInButton.current.classList.remove('sending');

            if (bodyData.error === false) {
                sessionStorage.setItem(sessionStorageUserData, JSON.stringify(bodyData.data));

                userData.setUser(bodyData.data);
                return;
            }

            setLogin({
                value: login.value,
                confirmed: false
            })

            setPassword({
                value: password.value,
                confirmed: false
            })
        });
    }

    useEffect(() => {
        setConfirmed([login, password].every((input) => input.confirmed));

        return () => {}
    }, [login, password])

    return (
        <div className={css.loginForm}>
            <h2>Вход</h2>
            <Input validation={login.confirmed} placeholder={'Логин'} type={'text'} value={login.value} onInput={loginInputHandler}/>
            <Input validation={password.confirmed} placeholder={'Пароль'} type={'password'} value={password.value} onInput={passwordInputHandler}/>
            <div className={css.border}></div>
            <Button reff={logInButton} validation={confirmed} onClick={logIn}>Войти</Button>
        </div>
    );
};

export default LoginForm;