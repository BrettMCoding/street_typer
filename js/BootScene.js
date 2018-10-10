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

    for (let i = 1; i <= 8; i++) {
      this.load.image("background" + i, "./assets/img/backgroundsprite/background" + i + ".png")
      console.log("background" + i)
    }
    this.load.image('ground', './assets/img/platform.png');
    this.load.image('skeleton', './assets/img/skeleton.png');
    this.load.image('bloodchunk', './assets/img/particles/bloodchunk.png');
    this.load.image('red', './assets/img/particles/red.png');
    this.load.image('bone', './assets/img/particles/bone.png');
    this.load.image('fire', './assets/img/particles/muzzleflash3.png');
    this.load.image('flares', './assets/img/particles/sparkle1.png');
    this.load.atlas('lazer', './assets/img/particles/lazer/lazer.png', './assets/img/particles/lazer/lazer.json');
  
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
    
    
    // Load combo word
    this.load.image('comboword', './assets/img/comboword.png');
    
    // this.alphabet is our array of A-Z strings that we use as keys to make new letter sprites
    this.alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    // Load alphabet images (in a for loop to save space)
    for (let i in this.alphabet) {
      this.load.image(this.alphabet[i], "./assets/img/alphabet/"+this.alphabet[i]+".png");
    }
  }

  create() {
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
    this.background = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, "background");

    this.background.play("background");

    this.input.manager.enabled = true;

    this.input.once('pointerdown', function () {
      this.scene.start('GameScene');
    }, this);
  }
}

export default BootScene;