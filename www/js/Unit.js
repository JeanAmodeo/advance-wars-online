var Unit = new Phaser.Class({

  initialize:
  function Unit (scene, unitData, grid){
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

    this.grid = grid;

    var ptile = new ITile(scene, 'tiles', this.frame, 8+this.col*16, 8+this.row*16, 16, true, this.tint, this);

    // mark the starting tile as containing a player or enemy
    // based on the team of the unit
    if (this.team == 'player') {
        grid[this.row][this.col].containsPlayer = true;
        this.inputEnabled = false;

    } else {
        grid[this.row][this.col].containsEnemy = true;
    }
  },

});
