import React, {useContext, useState} from 'react';
import css from './Header.module.scss';
import {UserData} from "../../App";
import Button from "../UI/Button/Button";
import {sessionStorageLogin, sessionStorageSessionId} from "../../utils/conts";

const Header = () => {
    const userData = useContext(UserData);
    const [validation, setValidation] = useState(true);

    const signOut = function () {
        userData.setUser(null);
        sessionStorage.removeItem(sessionStorageLogin);
        sessionStorage.removeItem(sessionStorageSessionId);
    }

    return (
        <div className={css.header}>
            {userData.user.login.value}
            <Button validation={validation} onClick={signOut}>Выйти</Button>
        </div>
    );
};

export default Header;