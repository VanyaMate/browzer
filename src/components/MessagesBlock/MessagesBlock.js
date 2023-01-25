import React, {useEffect, useState} from 'react';
import Message from "./Message/Message";
import KeyGen from "../KeyGen";
import css from './MessagesBlock.module.scss';
import Filler from "../Filler";
import ScrollContainer from "../UI/ScrollContainer/ScrollContainer";

const MessagesBlock = (props) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState(
        Filler.getRandomMessages(
            Filler.worldList,
            Filler.getRandomValue(0, 15),
            [1, 25]
        )
    );
    const [messagesId, setMessagesId] = useState(props.data.id);
    const [startAddingMesssage, setStartAddingMesssage] = useState(false);
    const [offset, setOffset] = useState(0);

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

    useEffect(() => {
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
    }, [messages]);

    return (
        <div className={css.messageBlock}>
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
                    messages.map((messageData) => <Message key={KeyGen.getId()} data={messageData}/>)
                }
                <h1>Load...</h1>
            </ScrollContainer>
        </div>
    );
};

export default MessagesBlock;