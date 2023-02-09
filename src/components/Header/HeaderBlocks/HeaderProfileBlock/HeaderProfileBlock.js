import React, {useContext, useState} from 'react';
import {UserData} from "../../../../App";
import {sessionStorageUserData} from "../../../../utils/conts";
import Button from "../../../UI/Button/Button";
import css from './HeaderProfileBlock.module.scss';

const HeaderProfileBlock = () => {
    const userData = useContext(UserData);
    const [validation, setValidation] = useState(true);

    const signOut = function () {
        userData.setUser(null);
        sessionStorage.removeItem(sessionStorageUserData);
    }

    return (
        <div className={css.block}>
            <div className={css.userLogin}>
                {userData.user.userData.login}
            </div>
            <div className={css.userIcon}>
                <img src={userData.user.userData.avatar}/>
            </div>
            <Button validation={validation} onClick={signOut}>Выйти</Button>
        </div>
    );
};

export default HeaderProfileBlock;