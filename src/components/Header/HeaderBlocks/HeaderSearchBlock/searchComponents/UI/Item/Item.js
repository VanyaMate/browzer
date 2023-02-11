import React from 'react';
import css from './Item.module.scss';

const Item = (props) => {
    return (
        <div className={[css.item, props.className].join(' ')}>
            {props.children}
        </div>
    );
};

export default Item;