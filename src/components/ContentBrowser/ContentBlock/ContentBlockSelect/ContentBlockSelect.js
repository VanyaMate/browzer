import React from 'react';
import css from './ContentBlockSelect.module.scss';
import KeyGen from "../../../KeyGen";

const ContentBlockSelect = ({ options, active }) => {
    return (
        <div className={css.selectArea}>
            {
                options.map((option) =>
                    <div
                        key={KeyGen.getId()}
                        className={[css.selectButton, active.activeOption === option ? css.active : ''].join(' ')}
                        onClick={() => active.setActiveOption(option)}
                    >
                        {option.name}
                    </div>
                )
            }
        </div>
    );
};

export default ContentBlockSelect;