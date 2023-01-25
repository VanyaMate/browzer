import React, {createContext, useContext, useState} from 'react';
import ContentBrowser from "./components/ContentBrowser/ContentBrowser";
import Header from "./components/Header/Header";

import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import LoginPage from "./components/LoginPage/LoginPage";

const firebaseConfig = {
    apiKey: "AIzaSyA-1tMgD7SbE0O2TDeR39lPVwtB75DtI6Q",
    authDomain: "socialbrowsr-cfe4b.firebaseapp.com",
    projectId: "socialbrowsr-cfe4b",
    storageBucket: "socialbrowsr-cfe4b.appspot.com",
    messagingSenderId: "402234590089",
    appId: "1:402234590089:web:0c987d049d751cbcc65758"
};

export const UserData = createContext(null);

const App = () => {
    const [user, setUser] = useState(null);

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
