var Movement = new Phaser.Class({

  initialize:
  function Movement (scene, unit){
    this.range = unit.range;
    this.startX = unit.col;
    this.startY = unit.row;
    this.mGroup = scene.add.group();
  },

  drawRange: function(scene){
    for (var i = 1; i < this.range+1; i++) {
      var px = this.startX+i;
      var mx = this.startX-i;
      for (var j = 1; j < this.range+1; j++) {
        var py = this.startY+j;
        var my = this.startY-j;

        var sp1 = scene.add.sprite(8+px*16, 8+py*16, 'tiles', 1);
        var sp2 = scene.add.sprite(8+px*16, 8+my*16, 'tiles', 1);
        var sp3 = scene.add.sprite(8+mx*16, 8+py*16, 'tiles', 1);
        var sp4 = scene.add.sprite(8+mx*16, 8+my*16, 'tiles', 1);

        sp1.tint = 0x00FF00;
        sp2.tint = 0x00FF00;
        sp3.tint = 0x00FF00;
        sp4.tint = 0x00FF00;

        this.mGroup.add(sp1);
        this.mGroup.add(sp2);
        this.mGroup.add(sp3);
        this.mGroup.add(sp4);
      }
    }
    console.log(this.mGroup);
  },

  getGroup: function(){
    console.log(this.mGroup);
  },

  clear: function(scene){
    this.mGroup.clear(true, true);

  },

});
