var ITile = new Phaser.Class({

  initialize:
  function ITile (scene, spritesheet, frame, x, y, size, isUnit = false, tint = null, unit = null){

    var sprite = scene.add.sprite(x, y, spritesheet, frame).setInteractive();

    sprite.x = x;
    sprite.y = y;
    if(isUnit){
      sprite.mvt = new Movement(scene, unit);
    }

    if(tint != null){
      sprite.tint = tint;
      sprite.basetint = tint;
      sprite.selected = false;
    }

    if(unit != null){
      sprite.unit = unit;
    }

    sprite.on('pointerdown', function (event) {
          if(sprite.unit != null){
            if(sprite.unit){
              if(sprite.selected){
                sprite.tint = sprite.basetint;
                sprite.selected = false;
                this.mvt.clear();
              } else {
                sprite.tint = 0x474747;
                sprite.selected = true;
                this.mvt.drawRange(scene);
              }
            }
          } else {
            console.log(event);
            this.setTint(0x00FFF0);
          }
      });

      sprite.on('pointerout', function (event) {
        if(sprite.unit != null){

        } else {
          sprite.tint = sprite.basetint;
        }
      });

      sprite.on('pointerup', function (event) {
        if(sprite.unit != null){

        } else {
          sprite.tint = sprite.basetint;
        }
      });
  },

});
