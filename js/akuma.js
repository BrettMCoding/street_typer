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
Hadoken(scene, combo, RoundOver){
  this.akuma.anims.play('hadoken');
  console.log("fireball!");
  scene.time.delayedCall(200, this.Hadoken2, [this, scene]);

  if (RoundOver === true){
      this.akuma.anims.play('hadoken');
      console.log("fireball!");
      //scene.time.delayedCall(200, this.Hadoken2, [this, scene]);
      scene.time.addEvent({ delay: 200, callback: scene.PlayerCharacter.RoundOverCombo, args: [scene], repeat: combo - 1});

      scene.time.addEvent({ delay: 200, callback: scene.PlayerCharacter.Hadoken2, args: [scene.PlayerCharacter, scene], repeat: combo - 1});
  }
}

RoundOverCombo(scene) {
  scene.PlayerCharacter.akuma.anims.play('hadoken');
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