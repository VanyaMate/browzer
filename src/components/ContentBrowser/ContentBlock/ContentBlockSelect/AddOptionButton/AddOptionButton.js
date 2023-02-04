import React from 'react';
import css from './AddOptionButton.module.scss';

const AddOptionButton = ({ addOption }) => {
    return (
        <div
            className={[css.selectControlButton, css.addOptionButton].join(' ')}
            onClick={() => {
                addOption({
                    name: 'Сооб ' + Math.random().toFixed(1),
                    type: 'messages'
                })
            }}
        > </div>
    );
};

export default AddOptionButton;