import React from 'react';
import LoginForm from "../LoginForm/LoginForm";
import RegistrationForm from "../RegistrationForm/RegistrationForm";
import css from './LoginPage.module.scss';

const LoginPage = () => {
    return (
        <div className={css.loginPage}>
            <LoginForm/>
            <RegistrationForm/>
        </div>
    );
};

export default LoginPage;