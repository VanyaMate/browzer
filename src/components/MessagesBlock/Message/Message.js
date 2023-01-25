import React, {useEffect} from 'react';
import css from './Message.module.scss';

const Message = ({ data }) => {
    return (
        <div className={[css.messageItem, data.user === 0 ? css.my : ''].join(' ')}>
            <div className={css.date}>
                User Userovich ({data.user}) [ { Math.ceil((Date.now() - data.date) / 1000)} секунд назад ]
            </div>
            <div className={css.text}>
                { data.message }
            </div>
        </div>
    );
};

export default Message;