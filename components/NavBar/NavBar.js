import React from 'react';
import ReactDOM from 'react-dom';

import {Toggle} from "../Toggle/Toggle.js";
import "./NavBar.css";
import {PaperClipOutlined} from '@ant-design/icons';
import { Popover, Input } from 'antd';
const { Search } = Input;
const apiKey = "AIzaSyDmo66bl4Y3hWDKeMRGgx1WZLYC69m1nS4";
export default class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    copyLink = () => {
    	this.refs.link.input.select();
	    document.execCommand('copy');
    }

    search = async (value) => {
      
      this.props.searchData([{
        loading: true
      },{
        loading: true
      },{
        loading: true
      },{
        loading: true
      },{
        loading: true
      }]);

      const searchData = [];
      
      const results = await fetch(`https://www.googleapis.com/youtube/v3/search??part=id&q=${value}&type=video&key=${apiKey}`);
      const resultsData = await results.json();
      const finalResult = await Promise.all(resultsData.items.map((item) => fetch(`https://www.googleapis.com/youtube/v3/videos?id=${item.id.videoId}&key=${apiKey}&fields=items(id,snippet(title),statistics)&part=snippet,statistics`).then(response => response.json())));
      this.props.searchData(finalResult.map(d => {
          return {id: d.items[0].id, title: d.items[0].snippet.title, stats: d.items[0].statistics}
      }));
    }

    render() {
        return <nav className="navbar navbar-expand-lg" style={{justifyContent: "space-between"}}>
  			    <a className="navbar-brand" href="#">Lets watch!</a>
            {this.props.room ? <Search
              placeholder="search videos"
              onSearch={this.search}
              style={{ width: 200 }}
            /> : null}
  			    <div className="right-options">
  			    {
  			    	this.props.room ? 
              <Popover content={<div style={{display: "flex", alignItems: "center"}}><Input ref="link" defaultValue={window.location.origin+"/?id="+this.props.room}/><PaperClipOutlined style={{fontSize:"20px",cursor:"pointer"}} onClick={this.copyLink} /></div>} title="Copy Link">
                <label htmlFor="">Invite Friends</label>
              </Popover>
                : null
  			    }
  			    </div>
		    </nav>
    }
}