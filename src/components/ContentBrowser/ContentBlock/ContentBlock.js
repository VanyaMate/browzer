import React, {useEffect, useState} from 'react';
import css from './ContentBlock.module.scss';
import ContentBlockSelect from "./ContentBlockSelect/ContentBlockSelect";
import KeyGen from "../../KeyGen";

const ContentBlock = ({ options }) => {
    const getActiveOption = () => options?.filter((option) => option.active)?.[0] || options?.[0];
    const [activeOption, setActiveOption] = useState(getActiveOption());

    return (
        <div className={css.contentBlock}>
            {
                options?.length
                ?
                    <div className={css.contentBlockContainer}>
                        <ContentBlockSelect
                            options={options}
                            active={{activeOption, setActiveOption}}
                        />
                        {activeOption.Component}
                    </div>
                :
                    <h1>No elements</h1>
            }
        </div>
    );
};

export default ContentBlock;