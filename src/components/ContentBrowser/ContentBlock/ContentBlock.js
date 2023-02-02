import React, {useEffect, useState} from 'react';
import css from './ContentBlock.module.scss';
import ContentBlockSelect from "./ContentBlockSelect/ContentBlockSelect";
import KeyGen from "../../KeyGen";
import {ContentBlockTypes} from "../ContentBlockTypes";

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
                        {
                            options.map((option) => {
                                const Component = ContentBlockTypes[option.componentType].Component;
                                return <Component activeOption={activeOption} key={option.name} data={option}/>
                            })
                        }
                    </div>
                :
                    <h1>No elements</h1>
            }
        </div>
    );
};

export default ContentBlock;