
var path = [];
var drawn = [];
var targetTile = [];

// keep track of all of the tiles on the map
var grid = [];
var map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 2, 2, 2, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 2, 2, 2, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// list of units to create at the start of the game
var types = [{name: 'sword', frame: 0,moves: 5, range: 1, maxHealth: 10,dmg:5, weakVs:'wizard', strVs:'bow'},
                {name: 'bow', frame: 1,moves: 3, range: 5,maxHealth: 7,dmg:5,weakVs:'sword', strVs:'wizard'},
                {name: 'wizard', frame: 2,moves: 4, range: 3,maxHealth: 5,dmg:5,weakVs:'bow', strVs:'sword'},];
var units = [{
        type: 'sword',
        row: 1,
        col: 12,
        team: 'player'
    },
    {
        type:'bow',
        row: 6,
        col: 9,
        team: 'player'
    },
    {
        type: 'wizard',
        row: 2,
        col: 2,
        team: 'enemy'
    },
    {
        type: 'wizard',
        row: 6,
        col: 7,
        team: 'enemy'
    }
];

// contains all units
var playerUnits = [];
var enemyUnits = [];

// contains the current player
var turn = 'player';
//var actionCount = 0;

Strategy.Game = function () {};

Unit = function (unitData) {

        Phaser.Sprite.call(this, Strategy.game, 16 * unitData.col, 16 * unitData.row, 'units');
        
        switch(unitData.type){
            case 'sword':
            type = types[0];
            break;
            case 'bow':
            type = types[1];
            break;
            case 'wizard':
            type = types[2];
            break;
            default:
            type = types[1];
            break;
        }
        
        this.type = type.name;
        this.frame = type.frame;
        this.moves = type.moves;
        this.range = type.range;
        this.dmg = type.dmg;
        this.maxHealth = type.maxHealth;
        this.weakVs = type.weakVs;
        this.strVs = type.strVs;

        this.row = unitData.row;
        this.col = unitData.col;
        
        this.team = unitData.team;
        this.health = unitData.maxHealth;
        

        
        if (this.team == 'player') {
            grid[this.row][this.col].containsPlayer = true;
            this.inputEnabled = false;
    
        } else {
            grid[this.row][this.col].containsEnemy = true;
            this.inputEnabled = false;
        }

        

        Strategy.game.add.existing(this);
    },

    Unit.prototype = Object.create(Phaser.Sprite.prototype);
Unit.prototype.constructor = Unit;

Unit.prototype.addHealthBar = function () {
    // Add red background to represent missing health
    var healthbarbg = this.game.add.sprite(0, -10, 'healthbar');
    // healthbarbg.anchor.setTo(-0.5,-0.5);
    healthbarbg.cropEnabled = true;
    healthbarbg.tint = 0xFF0000;

    // Add green foreground to repesent current health
    var healthbarfg = this.game.add.sprite(0, -10, 'healthbar');
    // healthbarfg.anchor.setTo(-0.5,-0.5);
    healthbarfg.cropEnabled = true;
    healthbarfg.tint = 0x00FF00;

    // attach healthbar to unit
    this.addChild(healthbarbg);
    this.addChild(healthbarfg);
}


Unit.prototype.updateHealth = function (healthDelta) {
    this.health += healthDelta;

    // get the width of the bar background (red part) to represent
    // maximum of health
    //console.log(this);
    var maxWidth = this.getChildAt(0).width;

    // get the child healthbar foreground sprite
    var healthbarfg = this.getChildAt(1);

    // update the width based on fraction of health remaining
    healthbarfg.width = maxWidth * (this.health / this.maxHealth);

    if (this.health <= 0) {
      this.destroy();
      if(turn == 'enemy'){
        for (var i = 0; i < playerUnits.length; i++) {
          var obj = playerUnits[i];
          if (obj.id == this.id) {
            playerUnits.splice(i, 1);
            grid[this.col][this.row].containsPlayer = false;
          }
        }
      } else {
        for (var i = 0; i < enemyUnits.length; i++) {
          var obj = enemyUnits[i];
          if (obj.id == this.id) {
            enemyUnits.splice(i, 1);
            grid[this.col][this.row].containsEnemy = false;
          }
        }
      }
  }
}


// Given a starting and ending tile, moves the unit
// along a path and updates the instance position variables
Unit.prototype.followPath = function (unitPath) {
    // stores cost of the tile that the unit is currently on
    var currentCost = 0;
    var playerTween = this.game.add.tween(this);

    while (unitPath.length > 0) {
        var next = unitPath.pop();

        // Add the location of the next tile to the tween
        // Speed of the tween is based on the movement cost
        // between the two tiles
        playerTween.to({
            x: next.col * 16,
            y: next.row * 16
        }, 300 * Math.max(next.cost, currentCost), Phaser.Easing.Linear.None);

        // store the cost of the new current tile to determine
        // the next movement cost
        currentCost = next.cost;
    }

      
        // When the tween is done, change the turn
        playerTween.onComplete.add(function() {
            Strategy.Game.prototype.unitDidMove(this);
            // if (turn == 'player') {
            //     Strategy.Game.prototype.enemyTurn.call(Strategy.game.state.states["Game"]);
            // } else {
            //     Strategy.Game.prototype.playerTurn.call(Strategy.game.state.states["Game"]);
            // }
        }, this);

    playerTween.start();

}

Unit.prototype.move = function (to) {
    var unitPath = [];
    var from = grid[this.row][this.col];
    var newRow = to.row;
    var newCol = to.col;

    while (to != from) {
        unitPath.push(to);
        to = to.cameFrom;
    }

    this.followPath(unitPath);

    // update grid properties to reflect the movement of the character
    if (this.team == 'player') {
        grid[this.row][this.col].containsPlayer = false;
        grid[newRow][newCol].containsPlayer = true;
    } else {
        grid[this.row][this.col].containsEnemy = false;
        grid[newRow][newCol].containsEnemy = true;
    }

    // update instance variables to reflect move
    this.row = newRow;
    this.col = newCol;

}

/* Creates a Tile (extends Sprite) given the following parameters:
 * row: integer starting row on the map (0-indexed)
 * col: integer starting col on the map (0-indexed)
 * type: integer representing tile type (currently 0 represents an obstacle,
 * all other positive integers correspond to move cost) */
Tile = function (row, col, type) {
    // create sprite
    Phaser.Sprite.call(this, Strategy.game, Strategy.game.global.tileSize * col, Strategy.game.global.tileSize * row, 'tiles');

    // set instance variables
    this.frame = type
    this.isObstacle = !type;
    this.cost = type;
    this.row = row;
    this.col = col;

    // it is important to set the initial search depth to inifinty
    // so that the movement range search works properly
    this.depth = Infinity;

    // add sprite to game
    Strategy.game.add.existing(this);
}

Tile.prototype = Object.create(Phaser.Sprite.prototype);
Tile.prototype.constructor = Tile;

Strategy.Game.prototype = {

    create: function () {
        // set dimensions of the game
        this.smoothed = false;
        var cols = this.game.width / this.game.global.tileSize;
        var rows = this.game.height / this.game.global.tileSize;

        // create the grid from global map variable
        for (var i = 0; i < rows; i++) {
            grid[i] = [];
            for (var j = 0; j < cols; j++) {
                grid[i][j] = new Tile(i, j, map[i][j]);
            }
        }

        // create units
        var len = units.length;
        for (var i = 0; i < len; i++) {
            var unit = new Unit(units[i]);
            unit.addHealthBar();

            if (unit.team == 'player') {
                unit.events.onInputDown.add(this.turnAction, this);
                //unit.events.onInputDown.add(this.drawRange, this);
                //unit.events.onInputDown.add(this.drawRangeAttack, this);
                playerUnits.push(unit);
            } else {
                unit.events.onInputDown.add(this.turnAction, this);
                //unit.events.onInputDown.add(this.drawRange, this);
                //unit.events.onInputDown.add(this.drawRangeAttack, this);
                enemyUnits.push(unit);
            }
        }

        // star the game with the player turn
        this.playerTurn();
    },

    // Called when turn switches from enemy to player
    playerTurn: function () {
        turn = 'player';
        this.recolor(playerUnits, 0xffffff);
        this.recolor(enemyUnits, 0x808080);

        // make player units clickable to show range
        var len = playerUnits.length;
        for (var i = 0; i < len; i++) {
            var unit = playerUnits[i];
            unit.didMove = false;
            unit.didAttack = false;
            unit.inputEnabled = true;
        }
    },

    // Called when turn switches from player to enemy
    enemyTurn: function () {
      turn = 'enemy';
      actionCount = 0;

      this.recolor(playerUnits, 0x808080);
    this.recolor(enemyUnits, 0xffffff);

      // make player units clickable to show range
      var len = enemyUnits.length;
      for (var i = 0; i < len; i++) {
          var unit = enemyUnits[i];
          unit.didMove = false;
          unit.didAttack = false;
          unit.inputEnabled = true;
      }
    },

    recolor: function (unitArray, tint) {
        var len = unitArray.length;

        for (var i = 0; i < len; i++) {
            unitArray[i].tint = tint;
        }
    },
    

    neighbors: function (tile) {
        var dirs = [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1]
        ];
        var neighbors = [];

        var len = dirs.length
        for (var i = 0; i < dirs.length; i++) {
            var row = tile.row + dirs[i][0];
            var col = tile.col + dirs[i][1];
            if (row >= 0 && row <= grid.length - 1 && col >= 0 && col <= grid[0].length - 1) {
                neighbors.push(grid[row][col]);
            }
        }
        return neighbors;
    },

    turnAction: function (player) {
      this.drawRange(player);
        if (!player.didAttack){
          this.drawRangeAttack(player);
        }
        if (!player.didMove){
          this.drawRange(player);
        }
    },

    drawTarget: function(target){
      this.clearTarget();
      //targetTile = [];
      var tile = this.game.add.sprite(target.col * this.game.global.tileSize,
                                      target.row * this.game.global.tileSize,
                                      'tiles');
      tile.frame = 1;
      tile.tint = 0x0F00F0;
      tile.alpha = 0.5;

      targetTile.push(tile);
      //console.log(targetTile);
    },

    clearTarget: function(){
      //console.log(targetTile);
      for (var i = 0; i < targetTile.length; i++){
        targetTile[i].destroy();
        targetTile = [];
      }
    },

    drawRange: function (player) {
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
                if (!range[i].containsPlayer && !range[i].containsEnemy) {
                    tile.inputEnabled = true;

                    tile.events.onInputOver.add(function (tile, pointer) {
                        this.drawPath(grid[tile.row][tile.col], playerTile);
                        this.game.world.bringToTop(player);
                    }, this);

                    tile.events.onInputDown.add(function(tile, pointer) {
                        //player.inputEnabled = false;
                        this.clearPath();
                        this.clearDraw();
                        //actionCount += 1;
                        player.move(grid[tile.row][tile.col]);
                        //this.drawRangeAttack(player);
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
    },

    drawRangeAttack: function (player) {
        this.clearDraw();
        this.clearPath();
        var playerTile = grid[player.row][player.col];

        range = this.getRangeAttack(player);

        var len = range.length;
        for (var i = 0; i < len; i++) {
            if (range[i].depth <= player.moves) {
                var tile = this.game.add.sprite(range[i].col * this.game.global.tileSize,
                                                range[i].row * this.game.global.tileSize,
                                                'tiles');
                tile.frame = 1;
                tile.tint = 0xFF0000;
                tile.alpha = 0.7;
                tile.row = range[i].row;
                tile.col = range[i].col;
                drawn.push(tile);


                // TODO: this part of the code should be in a more logical place
                if (!range[i].containsPlayer && turn == 'player' || !range[i].containsEnemy && turn == 'enemy') {
                    tile.inputEnabled = true;

                    tile.events.onInputOver.add(function(tile, pointer) {
                        this.drawTarget(grid[tile.row][tile.col]);
                        this.game.world.bringToTop(player);
                    }, this);

                    tile.events.onInputDown.add(function(tile, pointer) {
                        player.inputEnabled = false;
                        if (grid[tile.row][tile.col].containsEnemy && turn == 'player') {
                          let target = this.getUnitToAttack(grid[tile.row][tile.col]);
                          console.log("player vs enemy");
                          target.updateHealth(-player.damage);
                          this.unitDidAttack(player);
                          this.clearDraw();
                          this.clearTarget();
                          //actionCount += 1;
                        } else if (grid[tile.row][tile.col].containsPlayer && turn == 'enemy') {
                          let target = this.getUnitToAttack(grid[tile.row][tile.col]);
                          console.log("enemy vs player");
                          target.updateHealth(-player.damage);
                          this.unitDidAttack(player);
                          this.clearDraw();
                          this.clearTarget();
                          //actionCount += 1;
                        } else {
                          console.log("no attack");
                          player.updateHealth(0);
                          this.unitDidAttack(player);
                          this.clearDraw();
                          this.clearTarget();
                        }
                    }, this);
                }
            } else {
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
    },

    drawPath: function (to, from) {
        this.clearPath();
        path = [];

        while (to != from) {
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
    },

    clearPath: function () {
        var len = path.length;

        for (var i = 0; i < len; i++) {
            path[i].destroy();
        }

        path = [];
    },

    getUnitToAttack: function (tile){
      if (turn == 'player') {
        for (var i = 0; i < enemyUnits.length; i++) {
          if (tile.row == enemyUnits[i].row && tile.col == enemyUnits[i].col ) {
            return enemyUnits[i];
          }
        }
      } else {
        for (var i = 0; i < playerUnits.length; i++) {
          if (tile.row == playerUnits[i].row && tile.col == playerUnits[i].col ) {
            return playerUnits[i];
          }
        }
      }
    },

    getRange: function (player) {
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

                if (neighbors[i].isObstacle || nextDepth > player.moves) {
                    nextDepth = Math.max(current.depth + 1, player.moves + 1);
                    if (nextDepth > player.moves + player.range) {
                        continue;
                    }
                }

                if (neighbors[i].containsEnemy || neighbors[i].containsPlayer) {
                    /*nextDepth = Math.max(current.depth + 1, player.moves + 1);
                    if (nextDepth > player.moves + player.range) {
                        continue;
                    }*/
                }

                if (nextDepth < neighbors[i].depth) {
                    neighbors[i].depth = nextDepth;
                    neighbors[i].cameFrom = current;
                    frontier.push(neighbors[i]);
                }
            }
        }

        return visited;
    },

    getRangeAttack: function (player) {
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

                if (neighbors[i].isObstacle || nextDepth > player.range) {
                    nextDepth = Math.max(current.depth + 1, player.range + 1);
                    if (nextDepth > player.range) {
                        continue;
                    }
                }

                if (neighbors[i].containsEnemy || neighbors[i].containsPlayer) {
                    /*nextDepth = Math.max(current.depth + 1, player.moves + 1);
                    if (nextDepth > player.moves + player.range) {
                        continue;
                    }*/
                }

                if (nextDepth < neighbors[i].depth) {
                    neighbors[i].depth = nextDepth;
                    neighbors[i].cameFrom = current;
                    frontier.push(neighbors[i]);
                }
            }
        }
        
        return visited;
    },

    // Clears the tiles that have been drawn
    // to represent the movement and attack ranges
    clearDraw: function () {
        var len = drawn.length;
        for (var i = 0; i < len; i++) {
            drawn[i].destroy();
            // TODO: Move this logic
        }

        drawn = [];
    },

    // TODO: Check where this actually needs to be called
    resetGrid: function () {
        for (var i = 0; i < grid.length; i++) {
            for (var j = 0; j < grid[0].length; j++) {
                grid[i][j].depth = Infinity;
            }
        }
    },

    unitDidMove: function (unit) {
        var unitArray;

        unit.didMove = true;
        if (unit.didAttack) {
          unit.tint = 0xAAAAAA;
        }


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

        /*if (turn == 'player') {
            this.enemyTurn();
        } else {
            this.playerTurn();
        }*/
    },

    unitDidAttack: function (unit) {
        var unitArray;

        unit.didAttack = true;
        unit.tint = 0xAAAAAA;

        if (unit.team == 'player') {
            unitArray = playerUnits;
        } else {
            unitArray = enemyUnits;
        }

        var len = unitArray.length;

        for (var i = 0; i < len; i++) {
            if (!unitArray[i].didAttack) {
                return;
            }
        }

        if (turn == 'player') {
            this.enemyTurn();
        } else {
            this.playerTurn();
        }
    },

    moveUnitsToTop: function () {
      if (turn == 'player'){
        var allUnits = playerUnits.concat(enemyUnits);

        var len = allUnits.length;
        for (var i = 0; i < len; i++) {
            this.game.world.bringToTop(allUnits[i]);
        }
      } else {
        var allUnits = enemyUnits.concat(playerUnits);

        var len = allUnits.length;
        for (var i = 0; i < len; i++) {
            this.game.world.bringToTop(allUnits[i]);
        }
      }

    }
};