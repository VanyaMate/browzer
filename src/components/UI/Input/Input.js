import React, {useEffect, useState} from 'react';
import css from './Input.module.scss';

const Input = (props) => {
    const [activeClass, setActiveClass] = useState('');

    useEffect(() => {
        if (props.value !== '') {
            setActiveClass(props.validation ? css.active : css.error);
        } else {
            setActiveClass('');
        }
    }, [props.validation, props.value])

    return (
        <input
            onInput={props.onInput}
            placeholder={props.placeholder}
            type={props.type}
            value={props.value || ''}
            className={[css.input, activeClass, props.className || ''].join(' ').trim()}
        />
    );
};

export default Input;