import React from 'react';
import ReactDOM from 'react-dom';
import './MessageForm.css';
import _ from "underscore";

export default class MessageForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
	
  onSubmit = (event) => {
	event.preventDefault();
	this.props.emit('messageAdded', {
		timeStamp: Date.now(),
		text: this.refs.message.value.trim(),
		user: this.props.username,
    room: this.props.room
	});

	this.refs.message.value = "";
  }

  onKeyUp = (event) => {
  	if (this.clearUserTypingWrapper){
  		this.clearUserTypingWrapper.cancel();
  	}
  	this.callUserTypingWrapper = _.debounce(this.callUserTyping, 500);
  	this.callUserTypingWrapper();
  	this.clearUserTypingWrapper = _.debounce(this.clearUserTyping, 2000);
  	this.clearUserTypingWrapper();
  }

  clearUserTyping = () => {
  	this.props.emit('userTyping', {
  		name: '',
      room: this.props.room
  	});
  }

  callUserTyping = () => {
  	this.props.emit('userTyping', {
  		name: this.props.username,
      room: this.props.room
  	});
  }

  render() {
    return (
  		<form className="message-form" onSubmit={this.onSubmit}>
  			<input onKeyUp={this.onKeyUp} type="text" ref="message" placeholder="Please type a message..." className="message-input"/>
  		</form>
    );
  }
}