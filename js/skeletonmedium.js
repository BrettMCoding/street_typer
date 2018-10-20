export default class Skeleton {
  constructor(scene, x, y) {
  // Create skeleton
  this.skeletonmedium = scene.physics.add.sprite(x, y, 'skeletonmedium', 'skeletonmedium_33.png');

    scene.frameNames = scene.anims.generateFrameNames('idle', {
      start: 31, end: 33,
      prefix: 'skeletonmedium_', suffix: '.png'
    });

    scene.anims.create({ key: 'idle', frames: scene.frameNames, frameRate: 8, repeat: -1 });

    this.skeletonmedium.anims.play('idle');

  // // SUMMON ANIMATION
  // scene.frameNames = scene.anims.generateFrameNames('boss', {
  //   // messy unshift calls to bypass octal literals strict mode error
  //   start: 43, end: 61,
  //   prefix: 'anakaris_', suffix: '.png'
  // });

  // scene.anims.create({ key: 'summon', frames: scene.frameNames, frameRate: 40, yoyo: true});

  // // DEATH ANIMATION
  // scene.frameNames = scene.anims.generateFrameNames('boss', {
  //   start: 98, end: 100,
  //   prefix: 'anakaris_', suffix: '.png'
  // }); 

  // scene.anims.create({ key: 'death', frames: scene.frameNames, frameRate: 0.5 });

  }

  destroy() {
    this.sprite.destroy();
  }
  
  // After any animation, resume playing idle animation
  BackToIdle() {
    this.boss.anims.play('idle');
  }
}