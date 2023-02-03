import React, {useContext, useEffect, useState} from 'react';
import css from './ContentBlockSelect.module.scss';
import KeyGen from "../../../KeyGen";
import {ContentBlockTypes} from "../../ContentBlockTypes";
import {UserData} from "../../../../App";
import {serverUrl} from "../../../../utils/conts";
const getShowedOptions = function (options) {
    let showedOptions = [];
    for (let i = 0; i < 3; i++) {
        if (options[i] === undefined) break;
        showedOptions.push(options[i]);
    }
    return showedOptions;
}

const getHiddenOptions = function (options) {
    let hiddenOptions = [];
    for (let i = 3; i < options.length; i++) {
        if (options[i] === undefined) break;
        hiddenOptions.push(options[i]);
    }
    return hiddenOptions;
}

const ContentBlockSelect = ({ options, active }) => {
    const userData = useContext(UserData);
    const { blockOptions, setBlockOptions } = options;
    const types = ContentBlockTypes;
    const [ showedOptions, setShowedOptions ] = useState(getShowedOptions(blockOptions));
    const [ hiddenOptions, setHiddenOptions ] = useState(getHiddenOptions(blockOptions));
    const [ openBurger, setOpenBurger ] = useState(false);

    useEffect(() => {
        setShowedOptions(getShowedOptions(blockOptions));
        setHiddenOptions(getHiddenOptions(blockOptions));
    }, [blockOptions])

    const closeOption = function (option) {
        setBlockOptions(blockOptions.filter((blockOption) => blockOption !== option));
    }

    const addOption = function (data) {
        setBlockOptions([...blockOptions, {
            name: data.name,
            type: data.type,
            active: false,
            order: blockOptions.length,
            id: `id_${Math.random()}`
        }]);

        setOpenBurger(blockOptions.length >= 3);
    }

    const activateOption = function (option) {
        active.activeOption.active = false;
        option.active = true;
        active.setActiveOption(option);
        setBlockOptions([...blockOptions]);
    }

    return (
        <div className={css.selectArea}>
            <div className={css.selectList}>
                {
                    showedOptions?.map((option) =>
                        <div
                            key={option.id}
                            className={[css.selectButton, active.activeOption === option ? css.active : ''].join(' ')}
                            onClick={() => {
                                activateOption(option);
                            }}
                        >
                            {option.name}
                            <div
                                className={css.closeButton}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    closeOption(option);
                                }}
                            > </div>
                        </div>
                    )
                }
            </div>

            <div
                className={[css.selectControlButton, css.addOptionButton].join(' ')}
                onClick={() => {
                    addOption({
                        name: 'Сооб ' + Math.random().toFixed(1),
                        type: 'messages'
                    })
                }}
            > </div>
            {
                blockOptions.length > 3 ?
                    <div
                        className={[css.selectControlButton, css.openBurgerMenuButton, hiddenOptions.some((op) => op === active.activeOption) ? css.activeControl : ''].join(' ')}
                        onClick={() => {
                            setOpenBurger(!openBurger);
                        }}
                    >
                        <div className={css.burgerMenuIcon}> </div>
                        <div
                            className={[css.burgerMenu, openBurger ? css.opened : ''].join(' ')}
                        >
                            {
                                hiddenOptions.map((option) => {
                                    return <div
                                        className={[css.burgerMenuItem, active.activeOption === option ? css.active : ''].join(' ')}
                                        key={option.id}
                                        onClick={() => {
                                            activateOption(option);
                                        }}
                                    >
                                        {option.name}
                                        <div
                                            className={css.closeButton}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                closeOption(option);
                                            }}
                                        > </div>
                                    </div>
                                })
                            }
                        </div>
                    </div> :
                    ''
            }
        </div>
    );
};

export default ContentBlockSelect;