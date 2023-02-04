import React from 'react';
import css from "../ContentBlockSelect.module.scss";
import ShowedOptions from "../ShowedOptions/ShowedOptions";

const OptionList = ({ showedOptions, active, activateOptionCallback, closeOptionCallback }) => {
    return (
        <div className={css.selectList}>
            {
                showedOptions?.map((option) =>
                    <ShowedOptions
                        option={option}
                        key={option.id}
                        active={active}
                        activeOptionCallback={activateOptionCallback}
                        closeOptionCallback={closeOptionCallback}
                    />
                )
            }
        </div>
    );
};

export default OptionList;