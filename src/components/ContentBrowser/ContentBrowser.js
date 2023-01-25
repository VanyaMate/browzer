import React, {useEffect, useState} from 'react';
import css from './ContentBrowser.module.scss';
import ContentBlock from "./ContentBlock/ContentBlock";
import KeyGen from "../KeyGen";
import {blockTypes} from "./ContentBlockTypes";

const ContentBrowser = () => {
    const [contentBlockList, setContentBlockList] = useState([[
        {
            name: 'Сообщения',
            Component: <blockTypes.messages.Component key={KeyGen.getId()} data={{id: 123}}/>
        },
        {
            name: 'Группы',
            Component: <blockTypes.messages.Component key={KeyGen.getId()} data={{id: 999}}/>
        },
        {
            name: 'Новости',
            Component: <blockTypes.messages.Component key={KeyGen.getId()} data={{id: 777}}/>
        },
    ], [
        {
            name: 'Сообщения',
            Component: <blockTypes.messages.Component key={KeyGen.getId()} data={{id: 323}}/>
        },
        {
            name: 'Группы',
            Component: <blockTypes.messages.Component key={KeyGen.getId()} data={{id: 111}}/>
        },
        {
            name: 'Новости',
            Component: <blockTypes.messages.Component key={KeyGen.getId()} data={{id: 277}}/>
        },
    ], [
        {
            name: 'Сообщения',
            Component: <blockTypes.messages.Component key={KeyGen.getId()} data={{id: 1213}}/>
        },
        {
            name: 'Группы',
            Component: <blockTypes.messages.Component key={KeyGen.getId()} data={{id: 599}}/>
        },
        {
            name: 'Новости',
            Component: <blockTypes.messages.Component key={KeyGen.getId()} data={{id: 744477}}/>
        },
    ]]);

    return (
        <div className={css.contentBrowser}>
            <div className={css.scrollable}>
                {
                    contentBlockList.map(
                        (block) =>
                            <ContentBlock
                                key={KeyGen.getId()}
                                options={block}
                            />
                    )
                }
            </div>
        </div>
    );
};

export default ContentBrowser;