import React from 'react';
import ReactDOM from 'react-dom';
import './VideoPlayer.css';

export default class VideoPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            videoId: '_d2kwQYU6Pc'
        };
    }

    componentDidMount() {
        this.initPlayer();
    }

    initPlayer() {
        this.player = new YT.Player('player', {
            height: ''+this.refs.container.clientHeight,
            width: ''+this.refs.container.clientWidth,
            playerVars: { 'controls': 0, 'origin':'http://localhost:3000' },
            videoId: this.state.videoId,
            events: {
                'onReady': this.onPlayerReady
            }
        });

        // this.player.cueVideoById({videoId: this.state.videoId});
    }

    onPlayerReady = (event) => {
        // event.target.playVideo();
    }

    onPlayClick = () => {
        this.props.onPlayVideo();
    }

    playVideo = () => {
        this.player.playVideo();
    }

    render() {
        return (
            <div className="video-player-container" ref="container">
                <div id="player">
                </div>
                <div className="controls-container">
                    <div className="progress-bar"></div>
                    <div className="controls">
                        <button className="play">
                            <svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%">
                                <use className="shadow"></use>
                                <path className="play-path" d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z" id="ytp-id-56"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}