import React, {createContext, useContext, useEffect, useState} from 'react';
import ContentBrowser from "./components/ContentBrowser/ContentBrowser";
import Header from "./components/Header/Header";

import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import LoginPage from "./components/LoginPage/LoginPage";
import {serverUrl, sessionStorageLogin, sessionStorageSessionId} from "./utils/conts";

const firebaseConfig = {
    apiKey: "AIzaSyA-1tMgD7SbE0O2TDeR39lPVwtB75DtI6Q",
    authDomain: "socialbrowsr-cfe4b.firebaseapp.com",
    projectId: "socialbrowsr-cfe4b",
    storageBucket: "socialbrowsr-cfe4b.appspot.com",
    messagingSenderId: "402234590089",
    appId: "1:402234590089:web:0c987d049d751cbcc65758"
};

export const UserData = createContext(null);
const savedLogin = sessionStorage.getItem(sessionStorageLogin);
const savedSessionId = sessionStorage.getItem(sessionStorageSessionId);

const App = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const savedDataExist = function () {
        return savedLogin !== null && savedSessionId !== null;
    }

    const checkUserData = async function (login, sessionId) {
        await fetch(`${serverUrl}/api/login/id`, {
            method: 'post',
            body: JSON.stringify({
                login: savedLogin,
                sessionId: savedSessionId
            })
        }).then(async (response) => {
            const body = await response.text();
            const data = JSON.parse(body);
            if (data.success) {
                setUser({login: savedLogin, sessionId: savedSessionId});
                return true;
            }
            return false;
        }).catch((error) => {
            console.log(error);
            return false;
        });
    }

    useEffect(() => {
        if (loading) return;
        if (savedDataExist()) {
            setLoading(true);
            checkUserData(savedLogin, savedSessionId).then((status) => {
                setLoading(false);
            });
        }
    }, [])

    return (
        <UserData.Provider value={{user, setUser}}>
            {
                user !== null ?
                    <div>
                        <Header/>
                        <ContentBrowser/>
                    </div>
                    :
                    <div>
                        <LoginPage/>
                    </div>
            }
        </UserData.Provider>
    );
};

export default App;
