class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene'});
  }

  preload() {
    this.load.image("3rdStrike", './assets/img/3rdStrike.jpg');
  }

  create() {
    this.add.image(400, 300, "3rdStrike");

    this.input.manager.enabled = true;

    this.input.once('pointerdown', function () {
      this.scene.start('GameScene');
    }, this);
  }
}

export default BootScene;