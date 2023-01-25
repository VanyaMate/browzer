/*import React, {useEffect, useState} from 'react';
import css from './ContentBrowser.module.scss';
import ContentBlock from "./ContentBlock/ContentBlock";
import KeyGen from "../KeyGen";*/


// TODO
/*
const ContentBrowser = () => {
    const [contentBlockList, setContentBlockList] = useState([[], [], [], []]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [centralBlock, setCentralBlock] = useState(1);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        window.addEventListener('resize', () => {
            setWindowWidth(window.innerWidth);
        });
    });

    useEffect(() => {
        const blocksAmount = contentBlockList.length;
        const blockWidth = 400 + 10; // 400px (width) + 10px (margin-left)
        const rightMargin = 10;

        const contentSize = blockWidth * blocksAmount + rightMargin;
        const deltaSize = windowWidth - contentSize;

        if (deltaSize > 0) {
            offset !== 0 && setOffset(0);
        } else {
            const blocksInSize = Math.ceil(deltaSize / blockWidth);
            const widthForBlocks = blocksInSize * blockWidth;
            const additionalOffset = blockWidth + rightMargin;
            const isLastElement = (blocksAmount + blocksInSize) === 2;
            const noInSize = (blocksAmount + blocksInSize) === 1;
            const onlyOneOffset = isLastElement ? blockWidth : 0;
            const centerOffset = centralBlock * blockWidth;

            // пропустить если помещается меньше одного
            if (noInSize) { return; }

            const resultOffset = widthForBlocks - additionalOffset + onlyOneOffset;

            offset !== resultOffset && setOffset(resultOffset);
        }
    }, [contentBlockList, windowWidth, centralBlock]);

    return (
        <div className={css.contentBrowser}>
            <div className={css.scrollable} style={{marginLeft: -offset}}>
                {contentBlockList.map((block) => <ContentBlock key={KeyGen.getId()}/>)}
            </div>
        </div>
    );
};

export default ContentBrowser;*/
