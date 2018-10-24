class HelpScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HelpScene'});
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

    let helpText = "TYPE  THE  WORD  THAT  APPEARS  IN  THE  CENTER  OF  THE  SCREEN\n" +
                    " TO  ATTACK  THE  SKELETON.  A  NEW  WORD  WILL  INSTANTLY  APPEAR.\n" +
                    " REPEAT  THIS  PROCESS  AND  BULD  UP  YOUR  COMBO  AND  SCORE.\n" +
                    " AFTER  60  SECONDS,  YOU  WILL  EXECUTE  A  SUPER  COMBO  TO\n" +
                    " DEFEAT  THE  BOSS.  GOOD  LUCK!  NOBODY  IS  COUNTING  ON  YOU!";

    this.add
      .text(210, 200, (helpText), {
        fontFamily: "arcade",
        fontSize: 30,
        fill: "#ffffff",
        padding: { x: 20, y: 10 },
        originX : 0.5
      }).setStroke('#312088', 6)
      .setDepth(10);

    let menusound = this.sound.add('megamanmenu');

    let xButton = this.add.image(200, 200, 'squarebuttonx');

    xButton.setScale(1.3)
           .setInteractive();

    xButton.on('pointerover', function () {

      xButton.setTint(0x44ff44);
      menusound.play();

    });
    
    xButton.on('pointerdown', function () {

      this.scene.start('MenuScene');

    }, this);

    xButton.on('pointerout', function () {

      xButton.clearTint();

    });
  }
}

export default HelpScene;