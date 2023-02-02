import React, {useContext, useEffect, useState} from 'react';
import Message from "./Message/Message";
import KeyGen from "../KeyGen";
import css from './MessagesBlock.module.scss';
import Filler from "../Filler";
import ScrollContainer from "../UI/ScrollContainer/ScrollContainer";
import ConversationBlock from "./ConversationBlock/ConversationBlock";
import Button from "../UI/Button/Button";
import {serverUrl} from "../../utils/conts";
import {UserData} from "../../App";

const MessagesBlock = ({ data, activeOption }) => {
    const userData = useContext(UserData);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState(
        Filler.getRandomMessages(
            Filler.worldList,
            Filler.getRandomValue(0, 15),
            [1, 25]
        )
    );
    const [messagesId, setMessagesId] = useState(data.id);
    const [startAddingMesssage, setStartAddingMesssage] = useState(false);
    const [offset, setOffset] = useState(0);
    const [openedConv, setOpenedConv] = useState(false);
    const [conversations, setConversations] = useState([]);

    const inputMessage = function ({ target }) {
        setMessage(target.value);
    }

    const sendMessage = function () {
        if (message === '') return;
        const updatedMessageList = [
            {
                date: Date.now(),
                user: 0,
                message: message
            },
            ...messages
        ];

        setMessages(updatedMessageList);
        setMessage('');
    }

    const loadMessages = function (offset, amount) {
        return new Promise((resolve, reject) => {
            const updatedMessageList = [
                ...messages,
                ...Filler.getRandomMessages(
                    Filler.worldList,
                    amount,
                    [1, 25]
                )
            ];

            setTimeout(() => {
                resolve(updatedMessageList);
            }, 1000);
        });
    }

    const openConversations = function () {

    }

    // Fake messaging
/*    useEffect(() => {
        const messageUpdater = setInterval(() => {
            setMessages([...messages]);
        }, 1000);

        const messageAdder = setTimeout(() => {
            const updatedMessageList = [
                ...Filler.getRandomMessages(
                    Filler.worldList,
                    1,
                    [1, 25]
                ),
                ...messages
            ];

            setMessages(updatedMessageList);
        }, Filler.getRandomValue(500, 3500));

        return () => {
            clearInterval(messageUpdater);
            clearTimeout(messageAdder);
        };
    }, [messages]);*/

    let loadingConversations = false;
    useEffect(() => {
        if (!loadingConversations) {
            loadingConversations = true;
            fetch(`${serverUrl}/api/conversations/getList`, {
                method: 'post',
                body: JSON.stringify({
                    login: userData.user.userData.login,
                    sessionId: userData.user.sessionId,
                    ids: userData.user.userData.conversations,
                    limit: 1,
                    offset: 0
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(async (response) => {
                const {data} = await response.json();
                const successConversations = data.conversations
                    .filter((conv) => conv.messages !== null)

                setConversations(successConversations);
            })
        }
    }, []);

    return (
        <div className={[css.messageBlock, activeOption === data ? '' : css.hidden].join(' ')}>
            <div className={css.messagesSide}>
                <button className={[css.messageSendButton, message !== '' ? css.active : ''].join(' ')} onClick={sendMessage}>Отправить</button>
                <textarea
                    type={'text'}
                    className={css.messageInput}
                    value={message}
                    onInput={inputMessage}
                    onKeyDown={
                        (event) =>
                            event.key === 'Enter' && (event.preventDefault() || sendMessage())
                    }
                />
                <ScrollContainer
                    className={css.messagesScrollContainer}
                    containerClassName={css.messagesContainer}
                    addingMessage={[startAddingMesssage, setStartAddingMesssage]}
                    onScroll={(scroll) => {
                        if (scroll <= 1) {
                            loadMessages(offset, 20).then((updatedMessageList) => {
                                setOffset(offset + 1);
                                setStartAddingMesssage(true);
                                setMessages(updatedMessageList);
                            })
                        }
                    }}
                >
                    {
                        messages.map((messageData) => <Message key={`${messageData.user + messageData.date}`} data={messageData}/>)
                    }
                    <h1>Load...</h1>
                </ScrollContainer>
            </div>
            <div className={[css.conversationsSide, openedConv ? css.c_opened : ''].join(' ')}>
                <Button
                    onClick={() => {
                        setOpenedConv(!openedConv);
                    }}
                    validation={true}
                >Open</Button>
                <ConversationBlock conversations={conversations}/>
            </div>
        </div>
    );
};

export default MessagesBlock;