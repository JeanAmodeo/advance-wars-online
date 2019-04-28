var config = {
  type: Phaser.AUTO,
  width: 320,
  height: 240,
  scene: {
    preload: preload,
    create: create
  }
};

var game = new Phaser.Game(config);
//Variable to keep track of what happens on the map
var grid = [];

//Variable to keep track of all of the units
var playerUnits = [];
var enemyUnits = [];

function preload ()
{
  this.load.spritesheet('tiles', 'assets/images/tiles.png', { frameWidth: 16, frameHeight: 16, endFrame: 3 });
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


  var Unit = new Phaser.Class({

    initialize:
    function Unit (scene, unitData){
      // set graphics properties
      this.frame = 1;

      this.tint = unitData.color;

      this.unitGroup = scene.add.group();

      // copy parameters to instance variables
      this.row = unitData.row;
      this.col = unitData.col;
      this.moves = unitData.moves;
      this.range = unitData.range;
      this.team = unitData.team;
      this.health = unitData.maxHealth;
      this.maxHealth = unitData.maxHealth;

      //this.unitGroup = scene.add.group({ key: 'tiles', frame: this.frame, setXY: { x: 8+this.col*16, y: 8+this.row*16, stepX: 16 } });
      //Phaser.Actions.SetTint(this.unitGroup.getChildren(), this.tint);

      var sprite = scene.add.sprite(8+this.col*16, 8+this.row*16, 'tiles', this.frame).setInteractive();
      sprite.tint = this.tint;
      sprite.basetint = this.tint;
      //Phaser.Actions.SetTint(this.unitGroup.getChildren(), this.tint);

      this.unitGroup.add(sprite);

      /*var sprite = this.unitGroup.create({ key: 'tiles', frame: this.frame, setXY: { x: 8+this.col*16, y: 8+this.row*16, stepX: 16 } });
      sprite.tint = this.tint;
      sprite.setOrigin(0);*/

      // mark the starting tile as containing a player or enemy
      // based on the team of the unit
      if (this.team == 'player') {
          grid[this.row][this.col].containsPlayer = true;
          this.inputEnabled = false;

      } else {
          grid[this.row][this.col].containsEnemy = true;
      }

      //Adding the mouse events
      sprite.on('pointerdown', function (event) {
          this.setTint(0x474747);
      });

      sprite.on('pointerout', function (event) {
          sprite.tint = sprite.basetint;
      });

      sprite.on('pointerup', function (event) {
          sprite.tint = sprite.basetint;
      });
    },

  });

  //Display of the map
  var ty = 8;
  for (var x = 0; x < map.length; x++) {
      var tx = 8;
      grid[x] = [];
      for (var y = 0; y < map[x].length; y++) {
        //TODO : switch - case
        if (map[x][y] == 0) {
          grid[x][y] = 0;
          var mapGroup = this.add.group({ key: 'tiles', frame: 0, setXY: { x: tx, y: ty, stepX: 16 } });
        } else if (map[x][y] == 1) {
          grid[x][y] = 1;
          var mapGroup = this.add.group({ key: 'tiles', frame: 1, setXY: { x: tx, y: ty, stepX: 16 } });
        } else if (map[x][y] == 2) {
          grid[x][y] = 2;
          var mapGroup = this.add.group({ key: 'tiles', frame: 2, setXY: { x: tx, y: ty, stepX: 16 } });
        }
        tx += 16;
      }
    ty += 16;
  }

  //Create the units
  var units = [{moves: 5, range: 1, color: 0x00FF00, row: 1, col: 12, maxHealth: 10, team: 'player'},
               {moves: 4, range: 2, color: 0xFF00FF, row: 6, col: 9, maxHealth: 8, team: 'player'},
               {moves: 2, range: 1, color: 0xFF0000, row: 2, col: 2, maxHealth: 10, team: 'enemy'}];

 for (var i = 0; i < units.length; i++) {
     var unit = new Unit(this, units[i]);
     //unit.addHealthBar();

     if (unit.team == 'player') {
         //unit.events.onInputDown.add(this.drawRange, this);
         playerUnits.push(unit);
     } else {
         enemyUnits.push(unit);
     }
 }
 // start the game with the player turn
 playerturn();
}

function neighbors(x, y) {
    var dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    var neighbors = [];

    var len = dirs.length
    for (var i = 0; i < dirs.length; i++)
    {
        var row = x + dirs[i][0];
        var col = y + dirs[i][1];
        if (row >= 0 && row <= grid.length - 1 && col >= 0 && col <= grid[0].length - 1) {
            neighbors.push(grid[row][col]);
        }
    }
    return neighbors;
}

function playerturn() {
    turn = 'player';

    //this.recolor(enemyUnits);

    // make player units clickable to show range
    var len = playerUnits.length;
    for (var i = 0; i < len; i++) {
        var unit = playerUnits[i];
        unit.didMove = false;
        unit.inputEnabled = true;
    }
}

// Called when turn switches from player to enemy
//TODO - Phaser3
function enemyTurn() {
    this.recolor(playerUnits);

    turn = 'enemy';
    // Sample enemy behavior that randomly moves the first enemy unit one space
    var unit = enemyUnits[0];
    var neighbors = this.neighbors(grid[unit.row][unit.col]);
    var tile = neighbors[Math.floor(Math.random() * neighbors.length)];
    tile.cameFrom = grid[unit.row][unit.col];
    unit.move(tile);
}

//TODO - Phaser3
function recolor(unitArray) {
    var len = unitArray.length;

    for (var i = 0; i < len; i++) {
        unitArray[i].tint = unitArray[i].color;
    }
}

//TODO - Phaser3
function drawRange(player) {
    this.clearDraw();
    this.clearPath();

    var playerTile = grid[player.row][player.col];

    range = this.getRange(player);

    var len = range.length;
    for (var i = 0; i < len; i++) {
        if (range[i].depth <= player.moves) {
            var tile = this.game.add.sprite(range[i].col * this.game.global.tileSize,
                                            range[i].row * this.game.global.tileSize,
                                            'tiles');
            tile.frame = 1;
            tile.tint = 0x0000FF;
            tile.alpha = 0.7;
            tile.row = range[i].row;
            tile.col = range[i].col;
            drawn.push(tile);


            // TODO: this part of the code should be in a more logical place
            if (!range[i].containsPlayer) {
                tile.inputEnabled = true;

                tile.events.onInputOver.add(function(tile, pointer) {
                    this.drawPath(grid[tile.row][tile.col], playerTile);
                    this.game.world.bringToTop(player);
                }, this);

                tile.events.onInputDown.add(function(tile, pointer) {
                    player.inputEnabled = false;
                    this.clearPath();
                    this.clearDraw();
                    player.move(grid[tile.row][tile.col]);
                }, this);
            }
        }
        else {
            var tile = this.game.add.sprite(range[i].col * this.game.global.tileSize,
                                            range[i].row * this.game.global.tileSize,
                                            'tiles');
            tile.frame = 1;
            tile.tint = 0xFF0000;
            tile.alpha = 0.7;
            tile.row = range[i].row;
            tile.col = range[i].col;
            drawn.push(tile);
        }
    }

    this.moveUnitsToTop();
}

//TODO - Phaser3
function drawPath(to, from) {
    this.clearPath();
    path = [];

    while(to != from) {
        var tile = this.game.add.sprite(to.col * this.game.global.tileSize,
                                        to.row * this.game.global.tileSize,
                                        'tiles');
        tile.frame = 1;
        tile.tint = 0x00FF00;
        tile.alpha = 0.5;
        path.push(tile);

        to = to.cameFrom;
    }
    // TODO: Find a way to combine this step into the loop?
    var tile = this.game.add.sprite(from.col * this.game.global.tileSize,
                                    from.row * this.game.global.tileSize,
                                    'tiles');
    tile.frame = 1;
    tile.tint = 0x00FF00;
    tile.alpha = 0.5;
    path.push(tile);
}

//TODO - Phaser3
function clearPath() {
    var len = path.length;

    for (var i = 0; i < len; i++) {
        path[i].destroy();
    }

    path = [];
}

//TODO - Phaser3
function getRange(player) {
    this.resetGrid();
    var visited = [];
    var frontier = [];

    var tile = grid[player.row][player.col];
    tile.depth = 0;

    frontier.push(tile);
    visited.push(tile);

    while (frontier.length != 0) {
        // get the first tile in the queue
        var current = frontier.shift();
        if (visited.indexOf(current) == -1 && !current.isObstacle) {
            visited.push(current);
        }

        // get all of the neighbors of the current tile
        var neighbors = this.neighbors(current);
        var len = neighbors.length;

        for (var i = 0; i < len; i++) {

            var nextDepth = current.depth + Math.max(neighbors[i].cost, current.cost);

            if (neighbors[i].isObstacle || neighbors[i].containsEnemy || nextDepth > player.moves) {
                nextDepth = Math.max(current.depth + 1, player.moves + 1);
                if (nextDepth > player.moves + player.range) {
                    continue;
                }
            }

            if (nextDepth < neighbors[i].depth) {
                neighbors[i].depth = nextDepth;
                neighbors[i].cameFrom = current;
                frontier.push(neighbors[i]);
            }
        }
    }

    return visited;
}

// Clears the tiles that have been drawn
// to represent the movement and attack ranges
//TODO - Phaser3
function clearDraw() {
    var len = drawn.length;
    for (var i = 0; i < len; i++) {
        drawn[i].destroy();
        // TODO: Move this logic
    }

    drawn = [];
}

// TODO: Check where this actually needs to be called
//TODO - Phaser3
function resetGrid() {
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[0].length; j++) {
            grid[i][j].depth = Infinity;
        }
    }
}

//TODO - Phaser3
function unitDidMove(unit) {
    var unitArray;

    unit.didMove = true;

    unit.tint = 0xAAAAAA;

    if (unit.team == 'player') {
        unitArray = playerUnits;
    } else {
        unitArray = enemyUnits;
    }

    var len = unitArray.length;

    for (var i = 0; i < len; i++) {
        if (!unitArray[i].didMove) {
            return;
        }
    }

    if (turn == 'player') {
        this.enemyTurn();
    } else {
        this.playerTurn();
    }
}

//TODO - Phaser3
function moveUnitsToTop() {
    var allUnits = playerUnits.concat(enemyUnits);

    var len = allUnits.length;
    for (var i = 0; i < len; i++) {
        this.game.world.bringToTop(allUnits[i]);
    }
}
