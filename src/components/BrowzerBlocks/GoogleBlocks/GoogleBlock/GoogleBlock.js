import React from 'react';
import css from './GoogleBlock.module.scss';

const GoogleBlock = ({ data, activeOption }) => {
    return (
        <div className={[css.block, activeOption === data ? '' : css.hidden].join(' ')}>
            <iframe seamless frameBorder={'0'} className={css.frame} src={'https://www.google.com/webhp?igu=1'}/>
        </div>
    );
};

export default GoogleBlock;