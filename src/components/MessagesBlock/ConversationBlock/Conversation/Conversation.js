import React, {useContext} from 'react';
import css from './Conversation.module.scss';
import {UserData} from "../../../../App";

const Conversation = ({ data: {data} }) => {
    const userData = useContext(UserData);
    const conversationName = data.conversation.type === 'group'
        ? data.conversation.name
        : data.conversation.members.filter(member => {
            return member.login !== userData.user.userData.login;
        })[0].login;

    return (
        <div className={css.conversationItem} style={{top: data.top}}>
            <div className={css.info}>
                <div className={css.login}>
                    {conversationName}
                </div>
                <div className={css.lastMessage}>
                    {data.messages[0]?.text || ''}
                </div>
            </div>
            <div className={css.avatar}>
                <img className={css.image} src={data.avatar}/>
            </div>
        </div>
    );
};

export default Conversation;