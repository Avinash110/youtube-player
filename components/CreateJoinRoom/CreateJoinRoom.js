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
  	this.props.emit('userJoined', {
  		room: this.refs.roomid.value.trim()
  	});
  }

  render() {
    return (
		<div className="row create-join">
			<div className="col-md-2 offset-md-4">
				<div className="card" onClick={this.onCreateRoom}>
				  <div className="card-body">
				    <p className="card-text">Create Room</p>
				  </div>
				</div>
			</div>
			<div className="col-md-2">
				<div className="card" onClick={this.onJoinRoom}>
					<div className="card-body">
				    	<p className="card-text">Join Room</p>
				    	{
				    		this.state.showJoinRoomID ? <form onSubmit={this.onSubmit}>
								<input type="text" ref="roomid" placeholder="Enter room id :" className="form-control"/>
							</form> : null
				    	}
				  	</div>
			  	</div>
			</div>
		</div>

    );
  }
}