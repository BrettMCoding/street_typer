class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene'});
  }

  preload() {
    
  }

  create() {
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.bootScene = this.scene.get('BootScene');

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
    this.background = this.add.sprite( this.width / 2, this.height / 2, "background" );

    this.background.play("background");

    let muteTextHelp = this.add
      .text(20, this.height - 40, "PRESS SPACE TO MUTE MUSIC", {
        fontFamily: "arcade",
        fontSize: 30,
        fill: "#f8d838",
        padding: { x: 20, y: 10 }})
        .setStroke('#312088', 6);

    this.bootScene.createMusicMuter(this);

    this.logo = this.add.sprite( this.width / 2, this.height / 2 - 200, 'imgpack', 'logo')

    let playbutton = this.add.image(0, 0, 'imgpack', 'playbutton');

    let helpbutton = this.add.image(0, 80, 'imgpack', 'helpbutton');

    let memebutton = this.add.image(-80, 80, 'imgpack', 'squarebutton');

    let buttoncontainer = this.add.container( this.width / 2, this.height / 2 + 50, [ playbutton, helpbutton ] );

    let menusound = this.sound.add('megamanmenu');

    playbutton.setInteractive();

    playbutton.on('pointerover', function () {

      playbutton.setTint(0x44ff44);
      menusound.play();

    });

    playbutton.on('pointerdown', function () {

      this.scene.start('PreGameScene');

   }, this);

    playbutton.on('pointerout', function () {

      playbutton.clearTint();

    });

    helpbutton.setInteractive();

    helpbutton.on('pointerover', function () {

      helpbutton.setTint(0x44ff44);
      menusound.play();

    });

    helpbutton.on('pointerdown', function () {

      this.scene.start('HelpScene');

   }, this);

   helpbutton.on('pointerout', function () {

    helpbutton.clearTint();

    });
    
    // memescream can be a cheat code later
  }

  update() {
    this.bootScene.muteMusic(this);
  }
}

export default MenuScene;