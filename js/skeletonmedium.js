export default class Skeleton extends Phaser.GameObjects.Sprite {
  constructor(config) {

    super(config.scene, config.x, config.y, 'skeletonmedium');
    
    config.scene.physics.world.enable(this);

    this.scene = config.scene;

    this.setFrame('skeletonmedium_33.png')

    this.anims.play('skeletonmediumidle');

    this.on('animationcomplete', this.BackToIdle, this);

    this.scene.add.existing(this);



  // // DEATH ANIMATION
  // scene.frameNames = scene.anims.generateFrameNames('boss', {
  //   start: 98, end: 100,
  //   prefix: 'anakaris_', suffix: '.png'
  // }); 

  // scene.anims.create({ key: 'death', frames: scene.frameNames, frameRate: 0.5 });

  }

  // After any animation, resume playing idle animation
  BackToIdle() {
    this.anims.play('skeletonmediumidle');
  }
}