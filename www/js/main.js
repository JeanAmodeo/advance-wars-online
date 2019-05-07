var Strategy = Strategy || {};

Strategy.game = new Phaser.Game(320, 240, Phaser.AUTO, 'gameContainer',null, false, false);

Strategy.game.global = {
	tileSize : 16,
};

Strategy.game.state.add('Boot', Strategy.Boot);
Strategy.game.state.add('Preload', Strategy.Preload);
Strategy.game.state.add('Game', Strategy.Game);

Strategy.game.state.start('Boot');