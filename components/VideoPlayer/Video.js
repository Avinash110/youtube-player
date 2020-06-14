import React from 'react';
import ReactDOM from 'react-dom';
import { Skeleton, Card } from 'antd';
import LazyLoad from 'react-lazy-load';
const { Meta } = Card;

export default class VideoPlayer extends React.Component {
	render() {
		const {data} = this.props; 
		return (
			 <Card
			 	onClick={() => this.props.onVideoClick(data.id)}
			    hoverable
			    style={{ width: 240 }}
			    cover={data.loading ? null : <img async src={"https://img.youtube.com/vi/"+data.id+"/sddefault.jpg"} />}
			  >
			  	<Skeleton loading={data.loading} avatar active>
			    	<Meta title={data.title} />
			    </Skeleton>
			  </Card>
		);
	}
}