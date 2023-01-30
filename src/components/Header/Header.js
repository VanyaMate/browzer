import React, {useContext, useState} from 'react';
import css from './Header.module.scss';
import {UserData} from "../../App";
import Button from "../UI/Button/Button";
import {sessionStorageUserData} from "../../utils/conts";

const Header = () => {
    const userData = useContext(UserData);
    const [validation, setValidation] = useState(true);

    const signOut = function () {
        userData.setUser(null);
        sessionStorage.removeItem(sessionStorageUserData);
    }

    return (
        <div className={css.header}>
            {userData.user.userData.login}
            <Button validation={validation} onClick={signOut}>Выйти</Button>
        </div>
    );
};

export default Header;