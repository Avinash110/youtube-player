import React from 'react';
import ReactDOM from 'react-dom';

import {Toggle} from "../Toggle/Toggle.js";
import "./NavBar.css";
import {PaperClipOutlined} from '@ant-design/icons';
export default class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    copyLink = () => {
    	this.textArea.select();
	    document.execCommand('copy');
	    // This is just personal preference.
	    // I prefer to not show the the whole text area selected.
    }

    render() {
        return <nav className="navbar navbar-expand-lg" style={{justifyContent: "space-between"}}>
  			    <a className="navbar-brand" href="#">Lets watch!</a>
  			    <span>{this.props.users.length}</span>
  			    <div className="right-options">
  			    {
  			    	this.props.room ? <span style={{cursor:"pointer"}} onClick={this.copyLink}><PaperClipOutlined /><label htmlFor="">Invite Friends</label><input
  			    		type="text"
			            ref={(textarea) => this.textArea = textarea}
			            value={window.location.origin+"/?id="+this.props.room}
			          /></span>  : null
  			    }
  			    </div>
		    </nav>
    }
}