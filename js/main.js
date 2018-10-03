const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 736,
  parent: "game-container", // Id of the DOM element to add the canvas to
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 1000 }
    }
  }
};

const game = new Phaser.Game(config);

const WORDS = ["chicken", "alphabet", "skill"];
let alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
let alphaImg = alphabet.slice(0);
let currentWord;
let currentWordImg;
let score = 0;

function preload(){
  // Runs once and loads assets

  // NOTE: "this" === Phaser.Scene
  this.load.image("background", "./assets/img/background.gif")
  this.load.image('ground', './assets/img/platform.png');
  this.load.multiatlas('akuma', './assets/spritesheets/akuma/akuma.json', './assets/spritesheets/akuma');

  for (i in alphabet) {
    this.load.image(alphabet[i], "./assets/img/alphabet/"+alphabet[i]+".png");
  }

}
function create(){
  // Background
  const bg = this.add.image(config.width / 2, config.height / 2, "background");
  bg.setDisplaySize(config.width, config.height);

  // Platforms
  platforms = this.physics.add.staticGroup();
  platforms.create(config.width / 8, (config.height / 2) + 100, 'ground')
    .setScale(0.5);

  this.keys = this.input.keyboard.addKeys(alphabet.join(","));
  this.keys.SPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  // Akuma
  this.akuma = this.physics.add.sprite(config.width / 8, config.height / 2, 'akuma', 'AkumaClean_.png')
    .setScale(1.5);

  //  Player physics properties. Give the little guy a slight bounce.
  this.akuma.setBounce(0.2);
  this.akuma.setCollideWorldBounds(true);

  // Colliders
  this.physics.add.collider(this.akuma, platforms);

  // AKUMA GOSHORYU ANIMATION
  this.frameNames = this.anims.generateFrameNames('akuma', {
    // normal start: 246
    start: 248, end: 266,
    prefix: 'AkumaClean_', suffix: '.png'
  });
  this.frameNames.push({ key:'akuma', frame:'AkumaClean_246.png' });
  this.anims.create({ key: 'shoryuken', frames: this.frameNames, frameRate: 20, repeat: 0 });
  
  
  // AKUMA WALK ANIMATION
  this.frameNames = this.anims.generateFrameNames('akuma', {
    start: 18, end: 28,
    prefix: 'AkumaClean_', suffix: '.png'
  });
  this.anims.create({ key: 'idleright', frames: this.frameNames, frameRate: 25, repeat: -1 });
  this.akuma.on('animationcomplete', BackToIdle, this);
  this.akuma.anims.play('idleright');
  ///////

  // Add a timed event to slow the animation with pause/unpause in a dedicated function at the bottom of the codebase
  //this.time.addEvent({ delay: 20, callback: AkumaStutter, callbackScope: this, repeat: 99999 });

  // Pick & show first word
  currentWord = newWord(WORDS);
  currentWordImg = currentWord.slice(0);
  this.wordContainer = this.add.container(config.width / 2, config.height / 5);
  newWordToScreen(this);

  this.scoretext = this.add
      .text(16, 16, ("Score: " + score), {
        font: "18px monospace",
        fill: "#000000",
        padding: { x: 20, y: 10 },
        backgroundColor: "#ffffff"
      })
}

function update() {
  // if there are characters left to type
  if (currentWord.length > 0) {
    if ((this.keys[currentWord[0]].isDown)) {
      currentWordImg[0].setTint(0x00ff00);
      currentWordImg.push(currentWordImg.shift());
      currentWord.shift();
    }
  // else destroy images and make a new word
  } else {
    for (i in currentWordImg) {
      score += 5;
      this.scoretext.setText("Score: " + score);
      currentWordImg[i].destroy();
    }
    currentWord = newWord(WORDS);
    newWordToScreen(this);
    AkumaUppercut(this);
  }

}

function newWord(wordlist) {
  // Generate random array index
  const randIndex = Math.floor(Math.random() * wordlist.length);
  // Output random word
  return wordlist[randIndex].toUpperCase().split(""); // LOOKUP INNERHTML
}

function newWordToScreen(scene) {
  scene.wordContainer.x = config.width / 2
  if (currentWordImg > currentWord.length) {
    currentWordImg = currentWord.slice(0);
  }

  for (let i = 0; i < currentWord.length; i++) {
    // find letters in current word and set placement on screen with ax / y300
    //let ax = (config.width / 2) + (i * 40);
    currentWordImg[i] = scene.add.image(i * 40, 0, currentWord[i]).setOrigin(0);
    scene.wordContainer.add([currentWordImg[i]]);
  }
  // Center wordContainer to half of current word's x-per-character offset
  scene.wordContainer.x = (scene.wordContainer.x - ((currentWord.length * 40) / 2));
}

function AkumaUppercut(scene) {
    scene.akuma.anims.play('shoryuken');
    scene.akuma.setVelocityY(-700);
}
// function AkumaStutter(scene) {
//   if (this.akuma.anims.isPaused === false) {
//     this.akuma.anims.pause();
//   } else {
//     this.akuma.anims.resume();
//    }
// }

function BackToIdle() {
  this.akuma.anims.play('idleright');
}