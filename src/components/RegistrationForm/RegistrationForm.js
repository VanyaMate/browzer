import React, {useRef} from 'react';
import css from './RegistrationForm.module.scss';
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import {useContext, useEffect, useState} from "react";
import {UserData} from "../../App";
import {checkEmail, checkLogin, checkName, checkPassword} from "../../utils/Checker";
import {serverUrl, sessionStorageUserData} from "../../utils/conts";

const RegistrationForm = () => {
    const userData = useContext(UserData);
    const [login, setLogin] = useState({ value: '', confirmed: false });
    const [password, setPassword] = useState({ value: '', confirmed: false });
    const [similarPassword, setSimilarPassword] = useState({ value: '', confirmed: false });
    const [firstName, setFirstName] = useState({ value: '', confirmed: false });
    const [lastName, setLastName] = useState({ value: '', confirmed: false });
    const [email, setEmail] = useState({ value: '', confirmed: false });
    const [confirmed, setConfirmed] = useState(false);
    const registrationButton = useRef();

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

        setSimilarPassword({
            value: similarPassword.value,
            confirmed: checkPassword(similarPassword.value) && (similarPassword.value === target.value)
        });
    }

    const similarPasswordInputHandler = function ({ target }) {
        setSimilarPassword({
           value: target.value,
           confirmed: checkPassword(target.value) && (target.value === password.value)
        });
    };

    const firstNameInputHandler = function ({ target }) {
        setFirstName({
            value: target.value,
            confirmed: checkName(target.value)
        });
    }

    const lastNameInputHandler = function ({ target }) {
        setLastName({
            value: target.value,
            confirmed: checkName(target.value)
        });
    }

    const emailInputHandler = function ({ target }) {
        setEmail({
            value: target.value,
            confirmed: checkEmail(target.value)
        });
    }

    const registration = function () {
        registrationButton.current.classList.add(css.sending);
        registrationButton.current.textContent = 'Регистрация..';

        const sendData = {
            login: login.value,
            password: password.value,
            email: email.value,
            personalInfo: {
                firstName: firstName.value,
                lastName: lastName.value
            }
        };

        fetch(`${ serverUrl }/api/users/create`, {
            method: 'post',
            body: JSON.stringify(sendData),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            registrationButton.current.classList.remove(css.sending);
            registrationButton.current.textContent = 'Регистрация';

            return response.json();
        }).then(({ data, error }) => {
            if (!error) {
                sessionStorage.setItem(sessionStorageUserData, JSON.stringify(data));
                userData.setUser(data);
            }
        });
    }

    useEffect(() => {
        setConfirmed([login, password, similarPassword, firstName, lastName, email].every((input) => input.confirmed));

        return () => {}
    }, [login, password, similarPassword, firstName, lastName, email])

    return (
        <div className={css.registrationForm}>
            <h2>Регистрация</h2>
            <Input validation={login.confirmed} placeholder={'Логин'} type={'text'} value={login.value} onInput={loginInputHandler}/>
            <Input validation={password.confirmed} placeholder={'Пароль'} type={'password'} value={password.value} onInput={passwordInputHandler}/>
            <Input validation={similarPassword.confirmed} placeholder={'Пароль'} type={'password'} value={similarPassword.value} onInput={similarPasswordInputHandler}/>
            <div className={css.border}></div>
            <Input validation={firstName.confirmed} placeholder={'Имя'} type={'text'} value={firstName.value} onInput={firstNameInputHandler}/>
            <Input validation={lastName.confirmed} placeholder={'Фамилия'} type={'text'} value={lastName.value} onInput={lastNameInputHandler}/>
            <div className={css.border}></div>
            <Input validation={email.confirmed} placeholder={'Почта'} type={'email'} value={email.value} onInput={emailInputHandler}/>
            <div className={css.border}></div>
            <Button reff={registrationButton} validation={confirmed} onClick={registration}>Регистрация</Button>
        </div>
    );
};

export default RegistrationForm;