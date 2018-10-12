class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene'});
  }

  preload() {
    
  }

  create() {
    let width = this.sys.game.config.width
    let height = this.sys.game.config.height

    this.anims.create({
      key: "background",
      frames: [
        { key: "background1"},
        { key: "background2"},
        { key: "background3"},
        { key: "background4"},
        { key: "background5"},
        { key: "background6"},
        { key: "background7"},
        { key: "background8"}
      ],
      frameRate: 15,
      repeat: -1
    });
    this.background = this.add.sprite( width / 2, height / 2, "background" );

    this.background.play("background");

    this.logo = this.add.sprite( width / 2, height / 2 - 200, "logo")

    let playbutton = this.add.image(0, 0, 'playbutton');

    let helpbutton = this.add.image(0, 80, 'helpbutton')

    let memebutton = this.add.image(-80, 80, 'squarebutton');

    let buttoncontainer = this.add.container( width / 2, height / 2 + 50, [ playbutton, helpbutton ] );

    let menusound = this.sound.add('megamanmenu');

    playbutton.setInteractive();

    playbutton.on('pointerover', function () {

      playbutton.setTint(0x44ff44);
      menusound.play();

    });

    playbutton.on('pointerup', function () {

      this.scene.start('GameScene');

   }, this);

    playbutton.on('pointerout', function () {

      playbutton.clearTint();

    });

    helpbutton.setInteractive();

    helpbutton.on('pointerover', function () {

      helpbutton.setTint(0x44ff44);
      menusound.play();

    });

    helpbutton.on('pointerup', function () {

      this.scene.start('GameScene');

   }, this);

   helpbutton.on('pointerout', function () {

    helpbutton.clearTint();

    });
    
    // memescream can be a cheat code later
    ///////////////////////////////////////////////////////////////
    // X BUTTON TEST
    // memebutton.setInteractive();

    // memebutton.on('pointerover', function () {

    //   memebutton.setTint(0x44ff44);
    //   menusound.play();

    // });

    // memebutton.on('pointerup', function () { 
    //     if (memebutton.texture.key === "squarebutton") {
    //       memebutton.setTexture('squarebuttonx');
    //     } else {
    //       memebutton.setTexture('squarebutton');
    //     }
    //  }, this);

    // memebutton.on('pointerout', function () {

    //   memebutton.clearTint();

    // });
    //////////////////////////////////////////////////////////////////


    // this.input.manager.enabled = true;

    // this.input.once('pointerdown', function () {
    //   this.scene.start('GameScene');
    // }, this);
  }
}

export default MenuScene;