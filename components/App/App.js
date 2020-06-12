import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

import io from "socket.io-client";

import MessageList from "../Messages/MessageList/MessageList.js";
import MessageForm from "../Messages/MessageForm/MessageForm.js";
import UserForm from "../Users/UserForm/UserForm.js";
import UserList from "../Users/UserList/UserList.js";
import VideoPlayer from "../VideoPlayer/VideoPlayer.js";
import CreateOrJoinRoom from "../CreateJoinRoom/CreateJoinRoom.js";
import NavBar from "../NavBar/NavBar.js";

import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from '../../theme.js';
import { GlobalStyles } from "../../global.js";

const eventToFunctionMapping = [
    { 'event': 'connect', 'function': 'connect' },
    { 'event': 'disconnect', 'function': 'disconnect' },
    { 'event': 'messageAdded', 'function': 'onMessageAdded' },
    { 'event': 'userJoined', 'function': 'onUserJoined' },
    { 'event': 'userTyping', 'function': 'userTyping' },
    { 'event': 'playVideo', 'function': 'playVideo' },
    { 'event': 'stopVideo', 'function': 'stopVideo' },
    { 'event': 'setRoom', 'function': 'setRoom' }
];

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: 'light',
            status: "Disconnected",
            messages: [],
            users: [],
            user: '',
            userTyping: '',
            room: '',
            isAdmin: false
        };

        this.socket = io(location.origin);

        eventToFunctionMapping.forEach((element, index) => {
            this.socket.on(element.event, this[element.function]);
        });
    }

    handleChangeTheme = () => {
        this.setState({theme: this.state.theme == 'light' ? 'dark' : 'light'});
    }

    setRoom = (payload) => {
        this.setState({room: payload.room, isAdmin: payload.isAdmin});
        this.onUserJoined(payload.users);
    }

    playVideoForAll = (seekDuration) => {
        this.socket.emit('playVideoForAll', {
            room: this.state.room,
            seekDuration
        });
    }

    stopVideoForAll = () => {
        this.socket.emit('stopVideoForAll', {
            room: this.state.room
        });
    }

    stopVideo = () => {
        this.refs["videoPlayer"].stopVideo();
    }

    playVideo = (payload) => {
        this.refs["videoPlayer"].playVideo({seekDuration: payload.seekDuration});
    }

    userTyping = (payload) => {
    	this.setState({ userTyping: payload.user });
    }

    onUserJoined = (users) => {
        this.setState({ users: users });
    }

    onMessageAdded = (message) => {
        this.setState({ messages: this.state.messages.concat(message) });
    }

    connect = () => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const id = urlParams.get("id");
        if(id){
            this.joinUserToRoom(id);
        }
        this.setState({ status: "Connected" });
    }

    joinUserToRoom = (room) => {
        this.emit('userJoined', {
            room: room
        });
    }

    disconnect = (users) => {
        this.setState({ status: "Disconnected", users: users });
    }

    emit = (eventName, payload) => {
        this.socket.emit(eventName, payload);
    }

    setUser = (user) => {
        this.setState({ user: user });
    }

    setVideoDuration = (ct) => {
        this.emit('setVideoDuration', {
            time: ct,
            room: this.state.room
        });
    }

    render() {

        /*<MessageList 
                            {...this.state}
                        />
                        <span className="current-user-typing">{this.state.userTyping ? this.state.userTyping + " is typing ..." : ""} </span>
                        <MessageForm
                            emit={this.emit}
                            {...this.state}
                        /> */
        return (
            <ThemeProvider theme={this.state.theme == 'light' ? lightTheme : darkTheme}>
                <GlobalStyles />
                <NavBar 
                    theme={this.state.theme}
                    onThemeChange={this.handleChangeTheme}
                    room={this.state.room}
                    users={this.state.users}
                />
            {
                !this.state.room ? <CreateOrJoinRoom
                    emit={this.emit}
                    joinUserToRoom={this.joinUserToRoom}
                /> : 
                <div className="app-container">
                    <VideoPlayer 
                        {...this.state}
                        onPlayVideo={this.playVideoForAll}
                        onStopVideo={this.stopVideoForAll}
                        ref={"videoPlayer"}
                        setVideoDuration={this.setVideoDuration}
                    />
                </div>
            }
            </ThemeProvider>
        );
    }
}