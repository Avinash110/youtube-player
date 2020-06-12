import React from 'react';
import ReactDOM from 'react-dom';
import './CreateJoinRoom.css';

export default class CreateJoinRoom extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showJoinRoomID: false
		};
	}

	onCreateRoom = () => {
		this.props.emit("createRoom", {});
	}

	onJoinRoom = () => {
		this.setState({
			showJoinRoomID: true
		});
	}

	onSubmit = (event) => {
		event.preventDefault();
		this.props.joinUserToRoom(this.refs.roomid.value.trim());

		this.refs.roomid.value = "";
	}

	onJoinRoom = () => {
		this.setState({
			showJoinView: true
		});
	}

	render() {
		return (
			<div className={"join-create-container" + (this.state.showJoinView ? " dark" : "")}>
					<div className="button-container">
						<button onClick={this.onCreateRoom} style={{display: this.state.showJoinView ? "none" : "block"}} type="button" className="btn" value="Create Room">Create Room</button>
						<button style={{display: this.state.showJoinView ? "none" : "block"}} onClick={this.onJoinRoom} type="button" className="btn" value="Join Room">Join Room</button>
						<form onSubmit={this.onSubmit} className={"room-form" + (this.state.showJoinView ? " show" : "")}>
							<input ref="roomid" placeholder="Enter Room ID" type="text" className="txtbox" />
						</form>
					</div>
					<div className="img-container">
						<div className={"overlay" + (this.state.showJoinView ? " show" : "")}></div>
						<img className="img-gif" src="images/giphy.gif" />
					</div>
			</div>
		);
	}
}