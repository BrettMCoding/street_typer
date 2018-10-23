export default class Boss extends Phaser.GameObjects.Sprite {
  constructor(config) {

    super(config.scene, config.x, config.y, 'boss');

    config.scene.physics.world.enable(this);

    this.scene = config.scene;

    this.body.setBounce(0.2)

             .setGravityY(-950);

    this.setOrigin(0.5);

    this.anims.play('bossidle');

    this.on('animationcomplete', this.BackToIdle, this);
    
    this.scene.add.existing(this);
  }

  deathEvent(scene) {

    scene.boss.anims.currentAnim.pause();

    scene.boss.body.setVelocity(0).setGravityY(-1000);

    scene.boss.setTint(0xff7373);

    let bossdeath = scene.sound.add('bossdeath');
        bossdeath.play();

    scene.tweens.add({
      targets: scene.boss,
      alpha: { value: 0, duration: 5000, ease: 'Power1'},
    });
  }
  
  // After any animation, resume playing idle animation
  BackToIdle() {
    this.anims.play('bossidle');
  }
}