import React, {useEffect, useState} from 'react';
import css from './ContentBlock.module.scss';
import ContentBlockSelect from "./ContentBlockSelect/ContentBlockSelect";
import KeyGen from "../../KeyGen";
import {ContentBlockTypes} from "../ContentBlockTypes";
import EmptyContentBlock from "./EmptyContentBlock/EmptyContentBlock";

const ContentBlock = ({ options, order, updateBlockList: {contentBlockList, updateContentBlockList} }) => {
    const getActiveOption = (options) => options?.filter((option) => option.active)?.[0] || options?.[0];
    const [activeOption, setActiveOption] = useState(getActiveOption(options));
    const [blockOptions, setBlockOptions] = useState(options);
    const [sendUpdate, setSendUpdate] = useState(false);

    useEffect(() => {
        contentBlockList[order] = blockOptions;
        setActiveOption(getActiveOption(blockOptions));

        if (sendUpdate) {
            updateContentBlockList(contentBlockList);
        }

        const stop = setTimeout(() => {
            setSendUpdate(true);
        }, 1000);

        return () => {
            clearTimeout(stop);
        }
    }, [blockOptions]);

    return (
        <div className={css.contentBlock}>
            {
                blockOptions?.length
                ?
                    <div className={css.contentBlockContainer}>
                        <ContentBlockSelect
                            options={{blockOptions, setBlockOptions}}
                            active={{activeOption, setActiveOption}}
                        />
                        {
                            blockOptions.map((option) => {
                                const Component = ContentBlockTypes[option.type].Component;
                                return <Component
                                    activeOption={activeOption}
                                    key={option.id}
                                    data={option}
                                    options={{blockOptions, setBlockOptions}}
                                />
                            })
                        }
                    </div>
                :
                    <EmptyContentBlock order={order} options={{blockOptions, setBlockOptions}}/>
            }
        </div>
    );
};

export default ContentBlock;