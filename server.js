var appPort =  process.env.PORT || process.env.VCAPP_APP_PORT || 8888;

var express = require('express'), app = express();
// var http = require('http'),
//     server = http.createServer(app),
//		io = require('socket.io').listen(server);
var http = require('http').createServer(app),
    io = require('socket.io').listen(http),
    fs = require('fs');

var d = new Date();
var y = d.getFullYear(),
	m = d.getMonth(),
	d = d.getDate();
var chatlog = '/tmp/log_'+y+"-"+m+"-"+d+'.txt';
var log = fs.createWriteStream(__dirname + chatlog, {'flags': 'a+'});

// app.set('views', __dirname + '/views');
// //app.set('view engine', 'jade');
// //app.set("view options", { layout: false });
// //app.configure(function() {
// 	app.use(express.static(__dirname + '/public'));
// //});
// app.get('/', function(req, res){
//   //res.render('home.jade');
//   res.end('index.html');
// });

// http.listen(appPort);
// // app.listen(appPort);


//io.configure(function () { 
//  io.set("transports", ["xhr-polling"]); 
//  io.set("polling duration", 10); 
//});

//set 'views' var to folder /views
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res){
  res.end('index.html');
});

http.listen(appPort);


io.sockets.on('connection', function (socket) {
	socket.on('setPseudo', function (data) {
		socket.set('pseudo', data);
		socket.broadcast.emit('joined_left', {'action': "joined", 'pseudo': data});
	});
	socket.on('message', function (message) {
		socket.get('pseudo', function (error, name) {
			var data = { 'message' : message, 'pseudo' : name };
			socket.broadcast.emit('message', data);
			console.log("user " + name + " send this : " + message);
			log.write(name + ": " + message +"\n");
		})
	});
	socket.on('disconnect', function() {
		socket.get('pseudo', function (error, name) {
			if (name !== null){
				socket.broadcast.emit('joined_left', {'action': "left", 'pseudo': name});
			}
		});
	});
});

function displayHistory (filepath) {
	fs.readFile(__dirname + filepath, "utf-8", function (err, data) {
		if (err) throw err;
		console.log(data);
	});
}