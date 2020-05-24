import React from 'react';
import ReactDOM from 'react-dom';
import './VideoPlayer.css';

export default class VideoPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            videoId: '_d2kwQYU6Pc',
            isVideoPlaying: false
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

    playVideo = () => {
        this.player.playVideo();
    }

    stopVideo = () => {
        this.player.pauseVideo();
    }

    onPlay = () => {
        if (!this.state.isVideoPlaying) {
            this.props.onPlayVideo();
            this.setState({
                isVideoPlaying: true
            });
        } else {
            this.props.onStopVideo();
            this.setState({
                isVideoPlaying: false
            });
        }
    }

    render() {
        return (
            <div className="video-player-container" ref="container">
                <div id="player">
                </div>
                <div className="controls-container">
                    <div className="progress-bar"></div>
                    <div className="controls">
                        <button onClick={this.onPlay} className="play">
                            {!this.state.isVideoPlaying ? <svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%">
                                <use className="shadow"></use>
                                <path className="controls-play-path" d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z" id="ytp-id-56"></path>
                            </svg> : <svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use className="ytp-svg-shadow"></use><path className="controls-play-path" d="M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z" id="ytp-id-91"></path></svg>
                        }
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}