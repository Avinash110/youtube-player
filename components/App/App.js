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
            room: ''
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
        this.setState({room: payload.room});
        this.onUserJoined(payload.users);

    }

    playVideoForAll = () => {
        this.socket.emit('playVideoForAll', {
            room: this.state.room
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

    playVideo = () => {
        this.refs["videoPlayer"].playVideo();
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
        this.setState({ status: "Connected" });
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
                />
            {
                !this.state.room ? <CreateOrJoinRoom
                    emit={this.emit}
                /> : 
                <div className="row">
                    <div className="col-md-4 offset-md-1">
                        {this.state.room}
                        <UserList 
                            {...this.state}
                        />
                    </div>
                    <div className="col-md-6">
                        <VideoPlayer 
                            {...this.state}
                            onPlayVideo={this.playVideoForAll}
                            onStopVideo={this.stopVideoForAll}
                            ref={"videoPlayer"}
                        />
                    </div>
                </div>
            }
            </ThemeProvider>
        );
    }
}