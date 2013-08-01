
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , peer = require('./routes/peer')
  , room = require('./routes/room')
  , http = require('http')
  , https = require('https')
  , static = require('node-static')
  , path = require('path');

var a = require('./node_modules/node-rtc/build/Release/rtc.node');

const crypto = require('crypto'),
	fs = require('fs');
	
var privateKey = fs.readFileSync('privatekey.pem').toString();
var certificate = fs.readFileSync('certificate.pem').toString();

var credentials = crypto.createCredentials({key: privateKey, cert: certificate});

// This line is from the Node.js HTTPS documentation.
var options = {
  key: fs.readFileSync('privatekey.pem'),
  cert: fs.readFileSync('certificate.pem')
};

var app = express();
var file = new(static.Server)();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/sign_in', routes.index);
app.get('/users', user.list);
app.get('/call', peer.call);
app.get('/senddata', peer.send);
app.get('/chatroom', room.index);

var server = https.createServer(options, app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket){
	
	function log(){
          var array = [">>> "];
          for (var i = 0; i < arguments.length; i++) {
                array.push(arguments[i]);
          }
            socket.emit('log', array);
        }
	
	socket.on('message', function (message) {
                log('Got message: ', message);
                socket.broadcast.emit('message', message); // should be room only
                  if (message === 'got user media') {
					var pc, pc_config, pc_constraints;
					 pc = new RTCPeerConnection(pc_config, pc_constraints);
  				  }
        });
        
     socket.on('create or join', function (room) {
                var numClients = io.sockets.clients(room).length;

                log('Room ' + room + ' has ' + numClients + ' client(s)');
                log('Request to create or join room', room);

                if (numClients == 0){
                        socket.join(room);
                        socket.emit('created', room);
                } else if (numClients == 1) {
                        io.sockets.in(room).emit('join', room);
                        socket.join(room);
                        socket.emit('joined', room);
                } else { // max two clients
                        socket.emit('full', room);
                }
                socket.emit('emit(): client ' + socket.id + ' joined room ' + room);
                socket.broadcast.emit('broadcast(): client ' + socket.id + ' joined room ' + room);

        });
});