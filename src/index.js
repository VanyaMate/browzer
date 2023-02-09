import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import io from "socket.io-client";
import Conversations from "./store/Conversations";

// https://browzer.onrender.com
// localhost

const socket = io("localhost:5001", {

});

socket.handlers = new Map();

socket.on('message', data => {
    console.log('From socket-server', data);
    socket.handlers.forEach((handler) => handler(data));
});

Conversations.setSocket(socket);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App socket={socket}/>
    </React.StrictMode>
);
