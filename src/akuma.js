export default class PlayerCharacter extends Phaser.GameObjects.Sprite {
  constructor(config) {

    super(config.scene, config.x, config.y, 'akuma', 'AkumaClean_.png')

    config.scene.physics.world.enable(this);

    this.body
      .setBounce(0.2)
      .setGravityY(-950)
      .setCollideWorldBounds(true);

    this
      .setScale(2.5)
      .setDepth(11);


    this.anims.play('idleright');

    this.on('animationcomplete', this.BackToIdle, this);

    // Array of string names of attack animations to be used as keys later 'shoryuken'
    this.attackNames = ['lightpunch', 'standinguppercut', 'fiercepunch', 'lightkick', 'mediumkick', 'heavykick', 'overhead'];

    this.scene.add.existing(this);
  }
  
  // After any animation, resume playing idle animation
  BackToIdle() {
    this.anims.play('idleright');
  }
  
  // Call a random attack animation
  akumaAttack(scene) {
    this.randomAttackAnimation(scene);
  }


  
  // Random attack animation
  randomAttackAnimation(scene) {
    const shakecam = scene.cameras.add().setName('shakecam');
    shakecam.shake(100, 0.01);
    let attack = scene.PlayerCharacter.attackNames;
    scene.PlayerCharacter.anims.play(attack[Math.floor(Math.random() * attack.length)]);
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
    
    self.anims.play('supercharge');

    // vertical & horizontal lasers
    scene.lazer.anims.delayedPlay(400,'blast');
    scene.lazer2.anims.delayedPlay(650,'blast');
  }
  
  teleport(self, scene) {
    self.x = 800

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
    scene.time.addEvent({ delay: 200, callback: scene.hitBoss, args: [scene], repeat: scene.combo - 1});
    
    // Combo++ animation
    scene.time.addEvent({ delay: 200, callback: scene.superComboTally, args: [scene], repeat: scene.combo - 1});

    // Display score
    // Delay = combo length + 2 seconds
    

    // ADD A GLOBAL VARIABLE FOR COMBO ATTACK DELAY, AND TIGHTEN TIMINGS TO VARIABLES FOR CLEANER REFACTORING
  }

  superComboFinisher(scene, self) {
    // color the background
    scene.background.setTint(0x9f00bc);
    
    scene.particles.vortex.emitParticleAt(self.getCenter());

    self.anims.play('supercharge');

    self.superComboText(scene);

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
      var comboImage = scene.add.image(width, height, 'imgpack', 'ultra').setDepth(15).setScale(3.2);

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
        var comboImage = scene.add.image(width, height, 'imgpack', 'killer').setDepth(15);
        comboSound[5].play();
    } else if (scene.combo >= 25) {
        var comboImage = scene.add.image(width, height, 'imgpack', 'beastly').setDepth(15);
        comboSound[4].play();
    } else if (scene.combo >= 20) {
        var comboImage = scene.add.image(width, height, 'imgpack', 'insane').setDepth(15);
        comboSound[3].play();
    } else if (scene.combo >= 15) {
        var comboImage = scene.add.image(width, height, 'imgpack', 'monster').setDepth(15);
        comboSound[2].play();
    } else if (scene.combo >= 10) {
        var comboImage = scene.add.image(width, height, 'imgpack', 'extreme').setDepth(15);
        comboSound[1].play();
    } else if (scene.combo >= 5) {
        var comboImage = scene.add.image(width, height, 'imgpack', 'hyper').setDepth(15);
        comboSound[0].play();
    };

    let textFade = scene.tweens.add({
      targets: comboImage,
      alpha: { value: 0, duration: 3000, ease: 'Power1', delay: 1000 },
    });
  }

  goshoryuken(scene, self) {
    self.x = 850
    self.anims.play('shoryuken');
    self.body.setVelocityY(-200);

    scene.background.clearTint();
    
    scene.time.addEvent({ delay: 175, callback: scene.hitBoss, args: [ scene ], repeat: 15});

    scene.boss.anims.play('bossdeath');
    scene.boss.body.setVelocityY(-200);

  }
}