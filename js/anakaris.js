export default class Boss {
  constructor(scene, x, y) {
    this.scene = scene;

  // Create boss
  this.boss = scene.physics.add.sprite(x, y, 'boss', 'anakaris_1.png')
    .setBounce(0.2)
    .setOrigin(0.5);
    this.boss.body.gravity.y = -950;

    scene.frameNames = scene.anims.generateFrameNames('boss', {
      start: 1, end: 24,
      prefix: 'anakaris_', suffix: '.png'
    });

    scene.anims.create({ key: 'idle', frames: scene.frameNames, frameRate: 15, repeat: -1 });

    this.boss.anims.play('idle');
    this.boss.on('animationcomplete', this.BackToIdle, this);

  // SUMMON ANIMATION
  scene.frameNames = scene.anims.generateFrameNames('boss', {
    // messy unshift calls to bypass octal literals strict mode error
    start: 43, end: 61,
    prefix: 'anakaris_', suffix: '.png'
  }); 

  scene.anims.create({ key: 'summon', frames: scene.frameNames, frameRate: 40, yoyo: true});

  // HIT ANIMATION
  scene.frameNames = scene.anims.generateFrameNames('boss', {
    start: 73, end: 74,
    prefix: 'anakaris_', suffix: '.png'
  }); 

  scene.anims.create({ key: 'hit1', frames: scene.frameNames, frameRate: 60, yoyo: true })

  // DEATH ANIMATION
  scene.frameNames = scene.anims.generateFrameNames('boss', {
    start: 98, end: 100,
    prefix: 'anakaris_', suffix: '.png'
  }); 

  scene.anims.create({ key: 'death', frames: scene.frameNames, frameRate: 0.5 });

  }

  destroy() {
    this.sprite.destroy();
  }

  deathEvent(scene) {

    scene.boss.boss.anims.currentAnim.pause();
    scene.boss.boss.setVelocity(0).setGravityY(-1000);
    scene.boss.boss.setTint(0xff7373);

    let bossdeath = scene.sound.add('bossdeath');
    bossdeath.play();

    scene.tweens.add({
      targets: scene.boss.boss,
      alpha: { value: 0, duration: 5000, ease: 'Power1'},
    });
  }
  
  // After any animation, resume playing idle animation
  BackToIdle() {
    this.boss.anims.play('idle');
  }
}