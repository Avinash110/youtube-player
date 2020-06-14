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
import ChatRoom from "../ChatRoom/ChatRoom.js";

import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from '../../theme.js';
import { GlobalStyles } from "../../global.js";

import { Modal, Input, Button } from 'antd';

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
            userTyping: '',
            room: '',
            isAdmin: false,
            username: '',
            searchVideos: []
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
        console.log("Stop video for all has been called ");
        this.socket.emit('stopVideoForAll', {
            room: this.state.room
        });
    }

    stopVideo = () => {
        this.refs["videoPlayer"].pauseVideo();
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

    setVideoDuration = (ct) => {
        this.emit('setVideoDuration', {
            time: ct,
            room: this.state.room
        });
    }

    handleUsernameSubmit = () => {
        const username = this.refs.username.input.value.trim();
        this.emit('setUserName', {
            name: username
        });
        this.setState({
            username: username 
        });
    }

    searchData = (data) => {
        console.log("setting data:", data);
        this.setState({
            searchVideos: data
        });
    }

    render() {
        console.log(this.state.searchVideos);
        return (
            <ThemeProvider theme={this.state.theme == 'light' ? lightTheme : darkTheme}>
                <GlobalStyles />
                <NavBar 
                    theme={this.state.theme}
                    onThemeChange={this.handleChangeTheme}
                    room={this.state.room}
                    searchData={this.searchData}
                />
            {
                !this.state.room ? <CreateOrJoinRoom
                    emit={this.emit}
                    joinUserToRoom={this.joinUserToRoom}
                /> : 
                <div className="app-container">
                    <Modal
                        closable={false}
                      title="Welcome!"
                      visible={!this.state.username}
                      destroyOnClose={true}
                       footer={[
                        <Button type="primary" onClick={this.handleUsernameSubmit}>
                          Ok
                        </Button>
                      ]}
                    >
                        <label htmlFor="">Enter Your Username</label>
                        <Input ref="username" onPressEnter={this.handleUsernameSubmit} allowClear type="text" />
                    </Modal>
                    <VideoPlayer 
                        {...this.state}
                        onPlayVideo={this.playVideoForAll}
                        onStopVideo={this.stopVideoForAll}
                        ref={"videoPlayer"}
                        setVideoDuration={this.setVideoDuration}
                        searchVideos={this.state.searchVideos}
                    />
                    <ChatRoom username={this.state.username} room={this.state.room} userTyping={this.state.userTyping} messages={this.state.messages} emit={this.emit} users={this.state.users}/>
                </div>
            }
            </ThemeProvider>
        );
    }
}