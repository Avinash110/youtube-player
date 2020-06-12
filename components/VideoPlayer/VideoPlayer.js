import React from 'react';
import ReactDOM from 'react-dom';
import './VideoPlayer.css';
import * as d3 from "d3";
import _ from "underscore";
import { Slider } from 'antd';
import 'antd/dist/antd.css';
import {
  CaretRightOutlined,
  PauseOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  SoundOutlined
} from '@ant-design/icons';

export default class VideoPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            videoId: 'Cdsnc70Un14',
            isVideoPlaying: false,
            videoDuration: 0,
            currentVideoDuration: 0,
            videoDurationWidth: 0,
            volume: 100,
            fullScreenEnabled: false,
            hasStarted: false,
            showVolumeSlider: false,
            isAdmin: props.isAdmin
        };
    }

    componentDidMount() {
        this.initPlayer();
    }

    initPlayer() {
        this.player = new YT.Player('player', {
            height: ''+this.refs.container.clientHeight,
            width: ''+this.refs.container.clientWidth,
            playerVars: { 'controls': 0, 'origin':'http://localhost:3000', modestbranding: 1, cc_load_policy: 1, disablekb: 1 },
            videoId: this.state.videoId,
            events: {
                'onReady': this.onPlayerReady,
                onStateChange: this.onStateChange,
                onError: this.onError
            }
        });
    }

    onError = (data) => {
        console.log('Error OCcurred', data)
    }

    onStateChange = (event) => {
        if(event.data == 1 && this.state.hasStarted == false){
            this.setState({
                hasStarted: true
            });
            this.props.onPlayVideo();
        }
    }

    onPlayerReady = (event) => {
        const videoDuration = this.player.getDuration();
        const coord = this.refs.container.getBoundingClientRect();
        var myScale = d3.scaleLinear()
                      .domain([coord.x, coord.x + coord.width])
                      .range([0, videoDuration]);
        event.target.setVolume(100);
        this.player.cueVideoById({videoId: this.state.videoId});
        this.setState({
            videoDuration: videoDuration,
            showControls: true,
            myScale: myScale
        });
    }

    playVideo = (options) => {
        this.player.playVideo();
        if(options.seekDuration !== undefined){
            this.player.seekTo(options.seekDuration, true);
        }
        this.setState({
            isVideoPlaying: true,
            hasStarted: true
        });
        console.log('Play Video has been called');

        this.videoSetDuration = window.setInterval(() => {
            this.setVideoDuration()
        }, 1000);
    }

    setVideoDuration = () => {
        const coord = this.refs.container.getBoundingClientRect();
        const ct = this.player.getCurrentTime();
        this.setState({
            currentVideoDuration: ct,
            videoDurationWidth: this.state.myScale.invert(ct) - coord.x
        });

        if (this.state.admin){
            this.props.setVideoDuration(ct);
        }

        console.log('Video loaded fraction : ', this.player.getVideoLoadedFraction());
        console.log('Player State : ', this.player.getPlayerState());
    }

    stopVideo = () => {
        this.player.pauseVideo();
        this.setState({
            isVideoPlaying: false
        });
        clearInterval(this.videoSetDuration);
    }

    onPlay = (options) => {
        if (!this.state.isVideoPlaying) {
            this.props.onPlayVideo();
        } else {
            this.props.onStopVideo();
        }
    }

    formatDuration = (duration) => {

        const date = new Date(null);
        date.setSeconds(duration);

        let start = 11;
        let end = 8;

        if (duration < 3600){
            start = 14;
            end = 5;
        }
        return date.toISOString().substr(start, end);
    }

    onMouseOver = (event) => {
        const x = event.clientX;
        const y = event.clientY;
        
        const coords = this.refs.container.getBoundingClientRect()

        const seekDuration = this.state.myScale(x);
        this.setState({
            showSeekPosition: true,
            seekX: x,
            seekY: y,
            seekDuration: seekDuration,
            seekWidth: x - coords.x
        });
    }

    onMouseLeave = () => {
        this.setState({
            showSeekPosition: false
        });
    }

    onVideoSeek = (event) => {
        const x = event.clientX;
        const y = event.clientY;
        
        const coords = this.refs.container.getBoundingClientRect()

        const seekDuration = this.state.myScale(x);
        this.props.onPlayVideo(seekDuration);
    }

    showControls = () => {
        this.setState({
            showControls: true
        }, () => {
            if (this.callHideControl){
                clearTimeout(this.callHideControl);
            }
            this.callHideControl = setTimeout(() => {
                this.hideControls();
                clearTimeout(this.callHideControl);
            }, 3000);
        });
    }

    hideControls = () => {
        this.setState({
            showControls: false
        });
    }

    onFullScreenEnter = () => {
    }

    onVolumeChange = (value) => {
        this.player.setVolume(value);
        this.setState({
            volume: value
        });
    }

    showVolumeSlier = () => {
        this.setState({
            showVolumeSlider: true
        }, () => {
            if (this.hideVolumeSlider){
                clearTimeout(this.hideVolumeSlider);
            }
            this.hideVolumeSlider = setTimeout(() => {
                this.setState({
                    showVolumeSlider: false
                });
                clearTimeout(this.hideVolumeSlider);
            }, 2000);
        });
    }

    render() {
        const buttonColor = "#ddd";

        const PlayButton = this.state.isAdmin ? <button onClick={this.onPlay} className="button" title={this.state.isVideoPlaying ? "Pause": "Play"}>
                            {!this.state.isVideoPlaying ? <CaretRightOutlined fill={buttonColor}/> : <PauseOutlined fill={buttonColor} />}
                        </button> : null;

        const FullScreenButton = <button className="fullscreen-button button" title="Full screen">
            <FullscreenOutlined fill={buttonColor}/>
        </button>;

        const SoundButton = <button onMouseOver={this.showVolumeSlier} className="mute-button button" title="Mute">
            <SoundOutlined fill={buttonColor}/>
        </button>

        return (
            <div className="video-player-container" ref="container" onMouseMove={_.debounce(this.showControls, 100)}>
                <div ref="player" id="player">
                </div>
                {true|| this.state.showControls ? <div className="controls-container" style={{color: buttonColor}}>
                        <div className="progress-bar" onClick={this.state.isAdmin ? this.onVideoSeek : null} onMouseLeave={this.onMouseLeave} onMouseMove={this.onMouseOver} onMouseOver={this.onMouseOver}>
                            <div className="seek-duration" style={{width: this.state.showSeekPosition ? this.state.seekWidth+"px" : 0}}></div>
                            <div className="video-played-duration" style={{width: this.state.videoDurationWidth+"px"}}></div>
                        </div>
                        {this.state.showSeekPosition ? <span style={{position: 'fixed', top: this.state.seekY - 30, left:this.state.seekX }}>{this.formatDuration(this.state.seekDuration)}</span> : null}
                        <div className="controls">
                            {PlayButton}
                            <div className="video-duration-container">
                                <span>{this.formatDuration(this.state.currentVideoDuration)}</span>
                                <span>/</span>
                                <span>{this.state.videoDuration ? this.formatDuration(this.state.videoDuration) : "0:00"}</span>
                            </div>
                            <div className="volume-container">
                                {SoundButton}
                                <div onMouseOver={this.showVolumeSlier} className={"volume-slider-container "+ (this.state.showVolumeSlider ? +"show" : "hide")}>
                                    <Slider value={this.state.volume} onChange={this.onVolumeChange} />
                                </div>
                            </div>
                            <div className="right-controls">
                                {FullScreenButton}
                            </div>
                        </div>
                    </div> : null}
            </div>
        );
    }
}