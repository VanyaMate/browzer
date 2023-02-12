import React, {useContext, useEffect, useState} from 'react';
import Message from "./Message/Message";
import css from './MessagesBlock.module.scss';
import ScrollContainer from "../../UI/ScrollContainer/ScrollContainer";
import ConversationBlock from "./ConversationBlock/ConversationBlock";
import Button from "../../UI/Button/Button";
import {serverUrl} from "../../../utils/conts";
import {UserData} from "../../../App";
import Conversations from "../../../store/Conversations";
import {observer} from "mobx-react-lite";

const MessagesBlock = observer(({ data, activeOption, options: {blockOptions, setBlockOptions} }) => {
    const userData = useContext(UserData);
    const socket = userData.socket;
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [messagesId, setMessagesId] = useState(data.id);
    const [startAddingMessage, setStartAddingMessage] = useState(false);
    const [offset, setOffset] = useState(0);
    const [openedConv, setOpenedConv] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [conversationId, setConversationId] = useState(null);
    const defaultLimit = 25;

    const inputMessage = function ({ target }) {
        setMessage(target.value);
    }

    const sendMessage = function () {
        if (message === '') return;
        const updatedMessageList = [
            {
                timestamp: Date.now(),
                login: userData.user.userData.login,
                text: message
            },
            ...messages
        ];

        fetch(`${serverUrl}/api/messages/addMessage`, {
            method: 'post',
            body: JSON.stringify({
                login: userData.user.userData.login,
                sessionId: userData.user.sessionId,
                conversationId: conversationId,
                text: message
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            console.log(response);
        })

        setMessages(updatedMessageList);
        setMessage('');
    }

    const loadMessages = async function (conversationId, offset, amount) {
        return fetch(`${serverUrl}/api/messages/getFromConversation`, {
            method: 'post',
            body: JSON.stringify({
                login: userData.user.userData.login,
                sessionId: userData.user.sessionId,
                conversationId: conversationId,
                limit: amount,
                offset: offset
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(async (response) => {
            const {data} = await response.json();
            return data.messages;
        })
    }

    const loadConversations = async function () {
        return await fetch(`${serverUrl}/api/conversations/getList`, {
            method: 'post',
            body: JSON.stringify({
                login: userData.user.userData.login,
                sessionId: userData.user.sessionId,
                ids: userData.user.userData.conversations,
                limit: defaultLimit,
                offset: 0
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(async (response) => {
            const {data} = await response.json();
            return data.conversations
                .filter((conv) => conv.messages !== null);
        })
    }

    useEffect(() => {
        if (Conversations.needToGetConversationData) {
            Conversations.loading = true;
            loadConversations().then((conversations) => {
                Conversations.list = conversations.map((item) => { item.messagesLoading = false; return item; });
                Conversations.loaded = true;
                Conversations.loading = false;
            })
        }
    }, []);

    return (
        <div className={[css.messageBlock, activeOption === data ? '' : css.hidden].join(' ')}>
            {
                conversationId && Conversations.list.some((item) => item.id === conversationId)
                    ? <div className={css.messagesSide}>
                    <button
                        className={[css.messageSendButton, message !== '' ? css.active : ''].join(' ')}
                        onClick={sendMessage}
                    >
                        Отправить
                    </button>
                    <Button validation={true} onClick={() => {
                        fetch(`${serverUrl}/api/conversations/delete`, {
                            method: 'post',
                            body: JSON.stringify({
                                conversationId: conversationId
                            }),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then();
                    }}>Удалить</Button>
                    <textarea
                        type={'text'}
                        className={css.messageInput}
                        value={message}
                        onInput={inputMessage}
                        onKeyDown={
                            (event) =>
                                (event.key === 'Enter') && (event.preventDefault() || sendMessage())
                        }
                    />
                    <ScrollContainer
                        className={css.messagesScrollContainer}
                        containerClassName={css.messagesContainer}
                        addingMessage={[startAddingMessage, setStartAddingMessage]}
                        onScroll={(scroll) => {
                            if (scroll <= 300) {
                                const conversation = Conversations.getById(conversationId);
                                if (conversation.messagesLoading) return;
                                conversation.messagesLoading = true;
                                loadMessages(conversationId, (offset + 1) * defaultLimit, defaultLimit).then((updatedMessageList) => {
                                    if (updatedMessageList.length) {
                                        setOffset(offset + 1);
                                        setStartAddingMessage(true);
                                        const conversation = Conversations.getById(conversationId);
                                        if (conversation) {
                                            conversation.messages = [...conversation.messages, ...updatedMessageList];
                                            conversation.messagesLoading = false;
                                        }
                                    } else {
                                        conversation.allLoaded = true;
                                    }
                                })
                            }
                        }}
                    >
                        {
                            (() => {
                                const conversation = Conversations.getById(conversationId);
                                if (conversation && conversation.messages.length) {
                                    return conversation.messages.map((messageData) => {
                                        return <Message
                                            key={messageData.id}
                                            data={messageData}
                                            login={userData.user.userData.login}
                                        />
                                    })
                                } else {
                                    return <div className={css.messagesClearConversation}>
                                        Так пусто...  ┐(‘～` )┌
                                    </div>;
                                }
                            })()
                        }
                        {
                            (() => {
                                const conversation = Conversations.getById(conversationId);
                                let message = '';
                                let showed = false;
                                if (conversation.messagesLoading) {
                                    if (conversation.allLoaded) {
                                        message = 'Больше нет ¯\_(ツ)_/¯';
                                    } else {
                                        message = 'Грузим ‿︵‿ヽ(°□° )ノ︵‿︵';
                                    }

                                    showed = true;
                                }

                                return <div className={[css.messagesEndNotification, showed?css.e_showed:''].join(' ')}>{message}</div>;
                            })()
                        }
                    </ScrollContainer>
                </div>
                    : <div className={css.messagesNoSelected}>
                        Беседа не выбрана ლ(ಠ_ಠ ლ)
                    </div>
            }
            <div className={[css.conversationsSide, openedConv ? css.c_opened : ''].join(' ')}>
                <Button
                    onClick={() => setOpenedConv(!openedConv)}
                    className={css.c_button}
                    validation={true}
                >Open</Button>
                <ConversationBlock
                    conversations={{
                        conversations: Conversations.list,
                        setConversationId,
                        conversationId
                    }}
                    messages={{
                        messages,
                        setMessages,
                        loadMessages
                    }}
                />
            </div>
        </div>
    );
});

export default MessagesBlock;