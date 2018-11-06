class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene'});
  }

  preload() {
    let progress = this.add.graphics();

    this.load.on('progress', function (value) {

      progress.clear();
      progress.fillStyle(0xf8d838, 1);
      progress.fillRect(0, 270, 800 * value, 60);

    });

    this.load.on('complete', function () {

      progress.destroy();

    });

    // Hack in custom font
    this.add.text(0, 0, "hack", {
      fontFamily: "arcade",
      fontSize: 1
    });

    for (let i = 1; i <= 8; i++) {
      this.load.image("background" + i, "./assets/img/backgroundsprite/cathedral/cathedral" + i + ".png")
    }

    this.load.multiatlas('imgpack', './assets/img/imgpack.json', './assets/img')

    this.load.image('black', './assets/img/black.png');
    this.load.image('ground', './assets/img/platform.png');
    this.load.atlas('lazer', './assets/img/lazer/lazer.png', './assets/img/lazer/lazer.json');
  
    // load akuma sprites
    this.load.multiatlas('akuma', './assets/spritesheets/akuma/akuma.json', './assets/spritesheets/akuma');

    // load boss sprites
    this.load.multiatlas('boss', './assets/spritesheets/anakaris/anakaris.json', './assets/spritesheets/anakaris');
  
    // load skeleton sprites
    this.load.multiatlas('skeletonmedium', './assets/spritesheets/skeletonmedium/skeletonmedium.json', './assets/spritesheets/skeletonmedium/');

    // load audio assets
    this.load.audio('super', './assets/sounds/super.mp3');
    this.load.audio('hyper', './assets/sounds/hyper.mp3');
    this.load.audio('extreme', './assets/sounds/extreme.mp3');
    this.load.audio('monster', './assets/sounds/monster.mp3');
    this.load.audio('insane', './assets/sounds/insane.mp3');
    this.load.audio('beastly', './assets/sounds/beastly.mp3');
    this.load.audio('killer', './assets/sounds/killer.mp3');
    this.load.audio('ultra', './assets/sounds/ultra.mp3');
    this.load.audio('fiercekick', './assets/sounds/fiercekicka3.mp3',);
    this.load.audio('fiercepunch', './assets/sounds/fiercepuncha3.mp3',);
    this.load.audio('lightkick', './assets/sounds/lightkicka3.mp3',);
    this.load.audio('lightpunch', './assets/sounds/lightpuncha3.mp3',);
    this.load.audio('mediumpunch', './assets/sounds/mediumpuncha3.mp3',);
    this.load.audio('memescream', './assets/sounds/memescream.mp3',);
    this.load.audio('megamanmenu', './assets/sounds/ui/megamanmenu.mp3',);
    this.load.audio('sewersurfin', './assets/sounds/music/sewersurfin.mp3',);
    this.load.audio('ff7save', './assets/sounds/ui/ff7save.mp3');
    this.load.audio('summon', './assets/sounds/deathcoil.mp3');
    this.load.audio('skeletonemerge', './assets/sounds/skeletonemerge.mp3');
    this.load.audio('bossdeath', './assets/sounds/bossdeath.mp3');
    this.load.audio('bosssoundintro', './assets/sounds/anakarisintro.mp3');  
    this.load.audio('rockcrumble1', './assets/sounds/rockcrumble1.mp3');
    this.load.audio('rockcrumble2', './assets/sounds/rockcrumble2.mp3');
    this.load.audio('rockcrumble3', './assets/sounds/rockcrumble3.mp3');
    this.load.audio('321go', './assets/sounds/321go.mp3');
    this.load.audio('54321', './assets/sounds/54321.mp3');
    this.load.audio('points', './assets/sounds/points.mp3');
    this.load.audio('pointsfinish', './assets/sounds/pointsfinish.mp3'); 
    
    this.alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    // Load alphabet images (in a for loop to save space)
    for (let i in this.alphabet) {
      this.load.image(this.alphabet[i], "./assets/img/alphabet/"+this.alphabet[i]+".png");
    }
    
  }

  create() {
    // Animations
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;

    // Anakaris
        // Idle
        let frames = this.anims.generateFrameNames('boss', {
          start: 1, end: 24,
          prefix: 'anakaris_', suffix: '.png'
        });
        this.anims.create({ key: 'bossidle', frames: frames, frameRate: 15, repeat: -1 });

        // Summon
        frames = this.anims.generateFrameNames('boss', {
          start: 43, end: 61,
          prefix: 'anakaris_', suffix: '.png'
        }); 
        this.anims.create({ key: 'bosssummon', frames: frames, frameRate: 40, yoyo: true});

        // Intro
        frames = this.anims.generateFrameNames('boss', {
          start: 62, end: 70,
          prefix: 'anakaris_', suffix: '.png'
        }); 
        this.anims.create({ key: 'bossintro', frames: frames, frameRate: 6, yoyo: true});

        // Hit
        frames = this.anims.generateFrameNames('boss', {
          start: 73, end: 74,
          prefix: 'anakaris_', suffix: '.png'
        }); 
        this.anims.create({ key: 'bosshit1', frames: frames, frameRate: 60, yoyo: true })

        // Death
        frames = this.anims.generateFrameNames('boss', {
          start: 98, end: 100,
          prefix: 'anakaris_', suffix: '.png'
        }); 
        this.anims.create({ key: 'bossdeath', frames: frames, frameRate: 0.5 });

    // Medium Skeleton
        // Idle
        frames = this.anims.generateFrameNames('skeletonmedium', {
          start: 31, end: 33,
          prefix: 'skeletonmedium_', suffix: '.png'
        });
        this.anims.create({ key: 'skeletonmediumidle', frames: frames, frameRate: 6, repeat: -1 });

        // // SUMMON ANIMATION
        frames = this.anims.generateFrameNames('skeletonmedium', {
          start: 1, end: 7,
          prefix: 'skeletonmedium_', suffix: '.png'
        });
        this.anims.create({ key: 'skeletonmediumsummon', frames: frames, frameRate: 20});

    // Akuma
        // AKUMA GOSHORYU ANIMATION
        frames = this.anims.generateFrameNames('akuma', {
          start: 248, end: 266,
          prefix: 'AkumaClean_', suffix: '.png'
        });
        frames.push({ key:'akuma', frame:'AkumaClean_246.png' });
        this.anims.create({ key: 'shoryuken', frames: frames, frameRate: 3.6, repeat: 0 });

        // AKUMA SUPERCHARGE ANIMATION
        frames = this.anims.generateFrameNames('akuma', {
          // messy unshift calls to bypass octal literals strict mode error
          start: 10, end: 17,
          prefix: 'AkumaClean_', suffix: '.png'
        }); let b=frames;b.unshift({ key:'akuma', frame:'AkumaClean_09.png' });b.unshift({ key:'akuma', frame:'AkumaClean_08.png' });b.unshift({ key:'akuma', frame:'AkumaClean_07.png' });b.unshift({ key:'akuma', frame:'AkumaClean_06.png' });b.unshift({ key:'akuma', frame:'AkumaClean_05.png' });b.unshift({ key:'akuma', frame:'AkumaClean_04.png' });b.unshift({ key:'akuma', frame:'AkumaClean_03.png' });
        this.anims.create({ key: 'supercharge', frames: frames, frameRate: 20  , yoyo: true});

        // AKUMA SUPERCHARGE IMAGE
        frames = this.anims.generateFrameNames('akuma', {
          start: 15, end: 17,
          prefix: 'AkumaClean_', suffix: '.png'
        }); 

        this.anims.create({ key: 'superchargeimage', frames: frames, frameRate: 20  , repeat: -1});

        // AKUMA IDLE ANIMATION
        frames = this.anims.generateFrameNames('akuma', {
          start: 18, end: 28,
          prefix: 'AkumaClean_', suffix: '.png'
        });
        this.anims.create({ key: 'idleright', frames: frames, frameRate: 15, repeat: -1 });

        // AKUMA LIGHT PUNCH ANIMATION
        frames = this.anims.generateFrameNames('akuma', {
          start: 89, end: 91,
          prefix: 'AkumaClean_', suffix: '.png'
        });
        for (let i = 0; i < 5; i++) {
          frames.splice(1, 0, frames[1]);
        }
        this.anims.create({ key: 'lightpunch', frames: frames, frameRate: 35, repeat: 0 });

        // AKUMA MEDIUM PUNCH ANIMATION
        frames = this.anims.generateFrameNames('akuma', {
          start: 93, end: 97,
          prefix: 'AkumaClean_', suffix: '.png'
        });
        for (let i = 0; i < 5; i++) {
          frames.splice(2, 0, frames[2]);
        }
        this.anims.create({ key: 'standinguppercut', frames: frames, frameRate: 35, repeat: 0 });
        

        // AKUMA FIERCE PUNCH ANIMATION
        frames = this.anims.generateFrameNames('akuma', {
          start: 99, end: 103,
          prefix: 'AkumaClean_', suffix: '.png'
        });
        for (let i = 0; i < 5; i++) {
          frames.splice(2, 0, frames[2]);
        }
        this.anims.create({ key: 'fiercepunch', frames: frames, frameRate: 35, repeat: 0 });

        // AKUMA LIGHT KICK ANIMATION
        frames = this.anims.generateFrameNames('akuma', {
          start: 105, end: 109,
          prefix: 'AkumaClean_', suffix: '.png'
        });
        for (let i = 0; i < 5; i++) {
          frames.splice(2, 0, frames[2]);
        }
        this.anims.create({ key: 'lightkick', frames: frames, frameRate: 35, repeat: 0 });

        // AKUMA MEDIUM KICK ANIMATION
        frames = this.anims.generateFrameNames('akuma', {
          start: 111, end: 114,
          prefix: 'AkumaClean_', suffix: '.png'
        });
        for (let i = 0; i < 5; i++) {
          frames.splice(2, 0, frames[2]);
        }
        this.anims.create({ key: 'mediumkick', frames: frames, frameRate: 35, repeat: 0 });

        // AKUMA HEAVY KICK ANIMATION
        frames = this.anims.generateFrameNames('akuma', {
          start: 115, end: 120,
          prefix: 'AkumaClean_', suffix: '.png'
        });
        for (let i = 0; i < 5; i++) {
          frames.splice(3, 0, frames[3]);
        }
        this.anims.create({ key: 'heavykick', frames: frames, frameRate: 35, repeat: 0 });

        // AKUMA OVERHEAD ANIMATION
        frames = this.anims.generateFrameNames('akuma', {
          start: 122, end: 128,
          prefix: 'AkumaClean_', suffix: '.png'
        });
        for (let i = 0; i < 5; i++) {
          frames.splice(5, 0, frames[5]);
        }
        this.anims.create({ key: 'overhead', frames: frames, frameRate: 35, repeat: 0 });

    // TEMPORARY MENU SKIP
    // this.scene.start('GameScene');

    this.anims.create({
      key: "background",
      frames: [
        { key: "background1"},
        { key: "background2"},
        { key: "background3"},
        { key: "background4"},
        { key: "background5"},
        { key: "background6"},
        { key: "background7"},
        { key: "background8"}
      ],
      frameRate: 8,
      repeat: -1
    });
    let background = this.add.sprite( this.width / 2, this.height / 2, "background" );

    let black = this.add.image( this.width / 2, this.height / 2, "black");

    background.play("background");

    let presentText = this.add
      .text(this.width / 2, this.height / 2, "MONKEY GAMES", {
        fontFamily: "arcade",
        fontSize: 60,
        fill: "#f8d838",
        padding: { x: 20, y: 10 }})
        .setStroke('#312088', 6)
        .setOrigin(0.5)
        .setAlpha(0.0);
    presentText.x = this.width / 2;
    presentText.y = this.height / 2;

    this.createMusicMuter(this);

    // Fade out black to background
    this.tweens.add({
      targets: black,
      alpha: { value: 0, duration: 5000, ease: 'Power1', delay: 3000 },
    });

    // Pop text in
    this.tweens.add({
      targets: presentText,
      alpha: { value: 1, duration: 1, ease: 'Power1', delay: 500 },
    });

    // Text sound effect
    this.time.addEvent({ delay: 300, callback: this.monkeyGamesSound, callbackScope: this, repeat: (this.timer)});

    // Pop text out
    this.tweens.add({
      targets: presentText,
      alpha: { value: 0, duration: 1, ease: 'Power1', delay: 3000 },
    });

    // play background music
    this.time.addEvent({ delay: 3000, callback: this.backgroundMusic, callbackScope: this, repeat: (this.timer)});

    // Create physics logo
    let logo = this.physics.add.sprite( this.width / 2, this.height / 2 - 20000, 'imgpack', 'logo')
      .setBounce(0.2)

    // Create invisible platform for logo to land on
    let platform = this.physics.add.staticSprite( this.width / 2, 310);

    this.physics.add.collider(logo, platform, this.bounceSoundAndNextScene, null, this);
  }

  update() {
    this.muteMusic(this);
  }

  monkeyGamesSound() {
    let presentSound = this.sound.add('ff7save');
    presentSound.play();
  }

  backgroundMusic() {
    let bgm = this.sound.add('sewersurfin');
    bgm.play()
  }

  createMusicMuter(scene) {
    // Add spacebar for music mute
    scene.SPACE = scene.input.keyboard.addKey
      (Phaser.Input.Keyboard.KeyCodes.SPACE);

    scene.muteText = scene.add
    .text(scene.width / 2, scene.height / 2, "Music Muted", {
      fontFamily: "arcade",
      fontSize: 30,
      fill: "#f8d838",
      padding: { x: 20, y: 10 }})
      .setStroke('#312088', 6)
      .setOrigin(0.5)
      .setAlpha(0.0);
  }

  muteMusic(scene) {
    if (Phaser.Input.Keyboard.JustDown(scene.SPACE)) {
      for (let i = 0; i < scene.sound.sounds.length; i++) {
        for (let key in scene.sound.sounds[i]) {
          if (scene.sound.sounds[i][key] === "sewersurfin") {
            var sound = scene.sound.sounds[i];
  
            if (sound.mute === true) {
              sound.mute = false;
  
              scene.muteText.setText("Music unmuted");
  
              scene.tweens.add({
                targets: scene.muteText,
                alpha: { value: 1, duration: 250, ease: 'Power1', yoyo: true },
              });
            } else {
              sound.mute = true;
  
              scene.muteText.setText("Music muted");
  
              scene.tweens.add({
                targets: scene.muteText,
                alpha: { value: 1, duration: 250, ease: 'Power1', yoyo: true },
              });
            }
          }
        }
      }
    }
  }

  bounceSoundAndNextScene(logo, platform) {
      let hit = this.sound.add('fiercepunch');
      // wasTouching.none is a boolean of whether or not object was colliding with nothing last cycle
      if (logo.body.wasTouching.none === true) {
        hit.play();
        let shakecam = this.cameras.add().setName('shakecam');
        shakecam.shake(100, 0.01);
      // if wasTouching.none = true, we've stopped. Start the menu
      } else {
        this.scene.start('MenuScene');
      }
  }
}

export default BootScene;