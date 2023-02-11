import React, {useContext, useEffect, useState} from 'react';
import Title from "../UI/Title/Title";
import {serverUrl} from "../../../../../../utils/conts";
import Item from "../UI/Item/Item";
import css from './UserSearch.module.scss';
import Button from "../../../../../UI/Button/Button";
import {UserData} from "../../../../../../App";
import Conversations from "../../../../../../store/Conversations";

const UsersSearch = ({ query }) => {
    const userData = useContext(UserData);
    const [queryResult, setQueryResult] = useState([])

    const fetchUsers = async function (query) {
        return await fetch(`${serverUrl}/api/users/getListByLogin`, {
            method: 'post',
            body: JSON.stringify({
                login: query,
                limit: 5
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(async (response) => {
            const result = await response.json();
            return result.data;
        }).catch((error) => console.log(error))
    }

    const createConversationWith = async function (login) {
        return await fetch(`${serverUrl}/api/conversations/create`, {
            method: 'post',
            body: JSON.stringify({
                members: [userData.user.userData.login, login]
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(async(response) => {
            return (await response.json()).data;
        });
    }

    useEffect(() => {
        window.addEventListener('init-search', init);

        return () => {
            window.removeEventListener('init-search', init);
        }
    }, [query]);

    const init = function () {
        fetchUsers(query).then((results) => {
            setQueryResult(results);
        });
    }

    return (
        <div>
            <Title>Пользователи</Title>
            {
                queryResult.length ? queryResult.map((result) =>
                    <Item className={css.resultItem} key={result.login}>
                        <div className={css.resultInfo}>
                            <img className={css.resultAvatar} src={result.avatar}/>
                            <div>{result.login}</div>
                        </div>
                        <div className={css.resultControl}>
                            <Button
                                validation={true}
                                onClick={() => {
                                    createConversationWith(result.login).then((data) => {
                                        Conversations.list.push(data);
                                    })
                                }}
                            >Соо</Button>
                        </div>
                    </Item>) : 'No find'
            }
        </div>
    );
};

export default UsersSearch;