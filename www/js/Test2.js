var config = {
  type: Phaser.AUTO,
  width: 320,
  height: 240,
  scene: {
    preload: preload,
    create: create
  }
};

var tileSize = 16;
var game = new Phaser.Game(config);
//Variable to keep track of what happens on the map
var grid = [];

//Variable to keep track of all of the units
var playerUnits = [];
var enemyUnits = [];

function preload ()
{
  this.load.spritesheet('tiles', 'assets/images/tiles.png', { frameWidth: tileSize, frameHeight: tileSize, endFrame: 3 });
  this.load.image('healthbar', 'assets/images/healthbar.png');
}

function create ()
{
  //Tiled map
  var map = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
             [1,1,1,1,1,1,1,1,2,2,2,1,1,1,1,1,1,1,1,1],
             [1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1],
             [1,1,2,2,2,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1],
             [1,1,2,2,2,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1],
             [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
             [1,1,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
             [1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
             [1,1,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
             [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
             [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
             [1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1],
             [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
             [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
             [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],];

  //Display of the map
  var ty = tileSize / 2;
  for (var x = 0; x < map.length; x++) {
      var tx = tileSize/2;
      grid[x] = [];
      for (var y = 0; y < map[x].length; y++) {
        //TODO : switch - case
        if (map[x][y] == 0) {
          grid[x][y] = 0;
          //var mapGroup = this.add.group({ key: 'tiles', frame: 0, setXY: { x: tx, y: ty, stepX: tileSize } });
          new ITile(this, 'tiles', 0, tx, ty, tileSize);
        } else if (map[x][y] == 1) {
          grid[x][y] = 1;
          //var mapGroup = this.add.group({ key: 'tiles', frame: 1, setXY: { x: tx, y: ty, stepX: tileSize } });
          new ITile(this, 'tiles', 1, tx, ty, tileSize);
        } else if (map[x][y] == 2) {
          grid[x][y] = 2;
          //var mapGroup = this.add.group({ key: 'tiles', frame: 2, setXY: { x: tx, y: ty, stepX: tileSize } });
          new ITile(this, 'tiles', 2, tx, ty, tileSize);
        }
        tx += 16;
      }
    ty += 16;
  }

  //Create the units
  var units = [{moves: 5, range: 1, color: 0xFF00FF, row: 1, col: 12, maxHealth: 10, team: 'player'},
               {moves: 4, range: 2, color: 0xFF00FF, row: 6, col: 9, maxHealth: 8, team: 'player'},
               {moves: 2, range: 1, color: 0xFF0000, row: 2, col: 2, maxHealth: 10, team: 'enemy'}];

 for (var i = 0; i < units.length; i++) {
     var unit = new Unit(this, units[i], grid);
     //unit.addHealthBar();

     if (unit.team == 'player') {
         //unit.events.onInputDown.add(this.drawRange, this);
         playerUnits.push(unit);
     } else {
         enemyUnits.push(unit);
     }
 }
 // start the game with the player turn
 //playerturn();
}
