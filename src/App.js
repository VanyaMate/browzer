import React, {createContext, useContext, useEffect, useState} from 'react';
import ContentBrowser from "./components/ContentBrowser/ContentBrowser";
import Header from "./components/Header/Header";
import LoginPage from "./components/LoginPage/LoginPage";
import {serverUrl, sessionStorageUserData} from "./utils/conts";

const firebaseConfig = {
    apiKey: "AIzaSyA-1tMgD7SbE0O2TDeR39lPVwtB75DtI6Q",
    authDomain: "socialbrowsr-cfe4b.firebaseapp.com",
    projectId: "socialbrowsr-cfe4b",
    storageBucket: "socialbrowsr-cfe4b.appspot.com",
    messagingSenderId: "402234590089",
    appId: "1:402234590089:web:0c987d049d751cbcc65758"
};

export const UserData = createContext(null);
const savedUserData = sessionStorage.getItem(sessionStorageUserData);

const App = ({ socket }) => {
    const [user, setUser] = useState(null);
    let loading = false;

    const savedDataExist = function () {
        return savedUserData !== null;
    }

    const checkUserData = async function (userData) {
        return await fetch(`${serverUrl}/api/login/id`, {
            method: 'post',
            body: JSON.stringify({
                login: userData.userData.login,
                sessionId: userData.sessionId
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(async (response) => {
            const body = await response.text();
            const data = JSON.parse(body);
            if (data.error === false) {
                return data.data;
            }
            return false;
        }).catch((error) => {
            console.error(error);
            return false;
        });
    }

    useEffect(() => {
        if (loading) return;
        if (savedDataExist()) {
            const userData = JSON.parse(savedUserData);
            loading = true;
            checkUserData(userData).then((data) => {
                console.log(userData);
                socket.send({
                    type: 'auth',
                    login: userData.userData.login,
                    sessionId: userData.sessionId
                });
                setUser(data || null);
                loading = false;
            }).catch(() => {
                loading = false;
            });
        }
    }, [])

    return (
        <UserData.Provider value={{user, setUser, socket}}>
            {
                user !== null ?
                    <div>
                        <Header/>
                        <ContentBrowser/>
                    </div>
                    :
                    <div>
                        <LoginPage socket={socket}/>
                    </div>
            }
        </UserData.Provider>
    );
};

export default App;
