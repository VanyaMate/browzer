import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import io from "socket.io-client";

const socket = io("localhost:5002", {
    withCredentials: true,
    extraHeaders: {
        "user-data": ""
    }
});

socket.handlers = new Map();

socket.on('message', data => {
    console.log('From socket-server', data);
    socket.handlers.forEach((handler) => handler(data));
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App socket={socket}/>
    </React.StrictMode>
);
