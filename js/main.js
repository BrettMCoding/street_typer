import PlayerCharacter from "./akuma.js";
import DICTIONARY from "./words.js";

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
let alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
//let alphaImg = alphabet.slice(0);
let currentWord;
let currentWordImg;
let timer = 30;
let WORDS;
let roundEndSwitch = 0;
let RoundInHackyGlobalZBullshit;
function preload(){
  // Runs once and loads assets

  // NOTE: "this" === Phaser.Scene
  this.load.image("background", "./assets/img/background.gif")
  this.load.image('ground', './assets/img/platform.png');
  this.load.multiatlas('akuma', './assets/spritesheets/akuma/akuma.json', './assets/spritesheets/akuma');
  this.load.image('skeleton', './assets/img/skeleton.png');
  this.load.image('bloodchunk', './assets/img/particles/bloodchunk.png');
  this.load.image('red', './assets/img/particles/red.png');
  this.load.image('bone', './assets/img/particles/bone.png');

  for (let i in alphabet) {
    this.load.image(alphabet[i], "./assets/img/alphabet/"+alphabet[i]+".png");
  }

}
function create(){
  // Dictionary
  this.dictionary = new DICTIONARY();
  WORDS = this.dictionary.WORDS;
  // Background
  const bg = this.add.image(config.width / 2, config.height / 2, "background");
  bg.setDisplaySize(config.width, config.height);

  // Platforms
  let platforms = this.physics.add.staticGroup();
  platforms.create(config.width / 8, (config.height / 2) + 100, 'ground')
    .setScale(0.5);
  platforms.create((config.width / 8) + 200, (config.height / 2) + 100, 'ground')
  .setScale(0.5);

  this.keys = this.input.keyboard.addKeys(alphabet.join(","));
  this.keys.SPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  // Skeleton
  this.skeleton = this.physics.add.sprite(config.width / 8 + 50, config.height / 2, 'skeleton')
    .setScale(0.25);
  
    // Add Player Character
  this.PlayerCharacter = new PlayerCharacter(this, config.width / 8, config.height / 2)

  //  Player physics properties. Give the little guy a slight bounce.
  this.skeleton.setBounce(0.2);
  this.skeleton.setCollideWorldBounds(true);
  this.skeleton.flipX = true;
  //this.skeleton.setSize();
  debugger;

  // Pick & show first word
  currentWord = newWord(WORDS);
  currentWordImg = currentWord.slice(0);
  this.wordContainer = this.add.container(config.width / 2, config.height / 5);
  newWordToScreen(this);

  this.timertext = this.add
      .text(config.width / 2, 10, ("Time Left: " + timer), {
        font: "18px monospace",
        fill: "#000000",
        padding: { x: 20, y: 10 },
        backgroundColor: "#ffffff",
        originX : 0.5
      });
  this.timertext.x -= this.timertext.width / 2;

  this.combo = 0;
  this.combotext = this.add
    .text(16, 16, ("combo: " + this.combo), {
      font: "18px monospace",
      fill: "#000000",
      padding: { x: 20, y: 10 },
      backgroundColor: "#ffffff"
   })

  // Colliders
  this.physics.add.collider(this.PlayerCharacter.akuma, platforms);
  this.physics.add.collider(this.skeleton, platforms);
  //this.physics.add.collider(this.PlayerCharacter.hadoken, this.skeleton, SkeletonDeath, null, this);
  this.physics.add.overlap(this.skeleton, this.PlayerCharacter.hadoken, SkeletonDeath, null, this);

  // Particles
  this.particles = {};
  this.particles.bone = this.add.particles('bone');
  this.particles.bloodchunk = this.add.particles('bloodchunk');
  this.particles.hadoken = this.add.particles('red');
  
  this.particles.bone.createEmitter({
    x: 200,
    y: 300,
    lifespan: 2000,
    quantity: {min: 4, max: 10},
    speed: { min: 250, max: 500 },
    angle: { min: 180, max: 440 },
    rotate: { start:0, end:360, ease: 'Back.easeOut'},
    gravityY: 700,
    scale: { start: 0.01, end: 0.004 },
    //blendMode: 'ADD',
    on: false
  });

  this.particles.bloodchunk.createEmitter({
    x: 200,
    y: 300,
    lifespan: {min: 300, max: 2000},
    quantity: {min: 20, max: 30},
    speed: { min: 350, max: 600 },
    angle: { min: 180, max: 440 },
    rotate: { start:0, end:360, ease: 'Back.easeOut'},
    gravityY: 700,
    scale: { start: 0.1, end: 0.004 },
    //blendMode: 'ADD',
    on: false
  });
  
  // this.particles.red.createEmitter({
  //   x: 200,
  //   y: 300,
  //   lifespan: 2000,
  //   quantity: {min: 50, max: 200},
  //   speed: { min: 40, max: 600 },
  //   angle: { min: 330, max: 380 },
  //   gravityY: 0,
  //   scale: { start: 0.4, end: 0 },
  //   blendMode: 'ADD',
  //   on: false
  // });

  // Game timer
  this.time.addEvent({ delay: 1000, callback: countDown, callbackScope: this, repeat: (this.combo - 1)});
}

function update() {
  // if there are characters left to type
  if (currentWord.length > 0) {
    
    // this.keys[currentWord[0]].isDown
    if (Phaser.Input.Keyboard.JustDown(this.keys[currentWord[0]])) {
      currentWordImg[0].setTint(0x00ff00);
      currentWordImg.push(currentWordImg.shift());
      currentWord.shift();
    }
  // else destroy images and make a new word
  } else {
    for (let i in currentWordImg) {
      currentWordImg[i].destroy();
    }
    this.combo += 1;
    this.combotext.setText("COMBO: " + this.combo);
    currentWord = newWord(WORDS);
    newWordToScreen(this);
    this.PlayerCharacter.Hadoken(this);
  }

  // Round Over calls
  if (timer === 0 && roundEndSwitch === 0){
    roundEndSwitch = 1;
    RoundEnd(this);
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

function SkeletonDeath(skeleton, hadoken) {
  //skeleton.setVelocityY(-2000);
  skeleton.setVelocityX(0);
  hadoken.destroy()
  this.particles.bone.emitParticleAt(skeleton.x, skeleton.y);
  this.particles.bloodchunk.emitParticleAt(skeleton.x, skeleton.y);
  //this.particles.red.emitParticleAt(hadoken.x, hadoken.y);
  this.particles.hadoken.setVisible(false);
}

function countDown() {
  timer--;
  this.timertext.setText("Time Left: " + timer);
}

function RoundEnd(scene) {
  scene.combotext.destroy();
  scene.timertext.destroy();
    for (let i in currentWordImg) {
     currentWordImg[i].destroy();
    }
  scene.PlayerCharacter.Hadoken(scene, scene.combo, true)
}

//Math.floor(Math.random() * wordlist.length)