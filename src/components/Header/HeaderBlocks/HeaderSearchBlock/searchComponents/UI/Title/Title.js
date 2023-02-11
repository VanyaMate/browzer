import React from 'react';
import css from './Title.module.scss';

const Title = (props) => {
    return (
        <div className={css.title}>
            {props.children}
        </div>
    );
};

export default Title;