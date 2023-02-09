import React, {useContext, useEffect, useState} from 'react';
import css from './Header.module.scss';
import {UserData} from "../../App";
import Button from "../UI/Button/Button";
import {sessionStorageUserData} from "../../utils/conts";
import HeaderMusicBlock from "./HeaderBlocks/HeaderMusicBlock/HeaderMusicBlock";
import HeaderSearchBlock from "./HeaderBlocks/HeaderSearchBlock/HeaderSearchBlock";
import HeaderProfileBlock from "./HeaderBlocks/HeaderProfileBlock/HeaderProfileBlock";

const Header = () => {
    return (
        <div className={css.header}>
            <div className={css.content}>
                <HeaderMusicBlock/>
                <HeaderSearchBlock/>
                <HeaderProfileBlock/>
            </div>
        </div>
    );
};

export default Header;