import React, {useContext, useEffect, useState} from 'react';
import css from './ContentBrowser.module.scss';
import ContentBlock from "./ContentBlock/ContentBlock";
import KeyGen from "../KeyGen";
import {blockTypes} from "./ContentBlockTypes";
import {UserData} from "../../App";
import {serverUrl} from "../../utils/conts";

const ContentBrowser = () => {
    const userData = useContext(UserData);
    const browzer = (userData.user.userData.browzer || [])
        .sort((a, b) => a.order - b.order);

    const browzerItems = [];

    for (let i = 0; i < 3; i++) {
        browzerItems.push(browzer.filter((item) => item.order === i)[0] || {blocks: []});
    }

    const [contentBlockList, setContentBlockList] = useState(browzerItems.map(item => item.blocks));

    const updateBrowzer = function (userData, browzerData) {
        return fetch(`${serverUrl}/api/users/change`, {
            method: 'post',
            body: JSON.stringify({
                login: userData.user.userData.login,
                name: 'browzer',
                value: browzerData,
                sessionId: userData.user.sessionId
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    const updateContentBlockList = function (data) {
        const browzerData = data.map((block, index) => {
            return {
                id: `id_block_${Math.random()}`,
                order: index,
                blocks: block.map((option) => {
                    return {
                        id: `id_option_${Math.random()}`,
                        order: option.order,
                        type: option.type,
                        name: option.name,
                        active: option.active,
                        data: {data: 'some info'}
                    }
                })
            }
        });

        updateBrowzer(userData, browzerData).then((data) => {
            console.log(data);
        });

        setContentBlockList(data);
    }

    return (
        <div className={css.contentBrowser}>
            <div className={css.scrollable}>
                {
                    contentBlockList.map(
                        (block, index) =>
                            <ContentBlock
                                key={index}
                                options={block}
                                order={index}
                                updateBlockList={{contentBlockList, updateContentBlockList}}
                            />
                    )
                }
            </div>
        </div>
    );
};

export default ContentBrowser;