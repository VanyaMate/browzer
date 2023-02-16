import React, {useState} from 'react';
import css from './ProfileFriends.module.scss';
import Button from "../../../../UI/Button/Button";
import FriendsList from "./FriendsList/FriendsList";

const ProfileFriends = (props) => {
    const [open, setOpen] = useState(false);

    return (
        <div className={css.container}>
            <Button
                validation={true}
                onClick={() => setOpen(!open)}
                className={css.openButton}
            >Друзья</Button>
            <FriendsList open={open}/>
        </div>
    );
};

export default ProfileFriends;