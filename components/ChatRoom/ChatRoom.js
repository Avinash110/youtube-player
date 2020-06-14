import React from 'react';
import ReactDOM from 'react-dom';
import './ChatRoom.css';

import MessageList from "../Messages/MessageList/MessageList.js";
import MessageForm from "../Messages/MessageForm/MessageForm.js";
import { Row, Col, Collapse, Tabs, List, Avatar } from 'antd';
import { WechatOutlined } from "@ant-design/icons";

const { TabPane } = Tabs
const { Panel } = Collapse;


export default class ChatRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
  	const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];

    return (
    	<div className="chat-container">
			<Row>
				<Col offset={18} span={6}>
					<Collapse expandIcon={() => <WechatOutlined style={{fontSize: "18px"}}/>}>
					    <Panel header="Chat" key="1">
					    	<div className="chat-tabs-conatiner">
						      <Tabs defaultActiveKey="1">
							    <TabPane tab="Messages" key="1">
							      <MessageList 
										messages={this.props.messages}
									/>
									<span className="current-user-typing">{this.props.userTyping ? this.props.userTyping + " is typing ..." : ""} </span>
									<MessageForm
										room={this.props.room}
										emit={this.props.emit}
										username={this.props.username}
									/>
							    </TabPane>
							    <TabPane tab="Users" key="2">
							      <List
								      size="small"
								      dataSource={this.props.users}
								      renderItem={(item, index) => <List.Item.Meta key={index} avatar={<Avatar style={{backgroundColor: colorList[index % colorList.length], verticalAlign: 'middle' }}>
								        {item.name[0]}
								      </Avatar>} description={item.name}></List.Item.Meta>}
								    />
							    </TabPane>
							  </Tabs>
						  </div>
					    </Panel>
					</Collapse>
				</Col>
			</Row>
		</div>
    );
  }
}