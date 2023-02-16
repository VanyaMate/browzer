import React, {useContext} from 'react';
import css from './FriendsList.module.scss';
import Title from "../../../HeaderSearchBlock/searchComponents/UI/Title/Title";
import FriendsBlock from "./FriendsBlock/FriendsBlock";
import Friends from "../../../../../../store/Friends";
import {observer} from "mobx-react-lite";

const FriendsList = observer(({ open }) => {
    console.log(JSON.parse(JSON.stringify(Friends)))
    return (
        <div className={[css.container, open?css.opened:''].join(' ')}>
            <Title>Друзья</Title>
            <FriendsBlock list={Friends.list}/>
            <Title>Полученные заявки</Title>
            <FriendsBlock list={Friends.inList} add={true}/>
            <Title>Отправленные заявки</Title>
            <FriendsBlock list={Friends.outList}/>
        </div>
    );
});

export default FriendsList;