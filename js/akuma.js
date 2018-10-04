export default class PlayerCharacter {
  constructor(scene, x, y) {
    this.scene = scene;

    // Create Akuma
  this.akuma = scene.physics.add.sprite(x, y, 'akuma', 'AkumaClean_.png')
  .setScale(1.5);

  //  Player physics properties.
  this.akuma.setBounce(0.2);
  this.akuma.setCollideWorldBounds(true);

  // AKUMA GOSHORYU ANIMATION
  scene.frameNames = scene.anims.generateFrameNames('akuma', {
    // normal start: 246
    start: 248, end: 266,
    prefix: 'AkumaClean_', suffix: '.png'
  });
  scene.frameNames.push({ key:'akuma', frame:'AkumaClean_246.png' });
  scene.anims.create({ key: 'shoryuken', frames: scene.frameNames, frameRate: 20, repeat: 0 });

  // AKUMA HADOKEN ANIMATION
  scene.frameNames = scene.anims.generateFrameNames('akuma', {
    // normal start: 246
    start: 199, end: 203,
    prefix: 'AkumaClean_', suffix: '.png'
  });
  scene.anims.create({ key: 'hadoken', frames: scene.frameNames, frameRate: 20, repeat: 0, yoyo: true})
  
  
  // AKUMA WALK ANIMATION
  scene.frameNames = scene.anims.generateFrameNames('akuma', {
    start: 18, end: 28,
    prefix: 'AkumaClean_', suffix: '.png'
  });
  scene.anims.create({ key: 'idleright', frames: scene.frameNames, frameRate: 25, repeat: -1 });
  this.akuma.on('animationcomplete', this.BackToIdle, this);
  this.akuma.anims.play('idleright');

  // Hadoken
  this.hadoken = scene.physics.add.group();

    // // Create the animations we need from the player spritesheet
    // const anims = scene.anims;
    // anims.create({
    //   key: "player-idle",
    //   frames: anims.generateFrameNumbers("player", { start: 0, end: 3 }),
    //   frameRate: 3,
    //   repeat: -1
    // });

    // Create the physics-based sprite that we will move around and animate

  }

  freeze() {
    this.sprite.body.moves = false;
  }

  update() {
    
  }

  destroy() {
    this.sprite.destroy();
  }

  AkumaUppercut(scene) {
    scene.akuma.anims.play('shoryuken');
    //scene.akuma.setVelocityY(-700);
  }


// function AkumaStutter(scene) {
//   if (this.PlayerCharacter.akuma.anims.isPaused === false) {
//     this.PlayerCharacter.akuma.anims.pause();
//   } else {
//     this.PlayerCharacter.akuma.anims.resume();
//    }
// }

BackToIdle() {
  this.akuma.anims.play('idleright');
}

// Hadoken Animation
Hadoken(scene){
  this.akuma.anims.play('hadoken');
  scene.time.delayedCall(200, this.Hadoken2, [this, scene]);
}

// Hadoken construct / particles
Hadoken2(PlayerCharacter, scene) { 
  let hadoken = PlayerCharacter.hadoken.create(PlayerCharacter.akuma.getCenter().x + 100, PlayerCharacter.akuma.getCenter().y - 20, 'akuma', 'AkumaClean_207.png');
  hadoken.body.gravity.y = -(scene.physics.config.gravity.y)
  hadoken.body.width = 10;
  hadoken.setVelocityX(500);

  let particles = scene.particles.hadoken.createEmitter({
    x: PlayerCharacter.hadoken.x,
    y: PlayerCharacter.hadoken.y,
    lifespan: 500,
    quantity: 2,
    speed: { min: 40, max: 400 },
    angle: { min: 0, max: 270 },
    gravityY: 50,
    scale: { start: 0.4, end: 0 },
    blendMode: 'ADD',
    //on: false
  });
  particles.startFollow(hadoken);
 }
}