let scene = new Phaser.Scene('Game');
var config = {
    type: Phaser.AUTO,
    width: 320,
    height: 240,
    // pixelArt: true,
    scene: scene
};

var tileSize = 16;

var path = [];
var drawn = [];

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
var units = [{
        moves: 5,
        range: 1,
        color: 0x00FF00,
        row: 1,
        col: 12,
        maxHealth: 10,
        team: 'player'
    },
    {
        moves: 4,
        range: 2,
        color: 0xFF00FF,
        row: 6,
        col: 9,
        maxHealth: 8,
        team: 'player'
    },
    {
        moves: 2,
        range: 1,
        color: 0xFF0000,
        row: 2,
        col: 2,
        maxHealth: 10,
        team: 'enemy'
    }
];

// keep track of all of the units
var playerUnits = [];
var enemyUnits = [];

let game = new Phaser.Game(config);

var Unit = new Phaser.Class({

    initialize: function Unit(scene, unitData) {
        Phaser.Sprite.call(this, scene, tileSize * unitData.col, tileSize * unitData.row, 'tiles');

        this.frame = 1;
        this.anchor.setTo(-0.5, -0.5);
        this.scale.setTo(0.5);
        this.color = unitData.color;
        this.tint = unitData.color;

        // copy parameters to instance variables
        this.row = unitData.row;
        this.col = unitData.col;
        this.moves = unitData.moves;
        this.range = unitData.range;
        this.team = unitData.team;
        this.health = unitData.maxHealth;
        this.maxHealth = unitData.maxHealth;

        if (this.team == 'player') {
            grid[this.row][this.col].containsPlayer = true;
            this.inputEnabled = false;

        } else {
            grid[this.row][this.col].containsEnemy = true;
        }

    }
})

var Tile = new Phaser.Class({
    Extends: Phaser.Physics.Arcade.Sprite,
    initialize: function Tile(scene, row, col, type) {
        Phaser.Physics.Arcade.Sprite.call(this, scene, tileSize * col, tileSize * row, 'tiles');

        // set instance variables
        this.frame = type
        this.isObstacle = !type;
        this.cost = type;
        this.row = row;
        this.col = col;

        scene.add.existing(this);
    }
})

scene.preload = function () {
    this.load.spritesheet('tiles', 'assets/images/tiles.png', {
        frameWidth: 16,
        frameHeight: 16
    });
    // this.load.image('healthbar', 'assets/images/healthbar.png');
}

scene.create = function () {
    var cols = this.sys.game.config.width/tileSize;
    var rows = this.sys.game.config.height/tileSize;

    for (var i = 0; i < rows; i++) {
        grid[i] = [];
        for (var j = 0; j < cols; j++) {
            grid[i][j] = new Tile (scene, i, j, map[i][j]);
            console.log(grid);
        }
    }


}