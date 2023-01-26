import React from 'react';
import css from './Button.module.scss';

const Button = (props) => {
    return (
        <button
            ref={props.reff}
            className={[css.button, props.className || '', props.validation ? css.active : ''].join(' ')}
            onClick={props.onClick}
        >
            {props.children}
        </button>
    );
};

export default Button;