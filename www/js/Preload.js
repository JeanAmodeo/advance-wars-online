Strategy.Preload = function(){};

Strategy.Preload.prototype = {
	preload: function() {
		// load textures
		this.load.spritesheet('tiles', 'assets/images/tiles.png', 16, 16, 3);
		this.load.spritesheet('units', 'assets/images/units.png', 16, 16, 3);
		this.load.image('healthbar', 'assets/images/healthbar.png');
	},
	
	create: function() {
		this.game.state.start('Game');

	},

};