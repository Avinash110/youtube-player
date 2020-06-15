const express = require("express");
const app = express();
const path = require('path');
const session = require('express-session');

const webpack = require('webpack');
const webpackConfig = require('../webpack.config.js');
const compiler = webpack(webpackConfig);
const mode = process.env.NODE_ENV || "development";
var sharedsession = require("express-socket.io-session");

const names = ["Bat", "Cat", "Dat"];

const roomToUserMapping = {};
const roomToVideoDurationMapping = {};

const getRandomName = () => names[Math.floor(Math.random() * names.length)];

function randomStr(len) { 
    var ans = '';
    var arr = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (var i = len; i > 0; i--) { 
        ans += arr[Math.floor(Math.random() * arr.length)];
    } 
    return ans;
}

if(mode == "development"){
	const options = {
	  contentBase: './components',
	  hot: true,
	  host: 'localhost',
	  noInfo: true, publicPath: webpackConfig.output.publicPath
	};
	app.use(require("webpack-dev-middleware")(compiler, options));

	app.use(require("webpack-hot-middleware")(compiler));
}

app.use(express.static(mode == "development" ? 'public' : 'build'));
app.set('trust proxy', 1); // trust first proxy
app.use(
	session({
		secret: 'secret',
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false }
	})
);

app.get('/', function(req, res){
   res.redirect('/todo');
});

app.get('/favicon.ico', (req, res) => res.status(204));

const server = app.listen(process.env.PORT || 3000, function () {
  var port = server.address().port;
  console.log("Express is working on port " + port+ " in "+ mode + " mode");
});

const io = require("socket.io").listen(server);

io.on('connection', (socket) => {
	const socketRooms = socket.rooms;
	socket.once('disconnect', () => {
		Object.keys(socketRooms).forEach( function(element, index) {
			if(roomToUserMapping[element]){
				for(var i=0; i < roomToUserMapping[element].length; i++){
					if(roomToUserMapping[element][i].id == socket.id){
						roomToUserMapping[element].splice(i, 1);
						io.in(element).emit("disconnect", roomToUserMapping[element]);
					}
				}
			}
		});
		socket.disconnect();
	});

	socket.on('messageAdded', (payload) => {
		const newMessage = {
			timeStamp: payload.timeStamp,
			text: payload.text,
			user: payload.user
		};

		io.in(payload.room).emit('messageAdded', newMessage);
	});

	socket.on('userJoined', (payload) => {
		const newUser = {
			id: socket.id,
			name: getRandomName()
		};
		
		if(roomToUserMapping[payload.room]){
			socket.join(payload.room);
			roomToUserMapping[payload.room].push(newUser);
			socket.emit('setRoom', {
				room: payload.room,
				isAdmin: false,
				users: roomToUserMapping[payload.room]
			});
			io.in(payload.room).emit('userJoined', roomToUserMapping[payload.room]);
		}
		else {
			socket.emit('roomDoesNotExist');
		}

	});

	socket.on('userTyping', (payload) => {
		const typingUser = {
			user: payload.name
		};

		socket.broadcast.to(payload.room).emit('userTyping', typingUser);
	});

	socket.on('playVideoForAll', (payload) => {
		io.in(payload.room).emit('playVideo', {seekDuration: payload.seekDuration});
	});

	socket.on('stopVideoForAll', (payload) => {
		io.in(payload.room).emit('stopVideo', {});
	});

	socket.on('setVideoDuration', (payload) => {
		roomToVideoDurationMapping[payload.room] = payload.time
	});

	socket.on('setUserName', (payload) => {

		Object.keys(socketRooms).forEach( function(element, index) {
			if(roomToUserMapping[element]){
				for(var i=0; i < roomToUserMapping[element].length; i++){
					if(roomToUserMapping[element][i].id == socket.id){
						roomToUserMapping[element][i].name = payload.name;
						io.in(element).emit("userJoined", roomToUserMapping[element]);
					}
				}
			}
		});
	});

	socket.on('createRoom', () => {
		const room = randomStr(8);
		socket.join(room);
		// var users = io.sockets.adapter.rooms[room];
		const name = getRandomName();

		roomToUserMapping[room] = [{
			name: name,
			id: socket.id
		}];

		socket.emit('setRoom', {
			room: room,
			isAdmin: true,
			users: roomToUserMapping[room]
		});
	});
});