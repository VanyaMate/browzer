import React, {useState} from 'react';
import css from './ProfileFriends.module.scss';
import Button from "../../../../UI/Button/Button";
import FriendsList from "./FriendsList/FriendsList";
import {serverUrl} from "../../../../../utils/conts";

const ProfileFriends = (props) => {
    const [open, setOpen] = useState(false);

    return (
        <div className={css.container}>
            <Button
                validation={true}
                onClick={() => setOpen(!open)}
                className={[css.openButton, open?css.opened:''].join(' ')}
            >
                <img className={css.icon} src={`${serverUrl}/icons/friend.png`} alt=""/>
            </Button>
            <FriendsList open={open}/>
        </div>
    );
};

export default ProfileFriends;