import React, {useContext} from 'react';
import css from './Conversation.module.scss';
import {UserData} from "../../../../App";

const Conversation = ({ data, messages }) => {
    const userData = useContext(UserData);

    const conversationData = data.info.type === 'group'
        ? {login: data.info.name, avatar: data.info.avatar}
        : data.info.members.filter(({ userData: memberData }) => {
            return memberData.login !== userData.user.userData.login;
        })[0].userData;

    return (
        <div
            className={css.conversationItem}
            style={{top: data.top}}
            onClick={() => {
                messages.loadMessages(data.id, 0, 25).then((loadedMessages) => {
                    messages.setMessages(loadedMessages);
                });
            }}
        >
            <div className={css.info}>
                <div className={css.login}>
                    {conversationData.login}
                </div>
                <div className={css.lastMessage}>
                    {data.messages[0]?.text || ''}
                </div>
            </div>
            <div className={css.avatar}>
                <img className={css.image} src={conversationData.avatar}/>
            </div>
        </div>
    );
};

export default Conversation;