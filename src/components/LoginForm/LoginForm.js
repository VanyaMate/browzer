import React, {useContext, useEffect, useState} from 'react';
import css from './LoginForm.module.scss';
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import {checkLogin, checkPassword} from "../../utils/Checker";
import {UserData} from "../../App";

const LoginForm = () => {
    const userData = useContext(UserData);
    const [login, setLogin] = useState({ value: '', confirmed: false });
    const [password, setPassword] = useState({ value: '', confirmed: false });
    const [confirmed, setConfirmed] = useState(false);

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
        userData.setUser({login, password});
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
            <Button validation={confirmed} onClick={logIn}>Войти</Button>
        </div>
    );
};

export default LoginForm;