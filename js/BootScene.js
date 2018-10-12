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
    this.load.image('black', './assets/img/black.png');
    this.load.image('logo', './assets/img/logo.png');
    this.load.image('ground', './assets/img/platform.png');
    this.load.image('skeleton', './assets/img/skeleton.png');
    this.load.image('bloodchunk', './assets/img/particles/bloodchunk.png');
    this.load.image('red', './assets/img/particles/red.png');
    this.load.image('bone', './assets/img/particles/bone.png');
    this.load.image('fire', './assets/img/particles/muzzleflash3.png');
    this.load.image('flares', './assets/img/particles/sparkle1.png');
    this.load.image('sparklered', './assets/img/particles/sparkle2.png');
    this.load.atlas('lazer', './assets/img/particles/lazer/lazer.png', './assets/img/particles/lazer/lazer.json');
    this.load.image('playbutton', './assets/img/menu/playbutton.png');
    this.load.image('helpbutton', './assets/img/menu/helpbutton.png');
    this.load.image('squarebutton', './assets/img/menu/squarebutton.png');
    this.load.image('squarebuttonx', './assets/img/menu/squarebuttonx.png');
  
    // Load Akuma sprites
    this.load.multiatlas('akuma', './assets/spritesheets/akuma/akuma.json', './assets/spritesheets/akuma');
  
    // Load audio assets
    this.load.audio('super', './assets/sounds/super.wav',);
    this.load.audio('fiercekick', './assets/sounds/fiercekickA3.wav',);
    this.load.audio('fiercepunch', './assets/sounds/fiercepunchA3.wav',);
    this.load.audio('lightkick', './assets/sounds/lightkickA3.wav',);
    this.load.audio('lightpunch', './assets/sounds/lightpunchA3.wav',);
    this.load.audio('mediumpunch', './assets/sounds/mediumpunchA3.wav',);
    this.load.audio('memescream', './assets/sounds/memescream.wav',);
    this.load.audio('megamanmenu', './assets/sounds/UI/megamanmenu.wav',);
    this.load.audio('sewersurfin', './assets/sounds/music/SewerSurfin.mp3',);
    this.load.audio('ff7save', './assets/sounds/UI/ff7save.mp3');

    // Load combo word
    this.load.image('comboword', './assets/img/comboword.png');
    
    // this.alphabet is our array of A-Z strings that we use as keys to make new letter sprites
    this.alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    // Load alphabet images (in a for loop to save space)
    for (let i in this.alphabet) {
      this.load.image(this.alphabet[i], "./assets/img/alphabet/"+this.alphabet[i]+".png");
    }
    // Same for numbers
    this.numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    for (let i in this.numbers) {
      this.load.image('' + i, "./assets/img/alphabet/"+i+".png");
    }
  }

  create() {
    // TEMPORARY MENU SKIP
    this.scene.start('GameScene');

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
    this.logo = this.physics.add.sprite( width / 2, height / 2 - 20000, "logo")
      .setBounce(0.2)

    // Create invisible platform for logo to land on
    this.platform = this.physics.add.staticSprite( width / 2, 310);

    this.physics.add.collider(this.logo, this.platform, this.bounceSoundAndNextScene, null, this);
      //this.scene.start('MenuScene');
  }

  // MUTED SOUND EFFECTS LIE BELOW

  monkeyGamesSound() {
    let presentSound = this.sound.add('ff7save');
    //presentSound.play();
  }

  backgroundMusic() {
    let bgm = this.sound.add('sewersurfin');
    //bgm.play()
  }

  bounceSoundAndNextScene(logo, platform) {
      let hit = this.sound.add('fiercepunch');
      // wasTouching.none is a boolean of whether or not object was colliding with nothing last cycle
      if (logo.body.wasTouching.none === true) {
        //hit.play();
        let shakecam = this.cameras.add().setName('shakecam');
        shakecam.shake(100, 0.01);
      // if wasTouching.none = true, we've stopped. Start the menu
      } else {
        this.scene.start('MenuScene');
      }
      //hit.once();
  }
}

export default BootScene;