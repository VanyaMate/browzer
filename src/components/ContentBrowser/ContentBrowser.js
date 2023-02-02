import React, {useEffect, useState} from 'react';
import css from './ContentBrowser.module.scss';
import ContentBlock from "./ContentBlock/ContentBlock";
import KeyGen from "../KeyGen";
import {blockTypes} from "./ContentBlockTypes";

const ContentBrowser = () => {
    const [contentBlockList, setContentBlockList] = useState([
        [
            {
                name: 'Сообщения',
                componentType: 'messages',
                active: false
            },
            {
                name: 'Группы',
                componentType: 'messages',
                active: true
            },
        ],
        [
            {
                name: 'Сообщения',
                componentType: 'messages',
                active: true
            },
        ],
        []
    ]);

    return (
        <div className={css.contentBrowser}>
            <div className={css.scrollable}>
                {
                    contentBlockList.map(
                        (block, index) =>
                            <ContentBlock
                                key={index}
                                options={block}
                            />
                    )
                }
            </div>
        </div>
    );
};

export default ContentBrowser;