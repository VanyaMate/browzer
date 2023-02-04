import React from 'react';
import css from './CloseOptionButton.module.scss';

const CloseOptionButton = ({ closeOptionCallback, option }) => {
    return (
        <div
            className={css.closeButton}
            onClick={(event) => {
                event.stopPropagation();
                closeOptionCallback(option);
            }}
        > </div>
    );
};

export default CloseOptionButton;