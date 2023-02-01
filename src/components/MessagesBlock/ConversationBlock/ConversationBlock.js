import React from 'react';
import css from './ConversationBlock.module.scss';
import Conversation from "./Conversation/Conversation";
import KeyGen from "../../KeyGen";

const ConversationBlock = ({ conversations }) => {
    return (
        <div className={css.conversationBlock}>
            {
                conversations
                    .filter(conv => !conv.error)
                    .map((conversation, index) => {
                        conversation.top = index * 50;
                        return <Conversation key={KeyGen.getId()} data={conversation}/>;
                    })
            }
        </div>
    );
};

export default ConversationBlock;