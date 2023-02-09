import React, {useEffect} from 'react';
import css from './Message.module.scss';

const Message = ({ data, login }) => {
    const secondsByTimestamp = (timestamp) => Math.ceil((Date.now() - timestamp) / 1000)
    return (
        <div className={[css.messageItem, data.login === login ? css.my : ''].join(' ')}>
            <div className={css.date}>
                {data.login} [ { secondsByTimestamp(data.timestamp) } секунд назад ]
            </div>
            <div className={css.text}>
                { data.text }
            </div>
        </div>
    );
};

export default Message;