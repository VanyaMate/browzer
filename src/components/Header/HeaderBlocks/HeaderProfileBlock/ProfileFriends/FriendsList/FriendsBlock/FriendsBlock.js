import React, {useContext} from 'react';
import css from './FriendsBlock.module.scss';
import {observer} from "mobx-react-lite";
import Item from "../../../../HeaderSearchBlock/searchComponents/UI/Item/Item";
import Button from "../../../../../../UI/Button/Button";
import {serverUrl} from "../../../../../../../utils/conts";
import {UserData} from "../../../../../../../App";

const FriendsBlock = observer(({ list, add }) => {
    const userData = useContext(UserData);

    const requestFriendWith = async function (data) {
        return await fetch(`${serverUrl}/api/friends/add`, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(async(response) => {
            return (await response.json()).data;
        });
    }

    const removeFriend = async function (data) {
        return await fetch(`${serverUrl}/api/friends/remove`, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(async(response) => {
            return (await response.json()).data;
        });
    }

    const addConversation = async function (data) {
        return await fetch(`${serverUrl}/api/conversations/create`, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(async(response) => {
            return (await response.json()).data;
        });
    }

    return (
        <div className={css.container}>
            {
                list.map((data) =>
                    <Item key={data.login} className={css.item}>
                        <div className={css.userInfo}>
                            <img className={css.userAvatar} src={data.avatar}/>
                            <div className={css.userLogin}>{data.login}</div>
                        </div>
                        <div className={css.controlButtons}>
                            <Button
                                className={css.button}
                                validation={true}
                                onClick={() => {
                                    addConversation({
                                        type: 'single',
                                        members: [data.login],
                                        login: userData.user.userData.login,
                                        sessionId: userData.user.sessionId
                                    }).then()
                                }}
                            >
                                <img className={css.resultAddIcon} src={`${serverUrl}/icons/chat.png`} alt=""/>
                            </Button>
                            {
                                add ?
                                    <Button
                                        className={css.button}
                                        validation={data.preference.friends === 'all'}
                                        onClick={() => {
                                            requestFriendWith({
                                                login: userData.user.userData.login,
                                                sessionId: userData.user.sessionId,
                                                addLogin: data.login
                                            }).then();
                                        }}
                                    >
                                        <img className={css.resultAddIcon} src={`${serverUrl}/icons/add.png`} alt=""/>
                                    </Button> : ''
                            }
                            <Button
                                className={css.button}
                                validation={true}
                                onClick={() => {
                                    removeFriend({
                                        login: userData.user.userData.login,
                                        sessionId: userData.user.sessionId,
                                        removeLogin: data.login
                                    }).then()
                                }}
                            >
                                <img className={css.resultAddIcon} src={`${serverUrl}/icons/delete.png`} alt=""/>
                            </Button>
                        </div>
                    </Item>
                )
            }
        </div>
    );
});

export default FriendsBlock;