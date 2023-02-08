import React from 'react';
import LoginForm from "../LoginForm/LoginForm";
import RegistrationForm from "../RegistrationForm/RegistrationForm";
import css from './LoginPage.module.scss';

const LoginPage = ({ socket }) => {
    return (
        <div className={css.loginPage}>
            <LoginForm socket={socket}/>
            <RegistrationForm socket={socket}/>
        </div>
    );
};

export default LoginPage;