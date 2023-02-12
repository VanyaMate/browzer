import React from 'react';
import css from './ConversationBlock.module.scss';
import Conversation from "./Conversation/Conversation";
import {observer} from "mobx-react-lite";

const ConversationBlock = observer(({ conversations: {conversations, setConversationId, conversationId}, messages }) => {
    return (
        <div className={css.conversationBlock}>
            {
                conversations.map((conversation, index) => {
                    conversation.top = index * 50;
                    return <Conversation
                        active={conversation.id === conversationId}
                        key={conversation.id}
                        data={conversation}
                        setConversationId={setConversationId}
                        messages={conversation.messages}
                    />;
                })
            }
        </div>
    );
});

export default ConversationBlock;