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
      console.log("background" + i)
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

    // TEMPORARY MENU SKIP
    // this.scene.start('GameScene');

    let width = this.sys.game.config.width
    let height = this.sys.game.config.height

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
      frameRate: 15,
      repeat: -1
    });
    this.background = this.add.sprite( width / 2, height / 2, "background" );

    this.black = this.add.image( width / 2, height / 2, "black");

    this.background.play("background");

    let presentText = this.add
      .text(width / 2, height / 2, "MONKEY GAMES", {
        fontFamily: "arcade",
        fontSize: 60,
        fill: "#f8d838",
        padding: { x: 20, y: 10 }})
        .setStroke('#312088', 6)
        .setOrigin(0.5)
        .setAlpha(0.0);
    presentText.x = width / 2;
    presentText.y = height / 2;
    

    // Fade out black to background
    this.tweens.add({
      targets: this.black,
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
    this.logo = this.physics.add.sprite( width / 2, height / 2 - 20000, 'imgpack', 'logo')
      .setBounce(0.2)

    // Create invisible platform for logo to land on
    this.platform = this.physics.add.staticSprite( width / 2, 310);

    this.physics.add.collider(this.logo, this.platform, this.bounceSoundAndNextScene, null, this);
  }

  // MUTED SOUND EFFECTS LIE BELOW

  monkeyGamesSound() {
    let presentSound = this.sound.add('ff7save');
    presentSound.play();
  }

  backgroundMusic() {
    let bgm = this.sound.add('sewersurfin');
    bgm.play()
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