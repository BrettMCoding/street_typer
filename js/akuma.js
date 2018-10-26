export default class PlayerCharacter {
  constructor(scene, x, y) {

  // Create Akuma
  this.akuma = scene.physics.add.sprite(x, y, 'akuma', 'AkumaClean_.png')
    .setScale(2.5)
    .setBounce(0.2)
    .setCollideWorldBounds(true)
    .setDepth(11)
    this.akuma.body.gravity.y = -950;

  // AKUMA GOSHORYU ANIMATION
  scene.frameNames = scene.anims.generateFrameNames('akuma', {
    start: 248, end: 266,
    prefix: 'AkumaClean_', suffix: '.png'
  });
  scene.frameNames.push({ key:'akuma', frame:'AkumaClean_246.png' });
  scene.anims.create({ key: 'shoryuken', frames: scene.frameNames, frameRate: 3.6, repeat: 0 });

  // AKUMA SUPERCHARGE ANIMATION
  scene.frameNames = scene.anims.generateFrameNames('akuma', {
    // messy unshift calls to bypass octal literals strict mode error
    start: 10, end: 17,
    prefix: 'AkumaClean_', suffix: '.png'
  }); let b=scene.frameNames;b.unshift({ key:'akuma', frame:'AkumaClean_09.png' });b.unshift({ key:'akuma', frame:'AkumaClean_08.png' });b.unshift({ key:'akuma', frame:'AkumaClean_07.png' });b.unshift({ key:'akuma', frame:'AkumaClean_06.png' });b.unshift({ key:'akuma', frame:'AkumaClean_05.png' });b.unshift({ key:'akuma', frame:'AkumaClean_04.png' });b.unshift({ key:'akuma', frame:'AkumaClean_03.png' });

  scene.anims.create({ key: 'supercharge', frames: scene.frameNames, frameRate: 20  , yoyo: true});

  // AKUMA SUPERCHARGE IMAGE
  scene.frameNames = scene.anims.generateFrameNames('akuma', {
    start: 15, end: 17,
    prefix: 'AkumaClean_', suffix: '.png'
  }); 

  scene.anims.create({ key: 'superchargeimage', frames: scene.frameNames, frameRate: 20  , repeat: -1});

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
  for (let i = 0; i < 5; i++) {
    scene.frameNames.splice(1, 0, scene.frameNames[1]);
  }
  scene.anims.create({ key: 'lightpunch', frames: scene.frameNames, frameRate: 35, repeat: 0 });

  // AKUMA MEDIUM PUNCH ANIMATION
  scene.frameNames = scene.anims.generateFrameNames('akuma', {
    start: 93, end: 97,
    prefix: 'AkumaClean_', suffix: '.png'
  });
  for (let i = 0; i < 5; i++) {
    scene.frameNames.splice(2, 0, scene.frameNames[2]);
  }
  scene.anims.create({ key: 'standinguppercut', frames: scene.frameNames, frameRate: 35, repeat: 0 });
  

  // AKUMA FIERCE PUNCH ANIMATION
  scene.frameNames = scene.anims.generateFrameNames('akuma', {
    start: 99, end: 103,
    prefix: 'AkumaClean_', suffix: '.png'
  });
  for (let i = 0; i < 5; i++) {
    scene.frameNames.splice(2, 0, scene.frameNames[2]);
  }
  scene.anims.create({ key: 'fiercepunch', frames: scene.frameNames, frameRate: 35, repeat: 0 });

  // AKUMA LIGHT KICK ANIMATION
  scene.frameNames = scene.anims.generateFrameNames('akuma', {
    start: 105, end: 109,
    prefix: 'AkumaClean_', suffix: '.png'
  });
  for (let i = 0; i < 5; i++) {
    scene.frameNames.splice(2, 0, scene.frameNames[2]);
  }
  scene.anims.create({ key: 'lightkick', frames: scene.frameNames, frameRate: 35, repeat: 0 });

  // AKUMA MEDIUM KICK ANIMATION
  scene.frameNames = scene.anims.generateFrameNames('akuma', {
    start: 111, end: 114,
    prefix: 'AkumaClean_', suffix: '.png'
  });
  for (let i = 0; i < 5; i++) {
    scene.frameNames.splice(2, 0, scene.frameNames[2]);
  }
  scene.anims.create({ key: 'mediumkick', frames: scene.frameNames, frameRate: 35, repeat: 0 });

  // AKUMA HEAVY KICK ANIMATION
  scene.frameNames = scene.anims.generateFrameNames('akuma', {
    start: 115, end: 120,
    prefix: 'AkumaClean_', suffix: '.png'
  });
  for (let i = 0; i < 5; i++) {
    scene.frameNames.splice(3, 0, scene.frameNames[3]);
  }
  scene.anims.create({ key: 'heavykick', frames: scene.frameNames, frameRate: 35, repeat: 0 });

  // AKUMA OVERHEAD ANIMATION
  scene.frameNames = scene.anims.generateFrameNames('akuma', {
    start: 122, end: 128,
    prefix: 'AkumaClean_', suffix: '.png'
  });
  for (let i = 0; i < 5; i++) {
    scene.frameNames.splice(5, 0, scene.frameNames[5]);
  }
  scene.anims.create({ key: 'overhead', frames: scene.frameNames, frameRate: 35, repeat: 0 });

  // Array of string names of attack animations to be used as keys later 'shoryuken'
  this.akuma.attackNames = ['lightpunch', 'standinguppercut', 'fiercepunch', 'lightkick', 'mediumkick', 'heavykick', 'overhead'];

  // Hadoken physical body (used as hit detection)
  this.hadoken = scene.physics.add.group();

  }

  destroy() {
    this.sprite.destroy();
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


  
  // Random attack animation
  randomAttackAnimation(scene, self) {
    const shakecam = scene.cameras.add().setName('shakecam');
    shakecam.shake(100, 0.01);
    let attack = scene.PlayerCharacter.akuma.attackNames;
    scene.PlayerCharacter.akuma.anims.play(attack[Math.floor(Math.random() * attack.length)]);
  }
  
  
  // Hadoken construct
  createHadokenProjectile(PlayerCharacter, scene) { 
    let hadoken = PlayerCharacter.hadoken.create(PlayerCharacter.akuma.getCenter().x + 100, PlayerCharacter.akuma.getCenter().y - 20, 'akuma', 'AkumaClean_207.png');
    hadoken.body.gravity.y = -(scene.physics.config.gravity.y)
    hadoken.body.width = 100;
    hadoken.setVelocityX(500);
  }
  
  // the first call after end of round
  superComboOpeningAnimation(scene, self) {
    
    // play supercombo sound
    let superSound = scene.sound.add('super');
    superSound.play();
    
    // color the background
    scene.background.setTint(0x9f00bc);
    
    
    // vortex particles
    scene.particles.vortex.emitParticle();
    scene.particles.vortex2.emitParticle();
    
    self.akuma.anims.play('supercharge');

    // vertical & horizontal lasers
    scene.lazer.anims.delayedPlay(400,'blast');
    scene.lazer2.anims.delayedPlay(650,'blast');
    
    // All the while, this delay has been ticking down. 1 second after launching the function, call superCombo function
    scene.time.addEvent({ delay: 1000, callback: self.superCombo, args: [scene, self]});
  }
  
  teleport(self, scene) {
    self.akuma.x = 800

    let skeleton = scene.skeletons.children.entries[0];

    skeleton.emitHitParticles();
    skeleton.destroy();
  }

  // At the end of the round, do an attack for every word in combo
  superCombo(scene, self) {
    scene.background.setTint(0xffffff);
    
    
    scene.time.addEvent({ delay: 200, callback: self.teleport, args: [self, scene]});

    
    // Add delayed calls that repeat (combo) times
    // Animation
    scene.time.addEvent({ delay: 200, callback: self.randomAttackAnimation, args: [scene], repeat: scene.combo - 1});
    
    // Attack collisions
    scene.time.addEvent({ delay: 200, callback: self.createHadokenProjectile, args: [self, scene], repeat: scene.combo - 1});
    
    // Combo++ animation
    scene.time.addEvent({ delay: 200, callback: scene.superComboTally, args: [scene], repeat: scene.combo - 1});
    
    scene.time.addEvent({ delay: ((200 * scene.combo)), callback: self.superComboFinisher, args: [scene, self]});

    // Display score
    // Delay = combo length + 2 seconds
    

    // ADD A GLOBAL VARIABLE FOR COMBO ATTACK DELAY, AND TIGHTEN TIMINGS TO VARIABLES FOR CLEANER REFACTORING
  }

  superComboFinisher(scene, self) {
    // color the background
    scene.background.setTint(0x9f00bc);
    
    scene.particles.vortex.emitParticleAt(self.akuma.getCenter());
    
    self.akuma.anims.play('supercharge');

    self.superComboText(scene);

    scene.time.addEvent({ delay: 1500, callback: scene.roundEndScoreTally, args: [scene, self]});
    scene.time.addEvent({ delay: 1000, callback: self.goshoryuken, args: [scene, self]});
    scene.time.addEvent({ delay: 5500, callback: scene.boss.deathEvent, args: [ scene ]});
  }

  superComboText(scene) {
    let width = scene.sys.game.config.width / 2;
    let height = scene.sys.game.config.height / 2;
    let comboSound = [scene.sound.add('hyper'),
                      scene.sound.add('extreme'),
                      scene.sound.add('monster'),
                      scene.sound.add('insane'),
                      scene.sound.add('beastly'),
                      scene.sound.add('killer'),
                      scene.sound.add('ultra')];

    if (scene.combo >= 35) {
      var comboImage = scene.add.image(width, height, 'ultra').setDepth(15).setScale(3.2);

      let textVibrate = scene.tweens.add({
        targets: comboImage,
        scaleX: 3,
        scaleY: 3,
        duration: 25,
        yoyo: true,
        repeat: -1,
      });

      comboSound[6].play();

    } else if (scene.combo >= 30) {
        var comboImage = scene.add.image(width, height, 'killer').setDepth(15);
        comboSound[5].play();
    } else if (scene.combo >= 25) {
        var comboImage = scene.add.image(width, height, 'beastly').setDepth(15);
        comboSound[4].play();
    } else if (scene.combo >= 20) {
        var comboImage = scene.add.image(width, height, 'insane').setDepth(15);
        comboSound[3].play();
    } else if (scene.combo >= 15) {
        var comboImage = scene.add.image(width, height, 'monster').setDepth(15);
        comboSound[2].play();
    } else if (scene.combo >= 10) {
        var comboImage = scene.add.image(width, height, 'extreme').setDepth(15);
        comboSound[1].play();
    } else if (scene.combo >= 5) {
        var comboImage = scene.add.image(width, height, 'hyper').setDepth(15);
        comboSound[0].play();
    };

    let textFade = scene.tweens.add({
      targets: comboImage,
      alpha: { value: 0, duration: 3000, ease: 'Power1', delay: 1000 },
    });
  }

  goshoryuken(scene, self) {
    self.akuma.x = 850
    self.akuma.anims.play('shoryuken');
    self.akuma.setVelocityY(-200);

    scene.background.clearTint();
    
    scene.time.addEvent({ delay: 175, callback: self.createHadokenProjectile, args: [ self, scene ], repeat: 15});

    scene.boss.anims.play('bossdeath');
    scene.boss.body.setVelocityY(-200);

  }
}