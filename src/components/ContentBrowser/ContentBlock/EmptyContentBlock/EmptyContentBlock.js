import React from 'react';
import {ContentBlockTypes} from "../../ContentBlockTypes";
import css from './EmptyContentBlock.module.scss';
import ContentBlockSelect from "../ContentBlockSelect/ContentBlockSelect";

const EmptyContentBlock = ({ order, options: {setBlockOptions} }) => {
    const types = ContentBlockTypes;

    return (
        <div className={css.emptyBlock}>

            No elements { order }

            <div onClick={() => {
                setBlockOptions([{
                    name: types['messages'].defaultTitle,
                    type: 'messages',
                    active: true,
                    order: 0,
                    id: `id_${Math.random()}`
                }])
            }}>
                Add messages
            </div>

            <div onClick={() => {
                setBlockOptions([{
                    name: types['google'].defaultTitle,
                    type: 'google',
                    active: true,
                    order: 0,
                    id: `id_${Math.random()}`
                }])
            }}>
                Add google
            </div>

        </div>
    );
};

export default EmptyContentBlock;