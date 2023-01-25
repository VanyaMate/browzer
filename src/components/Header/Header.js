import React, {useContext} from 'react';
import css from './Header.module.scss';
import {UserData} from "../../App";

const Header = () => {
    const userData = useContext(UserData);

    return (
        <div className={css.header}>
            {userData.user.login.value}
        </div>
    );
};

export default Header;