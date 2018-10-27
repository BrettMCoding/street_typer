export default class Skeleton extends Phaser.GameObjects.Sprite {
  constructor(config) {

    super(config.scene, config.x, config.y, 'skeletonmedium');
    
    config.scene.physics.world.enable(this);

    this.scene = config.scene;

    this.setFrame('skeletonmedium_33.png')

    this.anims.play('skeletonmediumidle');

    this.on('animationcomplete', this.BackToIdle, this);

    // Emitters
    this.bone = this.scene.particles.bone.createEmitter({
      x: { min: -25, max: 25},
      y: { min: -300, max: 0 },
      lifespan: 2000,
      quantity: {min: 20, max: 30},
      speed: { min: 150, max: 1000 },
      angle: { min: 0, max: -120 },
      rotate: { start:0, end:360, ease: 'Back.easeOut'},
      gravityY: 700,
      scale: { min: 0.10, max: 1 },
      //blendMode: 'ADD',
      on: false
      });
      this.bone.startFollow(this);

    this.bloodchunk = this.scene.particles.bloodchunk.createEmitter({
      x: { min: -25, max: 25},
      y: { min: -300, max: 0 },
      lifespan: {min: 300, max: 2000},
      quantity: {min: 20, max: 30},
      speed: { min: 350, max: 600 },
      angle: { min: 180, max: 440 },
      rotate: { start:0, end:360, ease: 'Back.easeOut'},
      gravityY: 700,
      scale: { start: 0.1, end: 0.004 },
      //blendMode: 'ADD',
      on: false
      });
      this.bloodchunk.startFollow(this);

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

  emitHitParticles() {
    this.bone.emitParticle();
    this.bloodchunk.emitParticle();
  }
}