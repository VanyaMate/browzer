import React from 'react';
import css from './ShowedOptions.module.scss';
import CloseOptionButton from "../CloseOptionButton/CloseOptionButton";

const ShowedOptions = ({ active, option, activeOptionCallback, closeOptionCallback }) => {
    return (
        <div
            className={[css.selectButton, active.activeOption === option ? css.active : ''].join(' ')}
            onClick={() => {
                activeOptionCallback(option);
            }}
        >
            {option.name}
            <CloseOptionButton option={option} closeOptionCallback={closeOptionCallback}/>
        </div>
    );
};

export default ShowedOptions;