var path = [];
var drawn = [];
var targetTile = [];

//checks who is playing
var playableTeam = "spectator";

// keep track of all of the tiles on the map
//0: water, 1: grass, 2: mountain, 3: castle
var grid = [];
var map = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 1, 0],
    [0, 1, 2, 2, 2, 1, 1, 1, 0, 2, 0, 1, 1, 1, 1, 1, 1, 1, 2, 0],
    [0, 1, 2, 2, 2, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 0],
    [0, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 0],
    [0, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 3, 3, 3, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 3, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 2, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

// list of units to create at the start of the game
//frame : which sprite is used
//moves : moving radius
//range : attack radius
//maxHealth : maximum health of the unit
//dmg : damage dealt when hit
//weakVs : half damage against this type of unit
//strVs : double damage against this type of unit
var types = [{
        name: 'sword',
        frame: 0,
        moves: 5,
        range: 2,
        maxHealth: 10,
        dmg: 3,
        weakVs: 'wizard',
        strVs: 'bow'
    },
    {
        name: 'bow',
        frame: 1,
        moves: 3,
        range: 6,
        maxHealth: 7,
        dmg: 2,
        weakVs: 'sword',
        strVs: 'wizard'
    },
    {
        name: 'wizard',
        frame: 2,
        moves: 4,
        range: 4,
        maxHealth: 5,
        dmg: 4,
        weakVs: 'bow',
        strVs: 'sword'
    },

];
//contains all the units spawning at the start
var units = [{
        id: 1,
        type: 'sword',
        row: 1,
        col: 12,
        team: 'player'
    },
    {
        id: 2,
        type: 'bow',
        row: 6,
        col: 12,
        team: 'player'
    },
    {
        id: 3,
        type: 'wizard',
        row: 2,
        col: 2,
        team: 'enemy'
    },
    {
        id: 4,
        type: 'wizard',
        row: 6,
        col: 7,
        team: 'enemy'
    },
    {
        id: 5,
        type: 'sword',
        row: 12,
        col: 6,
        team: 'enemy'
    },
    {
        id: 6,
        type: 'wizard',
        row: 10,
        col: 14,
        team: 'player'
    }
];

// contains all units separated between players
var playerUnits = [];
var enemyUnits = [];

//Damage multiplicators
const DMG_WEAK = 0.5;
const DMG_STRONG = 2;

// contains the current player
var turn = 'player';

//initialize game
Strategy.Game = function () {};

Unit = function (unitData) {

        Phaser.Sprite.call(this, Strategy.game, Strategy.game.global.tileSize * unitData.col, Strategy.game.global.tileSize * unitData.row, unitData.type);
        this.id = unitData.id;
        //applying texture to sprite
        switch (unitData.type) {
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

        //giving attributes to the new created unit
        this.type = type.name;
        this.frame = type.frame;
        this.moves = type.moves;
        this.range = type.range;
        this.dmg = type.dmg;
        this.maxHealth = type.maxHealth;
        this.weakVs = type.weakVs;
        this.strVs = type.strVs;

        //unit starting position
        this.row = unitData.row;
        this.col = unitData.col;

        this.team = unitData.team;
        this.health = type.maxHealth;

        //add unit idle animation, 5 frames/second looping
        var idle = this.animations.add('idle');
        this.animations.play('idle', 5, true);



        if (this.team == 'player') {
            grid[this.row][this.col].containsPlayer = true;
            this.inputEnabled = false;

        } else {
            grid[this.row][this.col].containsEnemy = true;
            this.inputEnabled = false;
        }

        //add new unit to game
        Strategy.game.add.existing(this);
    },

    Unit.prototype = Object.create(Phaser.Sprite.prototype);

Unit.prototype.constructor = Unit;


Unit.prototype.addHealthBar = function () {
    // Add red background to represent missing health
    var healthbarbg = this.game.add.sprite(0, -10, 'healthbar');
    healthbarbg.cropEnabled = true;
    healthbarbg.tint = 0xFF0000;

    // Add green foreground to repesent current health
    var healthbarfg = this.game.add.sprite(0, -10, 'healthbar');
    healthbarfg.cropEnabled = true;
    healthbarfg.tint = 0x00FF00;

    var healthNum = this.game.add.text(-3, -6, this.health);
    healthNum.anchor.setTo(0.5, 0.5);
    healthNum.fontSize = 12;
    healthNum.stroke = '#ffffff';
    healthNum.strokeThickness = 3;
    healthNum.font = 'Arial Black';


    // attach healthbar and health counter to unit
    this.addChild(healthbarbg);
    this.addChild(healthbarfg);
    this.addChild(healthNum);
}


Unit.prototype.updateHealth = function (healthDelta) {
    this.health += healthDelta;

    // get the width of the bar background (red part) to represent
    // maximum of health
    var maxWidth = this.getChildAt(0).width;

    // get the child healthbar foreground sprite
    var healthbarfg = this.getChildAt(1);

    //get the health counter
    var healthNum = this.getChildAt(2);


    // update the width based on fraction of health remaining
    healthbarfg.width = maxWidth * (this.health / this.maxHealth);
    healthNum.text = this.health;

    if (this.health <= 0) {
        //destroys unit if dead
        this.destroy();
        if (turn == 'enemy') {
            for (var i = 0; i < playerUnits.length; i++) {
                var obj = playerUnits[i];
                if (obj.id == this.id) {
                    playerUnits.splice(i, 1);
                    grid[this.row][this.col].containsPlayer = false;
                }
            }
        } else {
            for (var i = 0; i < enemyUnits.length; i++) {
                var obj = enemyUnits[i];
                if (obj.id == this.id) {
                    enemyUnits.splice(i, 1);
                    grid[this.row][this.col].containsEnemy = false;
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
    playerTween.onComplete.add(function () {
        Strategy.Game.prototype.unitDidMove(this);
    }, this);

    playerTween.start();

}

//Moves the unit to an x,y destination on the grid
Unit.prototype.move = function (x, y) {
    var to = grid[x][y];
    var unitPath = [];
    var from = grid[this.row][this.col];
    var newRow = to.row;
    var newCol = to.col;

    while (to != from) {
        unitPath.push(to);
        to = to.cameFrom;
    }

    this.followPath(unitPath);

    // update grid once unit moved
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

//move adapted to socket.io 
Unit.prototype.multiMove = function (x, y) {
    var to = grid[x][y];
    var from = grid[this.row][this.col];
    var newRow = to.row;
    var newCol = to.col;

    var distance = Phaser.Math.distance(this.row, this.col, x, y);
    var duration = distance * 200;
    var tween = this.game.add.tween(this);
    tween.to({
        x: y * 16,
        y: x * 16
    }, duration);
    tween.start();

    if (this.team == 'player') {
        grid[this.row][this.col].containsPlayer = false;
        grid[newRow][newCol].containsPlayer = true;
    } else {
        grid[this.row][this.col].containsEnemy = false;
        grid[newRow][newCol].containsEnemy = true;
    }

    // Unit gets new position
    this.row = newRow;
    this.col = newCol;
}

/* Creates a tile entity with:
 * row: starting row on grid
 * col: starting column on grid
 * type: type of tile  0: water, 1: grass, 2: mountain, 3: castle*/
Tile = function (row, col, type) {
    if (type != 0) {
        // create sprite
        Phaser.Sprite.call(this, Strategy.game, Strategy.game.global.tileSize * col, Strategy.game.global.tileSize * row, 'tiles');

        // set instance variables
        this.frame = type
        this.isObstacle = !type;
        this.cost = type;
        this.row = row;
        this.col = col;
    } else {
        // create sprite
        Phaser.Sprite.call(this, Strategy.game, Strategy.game.global.tileSize * col, Strategy.game.global.tileSize * row, 'water');
        //water tiles need specific treatment because of the animation

        // set instance variables
        this.frame = type
        this.isObstacle = !type;
        this.cost = type;
        this.row = row;
        this.col = col;
        var flow = this.animations.add('flow');
        this.animations.play('flow', 5, true);
    }

    this.depth = Infinity;

    // add sprite to game
    Strategy.game.add.existing(this);
}

Tile.prototype = Object.create(Phaser.Sprite.prototype);
Tile.prototype.constructor = Tile;

Strategy.Game.prototype = {

    create: function () {
        // set dimensions of the game
        this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        //Scale game 2 times and align
        this.scale.setUserScale(2, 2, 0, 0);
        this.scale.pageAlignVertically = true;
        this.game.stage.smoothed = false;

        //split the game in tileSize sized tiles
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
                playerUnits.push(unit);
            } else {
                unit.events.onInputDown.add(this.turnAction, this);
                enemyUnits.push(unit);
            }
        }
        //Queries a new player
        Client.askNewPlayer();
        //creates UI text
        this.createText();

    },

    createText: function () {
        //Bottom left, tells how much damage was inflicted with the last attack
        dmgText = Strategy.game.add.text(3, this.game.height - 3, '');
        dmgText.anchor.set(0, 1);
        dmgText.font = 'Arial Black';
        dmgText.fontSize = 30;
        dmgText.fontWeight = 'bold';
        dmgText.stroke = '#ffffff';
        dmgText.strokeThickness = 6;
        dmgText.fill = '#f44242';
        this.game.world.bringToTop(dmgText);

        //Remaining units of player 1 (top-left)
        playerText = Strategy.game.add.text(3, 0, playerUnits.length);
        playerText.anchor.set(0, 0);
        playerText.font = 'Arial Black';
        playerText.fontSize = 20;
        playerText.fontWeight = 'bold';
        playerText.stroke = '#f44242';
        playerText.strokeThickness = 6;
        playerText.fill = '#ffffff';

        //Remaining units of player 2 (top-right)
        enemyText = Strategy.game.add.text(this.game.width - 3, 0, enemyUnits.length);
        enemyText.anchor.set(1, 0);
        enemyText.font = 'Arial Black';
        enemyText.fontSize = 20;
        enemyText.fontWeight = 'bold';
        enemyText.stroke = '#ee70ff';
        enemyText.strokeThickness = 6;
        enemyText.fill = '#ffffff';

        //Team color, Red = Player 1, Purple = Player 2
        teamText = Strategy.game.add.text(this.game.width / 2, -2, playableTeam);
        teamText.anchor.set(0.5, 0);
        teamText.font = 'Arial Black';
        teamText.fontSize = 12;
        teamText.stroke = '#ffffff';
        teamText.strokeThickness = 6;
        teamText.fill = '#ffffff';

        //Player turn or enemy turn depending on the turn and playable variables
        turnText = Strategy.game.add.text(this.game.width - 2, this.game.height - 2, turn);
        turnText.anchor.set(1, 1);
        turnText.font = 'Arial Black';
        turnText.fontSize = 12;
        turnText.stroke = '#fffff';
        turnText.strokeThickness = 6;
        turnText.fill = '#ffffff';
    },

    //When unit counter reaches 0, displays the winning team and disables input
    win: function (team) {
        var color = '#f44242';
        if (team != "Red") color = '#ee70ff';

        //Draws rectangle dimming background
        graphics = Strategy.game.add.graphics(0, 0);
        rect = new Phaser.Polygon([new Phaser.Point(0, 0), new Phaser.Point(0, Strategy.game.height), new Phaser.Point(Strategy.game.width, Strategy.game.height), new Phaser.Point(Strategy.game.width, 0)]);
        graphics.alpha = 0.5;

        graphics.beginFill("#FF33ff");
        graphics.drawPolygon(rect.points);
        graphics.endFill();

        this.displayWinText(team, color);
        Strategy.game.input.enabled = false;
    },

    //Displays the winning team
    displayWinText: function (team, color) {
        winText = Strategy.game.add.text(Strategy.game.width / 2, Strategy.game.height / 2, team + "\nteam\nwins");
        winText.anchor.set(0.5, 0.5);
        winText.font = 'Courier';
        winText.fontSize = 40;
        winText.fontWeight = 'bold';
        winText.stroke = color;
        winText.strokeThickness = 6;
        winText.fill = '#ffffff';
        winText.align = "center";
    },

    //Updates a text and its fill color
    updateText: function (text, content, color) {
        text.setText(content);
        text.fill = color;
    },

    // Called when turn switches from enemy to player
    playerTurn: function () {
        turn = 'player';
        actionCount = 0;
        this.recolor(playerUnits, 0xffffff);
        this.recolor(enemyUnits, 0x808080);

        // make player units clickable to show range
        var len = playerUnits.length;
        for (var i = 0; i < len; i++) {
            var unit = playerUnits[i];
            unit.didMove = false;
            unit.didAttack = false;
            if (playableTeam == 'player') {
                unit.inputEnabled = true;
            }
        }
        //Update team color depending on the player side
        this.updateText(teamText, '\u25B0', (playableTeam == 'player' ? '#ff4242' : '#ee70ff'));
        if (turn == playableTeam) {
            this.updateText(turnText, "Your turn", '#1ce9ed');
        } else {
            this.updateText(turnText, "Enemy turn", '#ff3f3f');
        }
    },

    // Called when turn switches from player to enemy
    enemyTurn: function () {
        this.recolor(playerUnits, 0x808080);
        this.recolor(enemyUnits, 0xffffff);

        turn = 'enemy';
        actionCount = 0;
        // make player units clickable to show range
        var len = enemyUnits.length;
        for (var i = 0; i < len; i++) {
            var unit = enemyUnits[i];
            unit.didMove = false;
            unit.didAttack = false;
            if (playableTeam == 'enemy') {
                unit.inputEnabled = true;
            }
        }
        //Update team color depending on the player side
        this.updateText(teamText, '\u25B0', (playableTeam == 'enemy' ? '#ee70ff' : '#ff4242'));
        if (turn == playableTeam) {
            this.updateText(turnText, "Your turn", '#1ce9ed');
        } else {
            this.updateText(turnText, "Enemy turn", '#ff3f3f');
        }
    },

    //recolors a unit, greying it out our retablishing initial brightness
    recolor: function (unitArray, tint) {
        var len = unitArray.length;

        for (var i = 0; i < len; i++) {
            unitArray[i].tint = tint;
        }
    },

    //Gets neighbouring tiles from a given one 
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

    //Determines which range should be drawn, depending on the previous player action
    turnAction: function (player) {
        this.drawRange(player);
        if (!player.didAttack) {
            this.drawRangeAttack(player);
        }
        if (!player.didMove) {
            this.drawRange(player);
        }
    },

    drawTarget: function (target) {
        this.clearTarget();
        //targetTile = [];
        var tile = this.game.add.sprite(target.col * this.game.global.tileSize,
            target.row * this.game.global.tileSize,
            'tiles');
        tile.frame = 1;
        tile.tint = 0x0F00F0;
        tile.alpha = 0.5;

        targetTile.push(tile);
    },

    clearTarget: function () {
        for (var i = 0; i < targetTile.length; i++) {
            targetTile[i].destroy();
            targetTile = [];
        }
    },

    //Draws the movement range for a given unit
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

                if (!range[i].containsPlayer && !range[i].containsEnemy) {
                    //Disables clicking if tile is occupied by enemy
                    tile.inputEnabled = true;

                    tile.events.onInputOver.add(function (tile, pointer) {
                        this.drawPath(grid[tile.row][tile.col], playerTile);
                        this.game.world.bringToTop(player);
                    }, this);

                    tile.events.onInputDown.add(function (tile, pointer) {
                        this.clearPath();
                        this.clearDraw();
                        player.move(tile.row, tile.col);
                        //Makes a request to have the unit move through socket.io
                        Client.moveUnitRequest(player.id, tile.row, tile.col);
                    }, this);
                }
            } else {
                //Colors the tiles
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
        //Units get above the drawn range
        this.moveUnitsToTop();
    },

    //Draws the attack range for a given unit
    drawRangeAttack: function (player) {
        this.clearDraw();
        this.clearPath();
        var playerTile = grid[player.row][player.col];
        //Damage is initially set to 1
        var dmgMult = 1;
        var totDmg = 0;
        //This is the base color of the damage text
        var color = '#ff3f3f';

        range = this.getRangeAttack(player);

        var len = range.length;
        for (var i = 0; i < len; i++) {
            if (range[i].depth <= player.range) {
                //Draws the actual attack range
                var tile = this.game.add.sprite(range[i].col * this.game.global.tileSize,
                    range[i].row * this.game.global.tileSize,
                    'tiles');
                tile.frame = 1;
                tile.tint = 0xFF0000;
                tile.alpha = 0.7;
                tile.row = range[i].row;
                tile.col = range[i].col;
                drawn.push(tile);

                if (!range[i].containsPlayer && turn == 'player' || !range[i].containsEnemy && turn == 'enemy') {
                    //Player can click only if tile doesnt contain a friendly unit
                    //Clicking on an empty tile results in skipping the turn
                    tile.inputEnabled = true;

                    tile.events.onInputOver.add(function (tile, pointer) {
                        this.drawTarget(grid[tile.row][tile.col]);
                        this.game.world.bringToTop(player);
                    }, this);

                    tile.events.onInputDown.add(function (tile, pointer) {
                        player.inputEnabled = false;
                        //Same process for an enemy(player 2) unit
                        if (grid[tile.row][tile.col].containsEnemy && turn == 'player') {
                            let target = this.getUnitToAttack(grid[tile.row][tile.col]);
                            //Checks unit relation to the target : weak against, string against, or neutral
                            if (target.type == player.weakVs) {
                                dmgMult = DMG_WEAK;
                                color = '#1ce9ed'
                            }
                            if (target.type == player.strVs) {
                                dmgMult = DMG_STRONG;
                                color = '#ffe019';
                            }
                            //Total damage is reduced to closest integer
                            totDmg = Math.trunc(-player.dmg * dmgMult);
                            target.updateHealth(totDmg);
                            //Displays damage text
                            this.updateText(dmgText, Math.abs(totDmg), color);

                            this.unitDidAttack(player);
                            this.clearDraw();
                            this.clearTarget();
                            //Allows socket.io to take the attack in account
                            Client.attackUnitRequest(target.id, player.id);

                        } else if (grid[tile.row][tile.col].containsPlayer && turn == 'enemy') {
                            let target = this.getUnitToAttack(grid[tile.row][tile.col]);

                            if (target.type == player.weakVs) {
                                dmgMult = DMG_WEAK;
                                color = '#1ce9ed'
                            }
                            if (target.type == player.strVs) {
                                dmgMult = DMG_STRONG;
                                color = '#ffe019';
                            }
                            totDmg = Math.trunc(-player.dmg * dmgMult);
                            target.updateHealth(totDmg);
                            this.updateText(dmgText, Math.abs(totDmg), color);

                            this.unitDidAttack(player);
                            this.clearDraw();
                            this.clearTarget();
                            Client.attackUnitRequest(target.id, player.id);
                        } else {
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

    //Draws the path the unit will take when moving to target
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

        var tile = this.game.add.sprite(from.col * this.game.global.tileSize,
            from.row * this.game.global.tileSize,
            'tiles');
        tile.frame = 1;
        tile.tint = 0x00FF00;
        tile.alpha = 0.5;
        path.push(tile);
    },

    //Deletes the path
    clearPath: function () {
        var len = path.length;
        for (var i = 0; i < len; i++) {
            path[i].destroy();
        }

        path = [];
    },

    //Gets targetted unit information with row and col 
    getUnitToAttack: function (tile) {
        if (turn == 'player') {
            for (var i = 0; i < enemyUnits.length; i++) {
                if (tile.row == enemyUnits[i].row && tile.col == enemyUnits[i].col) {
                    return enemyUnits[i];
                }
            }
        } else {
            for (var i = 0; i < playerUnits.length; i++) {
                if (tile.row == playerUnits[i].row && tile.col == playerUnits[i].col) {
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
        }

        drawn = [];
    },

    resetGrid: function () {
        for (var i = 0; i < grid.length; i++) {
            for (var j = 0; j < grid[0].length; j++) {
                grid[i][j].depth = Infinity;
            }
        }
    },

    //Tells that unit has moved during the turn
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
    },

    //Tells that unit has attacked during the turn
    unitDidAttack: function (unit) {
        var unitArray;
        enemyText.setText(enemyUnits.length);
        playerText.setText(playerUnits.length);

        unit.didAttack = true;
        unit.tint = 0xAAAAAA;

        if (unit.team == 'player') {
            unitArray = playerUnits;
        } else {
            unitArray = enemyUnits;
        }

        var len = unitArray.length;
        //Checks if one of the players has won after this attack
        if (playerUnits.length == 0)
            this.win('Purple');
        if (enemyUnits.length == 0)
            this.win('Red');

        for (var i = 0; i < len; i++) {
            if (!unitArray[i].didAttack) {
                return;
            }
        }
        if (turn == 'player') {
            this.enemyTurn();
            Client.changeTurn('enemy');
        } else {
            this.playerTurn();
            Client.changeTurn('player');
        }
    },

    //Moves units above the drawn ranges
    moveUnitsToTop: function () {
        if (turn == 'player') {
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
    },

    debug: function () {
        console.log('debug');
    },

    getTurn: function () {
        return turn;
    },

    setTurn: function (t) {
        if (t == 'player') {
            this.playerTurn();
        } else {
            this.enemyTurn();
        }
    },

    addNewPlayer: function (id, team) {
        playableTeam = team;
    },

    //Move Unit adapted to socket.io with the necessary info
    multiMoveUnit: function (data) {

        let playerID = data.player;
        let player = null;

        if (turn == 'player') {
            for (var i = 0; i < playerUnits.length; i++) {
                var obj = playerUnits[i];
                if (obj.id == playerID) {
                    player = obj;
                }
            }
        } else {
            for (var i = 0; i < enemyUnits.length; i++) {
                var obj = enemyUnits[i];
                if (obj.id == playerID) {
                    player = obj;
                }
            }
        }

        let x = data.x;
        let y = data.y;

        player.multiMove(x, y);
    },


    //Attack unit adapted to socet.io with the neccesary info
    multiAttackUnit: function (data) {
        let targetID = data.target;
        let playerID = data.player;
        var dmgMult = 1;
        var color = '#ff3f3f';
        var totDmg = 0;
        var player = null;
        var target = null;

        if (turn == 'player') {
            for (var i = 0; i < playerUnits.length; i++) {
                var obj = playerUnits[i];
                if (obj.id == playerID) {
                    player = obj;
                }
            }
        } else {
            for (var i = 0; i < enemyUnits.length; i++) {
                var obj = enemyUnits[i];
                if (obj.id == playerID) {
                    player = obj;
                }
            }
        }

        if (turn == 'enemy') {
            for (var i = 0; i < playerUnits.length; i++) {
                var obj = playerUnits[i];
                if (obj.id == targetID) {
                    target = obj;
                }
            }
        } else {
            for (var i = 0; i < enemyUnits.length; i++) {
                var obj = enemyUnits[i];
                if (obj.id == targetID) {
                    target = obj;
                }
            }
        }

        if (target.type == player.weakVs) {
            dmgMult = DMG_WEAK;
            color = '#1ce9ed'
        }
        if (target.type == player.strVs) {
            dmgMult = DMG_STRONG;
            color = '#ffe019';
        }

        totDmg = Math.trunc(-player.dmg * dmgMult);
        this.updateText(dmgText, Math.abs(totDmg), color);
        target.updateHealth(totDmg);
        enemyText.setText(enemyUnits.length);
        playerText.setText(playerUnits.length);
        if (playerUnits.length == 0)
            this.win('Purple');
        if (enemyUnits.length == 0)
            this.win('Red');
    },

};