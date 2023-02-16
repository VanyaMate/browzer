import React, {createContext, useContext, useEffect, useState} from 'react';
import ContentBrowser from "./components/ContentBrowser/ContentBrowser";
import Header from "./components/Header/Header";
import LoginPage from "./components/LoginPage/LoginPage";
import {serverUrl, sessionStorageUserData} from "./utils/conts";
import Friends from "./store/Friends";

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
            const data = await response.json();
            if (data.error === false) {
                console.log('DATA: ', data);
                return data.data;
            }
            return false;
        }).catch((error) => {
            console.error(error);
            return false;
        });
    }

    useEffect(() => {
        socket.handlers.delete(this);
        socket.handlers.set(this, (data) => {
            if (data.error && data.message === 'need auth') {
                const userData = JSON.parse(savedUserData || '{}');
                userData.userData && socket.send({
                    type: 'auth',
                    login: userData.userData.login,
                    sessionId: userData.sessionId
                });
            }
        })
        if (loading) return;
        if (savedDataExist()) {
            const userData = JSON.parse(savedUserData);
            loading = true;
            checkUserData(userData).then((data) => {
                socket.send({
                    type: 'auth',
                    login: data.userData.login,
                    sessionId: data.sessionId
                });

                clearInterval(window.socketPingInterval);
                window.socketPingInterval = setInterval(() => {
                    socket.send({
                        type: 'ping',
                        login: data.userData.login
                    })
                }, 10000);

                Friends.list = data.userData.friends;
                Friends.inList = data.userData.friendsInRequests;
                Friends.outList = data.userData.friendsOutRequests;

                console.log('list', data.userData.friends);
                console.log('inList', data.userData.friendsInRequests);
                console.log('outList', data.userData.friendsOutRequests);

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
