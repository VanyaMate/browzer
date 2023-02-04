import React from 'react';
import css from './ConversationBlock.module.scss';
import Conversation from "./Conversation/Conversation";
import KeyGen from "../../KeyGen";

const ConversationBlock = ({ conversations, messages }) => {
    return (
        <div className={css.conversationBlock}>
            {
                conversations.map((conversation, index) => {
                    conversation.top = index * 50;
                    return <Conversation key={KeyGen.getId()} data={conversation} messages={messages}/>;
                })
            }
        </div>
    );
};

export default ConversationBlock;