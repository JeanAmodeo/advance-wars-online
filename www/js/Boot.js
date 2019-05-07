var Strategy = Strategy || {};

Strategy.Boot = function () {};

Strategy.Boot.prototype = {

    init: function () {
        //disable multi touch
        this.input.maxPointers = 1;

        // Automatically pause if the game loses focus.
        this.stage.disableVisibilityChange = true;

        if (this.game.device.desktop) {
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
        } else {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.setMinMax(480, 260, 1024, 768);
            this.scale.forceLandscape = true;
            this.scale.pageAlignHorizontally = true;
        }

    },

    preload: function () {},
    create: function () {
        this.state.start('Preload');
    }
};