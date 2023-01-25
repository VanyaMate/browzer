import React, {useEffect, useRef, useState} from 'react';
import css from './ScrollContainer.module.scss';

const ScrollContainer = (props) => {
    const [scrollable, setScrollable] = useState(false);
    const [scrollTop, setScrollTop] = useState(0);
    const [scrollHeight, setScrollHeight] = useState(0);
    const itemsSize = useRef();
    const container = useRef();

    const scrollHandler = function ({ target }) {
        setScrollTop(target.scrollTop);
        props.onScroll(
            itemsSize.current.scrollHeight -
            container.current.scrollTop -
            itemsSize.current.clientHeight
        );
    }

    useEffect(() => {
        const currentScrollHeight = itemsSize.current.scrollHeight;
        const clientHeight = itemsSize.current.clientHeight;
        const scrollBarHeight = clientHeight / currentScrollHeight * 100;

        setScrollable(scrollBarHeight < 100);

        if (scrollTop !== 0) {
            const scrollDelta = currentScrollHeight - scrollHeight;
            let scroll = 0;

            if (props.addingMessage[0]) {
                props.addingMessage[1](false);
                scroll = scrollTop;
            } else {
                scroll = scrollTop + scrollDelta;
            }

            container.current.scrollTo(0, scroll);
            setScrollTop(scroll);
        }

        setScrollHeight(currentScrollHeight);

        return () => {

        };
    }, [props.children])

    return (
        <div
            ref={container}
            className={[css.scrollContainer, props.className || ''].join(' ')}
            onScroll={scrollHandler}
        >
            <div
                ref={itemsSize}
                className={
                    [
                        css.itemsContainer,
                        scrollable ? '' : css.noScroll,
                        props.containerClassName || ''
                    ]
                    .join(' ')
                }
            >
                {props.children}
            </div>
        </div>
    );
};

export default ScrollContainer;