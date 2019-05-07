var Client = {};
Client.socket = io.connect();

Client.askNewPlayer = function(){
    Client.socket.emit('newplayer');
};

Client.socket.on('newplayer',function(data){
  // console.log(data);
});

Client.socket.on('initplayer',function(data){
  // console.log(data);
  // console.log(Strategy.Game);
    //Strategy.game.addNewPlayer(data.id,data.team);
  Strategy.Game.prototype.addNewPlayer(data.id, data.team);
  Strategy.Game.prototype.setTurn(data.turn);
});

Client.socket.on('allplayers',function(data){
    //console.log(data);
});

Client.socket.on('setTurn',function(turn){
    Strategy.Game.prototype.setTurn(turn);
});

Client.changeTurn = function(t){
  // console.log(t);
    Client.socket.emit('changeTurn', t);
};

Client.gridRequest = function(grid){
    Client.socket.emit('gridRequest', grid);
};

//Server Side movement and attack
Client.moveUnitRequest = function(player, x, y){
    // console.log({player:player, x:x, y:y});
    Client.socket.emit('moveUnitRequest', {player:player, x:x, y:y});
};

Client.attackUnitRequest = function(target, player){
    Client.socket.emit('attackUnitRequest', {target:target, player:player});
};

//Client Side movement and attack
Client.socket.on('moveUnit',function(data){
    Strategy.Game.prototype.multiMoveUnit(data);
});

Client.socket.on('attackUnit',function(data){
  // console.log(data);
    Strategy.Game.prototype.multiAttackUnit(data);
});
