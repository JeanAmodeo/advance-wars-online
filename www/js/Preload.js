Strategy.Preload = function(){};

Strategy.Preload.prototype = {
	preload: function() {
		// load textures
		this.load.spritesheet('tiles', 'assets/images/tiles.png', 16, 16, 4);
		this.load.spritesheet('units', 'assets/images/units.png', 16, 16, 3);
		this.load.spritesheet('sword', 'assets/images/sword.png', 16, 16, 3);
		this.load.spritesheet('bow', 'assets/images/bow.png', 16, 16, 3);
		this.load.spritesheet('wizard', 'assets/images/wizard.png', 16, 16, 3);
		this.load.spritesheet('water', 'assets/images/water.png', 16, 16, 3);
		this.load.image('healthbar', 'assets/images/healthbar.png');
		this.load.image('cursor', 'assets/images/cursor.png');
		// this.load.bitmapFont('gem', 'assets/fonts/gem.png', 'assets/fonts/gem.xml');
	
	
	},
	
	create: function() {
		this.game.state.start('Game');

	},

};