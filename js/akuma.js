export default class PlayerCharacter {
  constructor(scene, x, y) {
    this.scene = scene;

  // Create Akuma
  this.akuma = scene.physics.add.sprite(x, y, 'akuma', 'AkumaClean_.png')
    .setScale(1.5)
    .setBounce(0.2)
    .setCollideWorldBounds(true);

  // AKUMA GOSHORYU ANIMATION
  scene.frameNames = scene.anims.generateFrameNames('akuma', {
    start: 248, end: 266,
    prefix: 'AkumaClean_', suffix: '.png'
  });
  scene.frameNames.push({ key:'akuma', frame:'AkumaClean_246.png' });
  scene.anims.create({ key: 'shoryuken', frames: scene.frameNames, frameRate: 20, repeat: 0 });

  // AKUMA SUPERCHARGE ANIMATION
  scene.frameNames = scene.anims.generateFrameNames('akuma', {
    // messy unshift calls to bypass octal literals strict mode error
    start: 10, end: 17,
    prefix: 'AkumaClean_', suffix: '.png'
  }); let b=scene.frameNames;b.unshift({ key:'akuma', frame:'AkumaClean_09.png' });b.unshift({ key:'akuma', frame:'AkumaClean_08.png' });b.unshift({ key:'akuma', frame:'AkumaClean_07.png' });b.unshift({ key:'akuma', frame:'AkumaClean_06.png' });b.unshift({ key:'akuma', frame:'AkumaClean_05.png' });b.unshift({ key:'akuma', frame:'AkumaClean_04.png' });b.unshift({ key:'akuma', frame:'AkumaClean_03.png' });

  scene.anims.create({ key: 'supercharge', frames: scene.frameNames, frameRate: 20  , yoyo: true});

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
  scene.anims.create({ key: 'idleright', frames: scene.frameNames, frameRate: 15, repeat: -1 });
  this.akuma.anims.play('idleright');
  this.akuma.on('animationcomplete', this.BackToIdle, this);

  // AKUMA LIGHT PUNCH ANIMATION
  scene.frameNames = scene.anims.generateFrameNames('akuma', {
    start: 89, end: 91,
    prefix: 'AkumaClean_', suffix: '.png'
  });
  scene.anims.create({ key: 'lightpunch', frames: scene.frameNames, frameRate: 25, repeat: 0 });

  // AKUMA MEDIUM PUNCH ANIMATION
  scene.frameNames = scene.anims.generateFrameNames('akuma', {
    start: 93, end: 97,
    prefix: 'AkumaClean_', suffix: '.png'
  });
  scene.anims.create({ key: 'standinguppercut', frames: scene.frameNames, frameRate: 25, repeat: 0 });

  // AKUMA FIERCE PUNCH ANIMATION
  scene.frameNames = scene.anims.generateFrameNames('akuma', {
    start: 99, end: 103,
    prefix: 'AkumaClean_', suffix: '.png'
  });
  scene.anims.create({ key: 'fiercepunch', frames: scene.frameNames, frameRate: 25, repeat: 0 });

  // AKUMA LIGHT KICK ANIMATION
  scene.frameNames = scene.anims.generateFrameNames('akuma', {
    start: 105, end: 109,
    prefix: 'AkumaClean_', suffix: '.png'
  });
  scene.anims.create({ key: 'lightkick', frames: scene.frameNames, frameRate: 25, repeat: 0 });

  // AKUMA MEDIUM KICK ANIMATION
  scene.frameNames = scene.anims.generateFrameNames('akuma', {
    start: 111, end: 114,
    prefix: 'AkumaClean_', suffix: '.png'
  });
  scene.anims.create({ key: 'mediumkick', frames: scene.frameNames, frameRate: 25, repeat: 0 });

  // AKUMA HEAVY KICK ANIMATION
  scene.frameNames = scene.anims.generateFrameNames('akuma', {
    start: 115, end: 120,
    prefix: 'AkumaClean_', suffix: '.png'
  });
  scene.anims.create({ key: 'heavykick', frames: scene.frameNames, frameRate: 25, repeat: 0 });

  // AKUMA OVERHEAD ANIMATION
  scene.frameNames = scene.anims.generateFrameNames('akuma', {
    start: 122, end: 128,
    prefix: 'AkumaClean_', suffix: '.png'
  });
  scene.anims.create({ key: 'overhead', frames: scene.frameNames, frameRate: 25, repeat: 0 });

  // Array of string names of attack animations to be used as keys later
  this.akuma.attackNames = ['shoryuken', 'lightpunch', 'mediumpunch', 'fiercepunch', 'lightkick', 'mediumkick', 'heavykick', 'overhead'];

  // Hadoken physical body (now set to invisible and used as hit detection)
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

  // JUST FOR FUN: Space to uppercut
  AkumaUppercut(scene, self) {
    self = this;
    let superSound = scene.sound.add('super');
    superSound.play();

    scene.background.setTint(0x9f00bc);

    scene.particles.vortex.emitParticle();
    scene.particles.vortex2.emitParticle();

    this.akuma.anims.play('supercharge');

    scene.lazer.anims.delayedPlay(400,'blast');
    scene.lazer2.anims.delayedPlay(650,'blast');

    //scene.comboContainer.x = this.timertext.x
    //scene.comboContainer.y = this.timertext.y

    scene.time.addEvent({ delay: 1000, callback: this.superCombo, args: [scene, self]});

    //this.akuma.setVelocityY(-700);
  }

// After any animation, resume playing idle animation
BackToIdle() {
  this.akuma.anims.play('idleright');
}

// Main attack function. Calls a random animation, and creates a hadoken projectile.
// The sound effect and particles are tied to the hitSkeleton function
akumaAttack(scene) {
  this.randomAttackAnimation(scene);

  scene.time.delayedCall(100, this.createHadokenProjectile, [this, scene]);
}

// At the end of the round, do an attack for every word in combo
superCombo(scene, self) {
  scene.background.setTint(0xffffff);
  
  // Add a delayed call to randomAttackAnimation that repeats (combo) times
  scene.time.addEvent({ delay: 200, callback: self.randomAttackAnimation, args: [scene], repeat: scene.combo - 1});
  // Add a delayed call to createHadokenProjectile that repeats (combo) times
  scene.time.addEvent({ delay: 200, callback: self.createHadokenProjectile, args: [self, scene], repeat: scene.combo - 1});
  // Add a delayed call to createHadokenProjectile that repeats (combo) times
  scene.time.addEvent({ delay: 200, callback: self.superComboTally, args: [self, scene], repeat: scene.combo - 1});
}

// Random attack animation
randomAttackAnimation(scene, self) {
  const shakecam = scene.cameras.add().setName('shakecam');
  shakecam.shake(100, 0.01);
  let attack = scene.PlayerCharacter.akuma.attackNames;
  scene.PlayerCharacter.akuma.anims.play(attack[Math.floor(Math.random() * attack.length)]);
}

superComboTally(self, scene) {
  scene.comboContainer.setVisible(true);

  scene.particles.fire.emitParticleAt(scene.comboContainer.x + 115, scene.comboContainer.y + 160);

  scene.roundEndCombo += 1
  scene.combotext.setText(scene.roundEndCombo);
  // Player combotext animation
  scene.combotween.restart();
}

// Hadoken construct
createHadokenProjectile(PlayerCharacter, scene) { 
  let hadoken = PlayerCharacter.hadoken.create(PlayerCharacter.akuma.getCenter().x + 100, PlayerCharacter.akuma.getCenter().y - 20, 'akuma', 'AkumaClean_207.png');
  hadoken.body.gravity.y = -(scene.physics.config.gravity.y)
  hadoken.body.width = 100;
  hadoken.setVelocityX(500);
  }
}