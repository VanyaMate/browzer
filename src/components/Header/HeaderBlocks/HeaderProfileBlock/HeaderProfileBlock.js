import React, {useContext, useState} from 'react';
import {UserData} from "../../../../App";
import {serverUrl, sessionStorageUserData} from "../../../../utils/conts";
import Button from "../../../UI/Button/Button";
import css from './HeaderProfileBlock.module.scss';
import ProfileFriends from "./ProfileFriends/ProfileFriends";

const HeaderProfileBlock = () => {
    const userData = useContext(UserData);
    const [validation, setValidation] = useState(true);

    const signOut = function () {
        userData.setUser(null);
        sessionStorage.removeItem(sessionStorageUserData);
        clearInterval(window.socketPingInterval);
    }

    return (
        <div className={css.block}>
            <div className={css.menu}>
                <ProfileFriends/>
                <ProfileFriends/>
                <ProfileFriends/>
            </div>
            <div className={css.profile}>
                <div className={css.userLogin}>
                    {userData.user.userData.login}
                </div>
                <div className={css.userIcon}>
                    <img src={userData.user.userData.avatar}/>
                </div>
                <Button className={css.exitButton} validation={validation} onClick={signOut}>
                    <img className={css.icon} src={`${serverUrl}/icons/exit.png`} alt=""/>
                </Button>
            </div>
        </div>
    );
};

export default HeaderProfileBlock;