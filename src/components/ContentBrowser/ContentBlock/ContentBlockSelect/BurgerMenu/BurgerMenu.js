import React from 'react';
import css from './BurgerMenu.module.scss';
import HiddenOptions from "../HiddenOption/HiddenOptions";

const BurgerMenu = ({ hiddenOptions, active, openBurger: {openBurger, setOpenBurger}, closeOptionCallback, activateOptionCallback }) => {
    return (
        <div
            className={[css.selectControlButton, css.openBurgerMenuButton, hiddenOptions.some((op) => op === active.activeOption) ? css.activeControl : ''].join(' ')}
            onClick={() => {
                setOpenBurger(!openBurger);
            }}
        >
            <div className={css.burgerMenuIcon}> </div>
            <div className={[css.burgerMenu, openBurger ? css.opened : ''].join(' ')}>
                {
                    hiddenOptions.map((option) => {
                        return <HiddenOptions
                            option={option}
                            key={option.id}
                            closeOptionCallback={closeOptionCallback}
                            activateOptionCallback={activateOptionCallback}
                            active={active}
                        />
                    })
                }
            </div>
        </div>
    );
};

export default BurgerMenu;