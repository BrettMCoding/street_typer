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

    this.setDepth(10);
    
    this.chunkOne = this.scene.particles.bossChunk.createEmitter({
      x: { min: -75, max: 100 },
      y: { min: -100, max: -400 },
      gravityY: 900,
      speed: {min:100, max:500},
      rotation: { min: 0, max: 700 },
      scale: { min: 1, max: 3 },
      quantity: { min: 1, max: 20 },
      on: false
      });
      this.chunkOne.startFollow(this);

    this.chunkTwo = this.scene.particles.bossChunkTwo.createEmitter({
      x: { min: -75, max: 100 },
      y: { min: -100, max: -400 },
      gravityY: 900,
      speed: {min:100, max:500},
      rotation: { min: 0, max: 700 },
      scale: { min: 1, max: 3 },
      quantity: { min: 1, max: 7 },
      on: false
      });
      this.chunkTwo.startFollow(this);

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

  emitHitParticles() {
    this.chunkOne.emitParticle();
    this.chunkTwo.emitParticle();
  }

  hitSound(scene){
    let sounds = [scene.sound.add('rockcrumble1').setVolume(.3),
                  scene.sound.add('rockcrumble2').setVolume(.3),
                  scene.sound.add('rockcrumble3').setVolume(.3)]
    sounds[Math.floor(Math.random() * 3)].play();
  }
}