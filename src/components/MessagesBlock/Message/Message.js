import React, {useEffect} from 'react';
import css from './Message.module.scss';

const Message = ({ data, login }) => {
    return (
        <div className={[css.messageItem, data.login === login ? css.my : ''].join(' ')}>
            <div className={css.date}>
                {data.login} [ { data.timestamp } секунд назад ]
            </div>
            <div className={css.text}>
                { data.text }
            </div>
        </div>
    );
};

export default Message;