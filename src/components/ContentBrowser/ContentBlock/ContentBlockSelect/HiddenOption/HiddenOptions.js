import React from 'react';
import css from './HiddenOptions.module.scss';
import CloseOptionButton from "../CloseOptionButton/CloseOptionButton";

const HiddenOptions = ({ active, activateOptionCallback, option, closeOptionCallback }) => {
    const isActive = () => active.activeOption === option ? css.active : '';

    return (
        <div
            className={[css.burgerMenuItem, isActive()].join(' ')}
            onClick={() => {
                activateOptionCallback(option);
            }}
        >
            {option.name}
            <CloseOptionButton option={option} closeOptionCallback={closeOptionCallback}/>
        </div>
    );
};

export default HiddenOptions;