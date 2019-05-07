// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Node_server_without_framework
// https://stackoverflow.com/questions/44405448/how-to-allow-cors-with-node-js-without-using-express

var express = require('express');
var app = express();

//let http = require('http');
let fs = require('fs');
let path = require('path');

let headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Access-Control-Max-Age': 2592000 // 30 days
    /** add other headers as per requirement */
  };

var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use('/js',express.static(__dirname + '/www/js'));
app.use('/assets',express.static(__dirname + '/www/assets'));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/www/index.html');
});

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

server.listen(3000,function(){ // Listens to port 8081
    console.log('Listening on '+server.address().port);
});

server.lastPlayerID = 0; // Keep track of the last id assigned to a new player
server.turn = 'player';

io.on('connection',function(socket){
  console.log("connection");
    socket.on('newplayer',function(){
        socket.player = {
            id: server.lastPlayerID++,
            team: teamSelector(),
            turn: server.turn
        };
        console.log(socket.player);
        socket.emit('allplayers',getAllPlayers());
        socket.emit('initplayer', socket.player);
        socket.emit('setTurn', server.turn);
        //socket.broadcast.emit('newplayer',socket.player);
    });

    socket.on('changeTurn',function(turn){
            server.turn = turn;
            console.log(server.turn);
            socket.broadcast.emit('setTurn',server.turn);
        });

    socket.on('moveUnitRequest',function(data){
            console.log("move:", data.player, data.x, data.y);
            socket.broadcast.emit('moveUnit',data);
        });

      socket.on('attackUnitRequest',function(data){
              console.log("attack:",data.target, data.player);
              socket.broadcast.emit('attackUnit',data);
          });
});

function getAllPlayers(){
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if(player) players.push(player);
    });
    return players;
}

function teamSelector () {
    if (server.lastPlayerID%2 == 0){// && server.lastPlayerID <= 2) {
      return "player";
    } else if (server.lastPlayerID%2 != 0){ //&& server.lastPlayerID <= 2){
      return "enemy";
    } else {
      return "spectator";
    }
}
/*http.createServer(function (request, response) {
    console.log('request ', request.url);
    let url = request.url
    if (url == "/") {
        url = "index.html";
    }
    let filePath = './www/' + url;
    //if (filePath == './') {
    //    filePath = './www/index.html';
    //}

    let extname = String(path.extname(filePath)).toLowerCase();

    let mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.svg': 'application/image/svg+xml'
    };

    let contentType = mimeTypes[extname] || 'application/octet-stream';


    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT') {
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                response.end();
            }
        }
        else {
            headers['Content-Type'] = contentType;
            response.writeHead(200, headers);
            response.end(content, 'utf-8');
        }
    });

}).listen(3000);
console.log('Server running at http://127.0.0.1:3000/');*/
