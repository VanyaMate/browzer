import React, {useContext, useEffect, useState} from 'react';
import css from './ContentBlockSelect.module.scss';
import {ContentBlockTypes} from "../../ContentBlockTypes";
import {UserData} from "../../../../App";
import BurgerMenu from "./BurgerMenu/BurgerMenu";
import AddOptionButton from "./AddOptionButton/AddOptionButton";
import OptionList from "./OptionList/OptionList";

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
            <OptionList
                activateOptionCallback={activateOption}
                closeOptionCallback={closeOption}
                active={active}
                showedOptions={showedOptions}
            />
            <AddOptionButton
                addOption={addOption}
            />
            {
                blockOptions.length > 3 ?
                    <BurgerMenu
                        closeOptionCallback={closeOption}
                        active={active}
                        activateOptionCallback={activateOption}
                        hiddenOptions={hiddenOptions}
                        openBurger={{openBurger, setOpenBurger}}
                    /> : ''
            }
        </div>
    );
};

export default ContentBlockSelect;