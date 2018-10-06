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

// globals for now

// alphabet is our array of A-Z strings that we use as keys to make new letter sprites
let alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

// currentWord will be a random word from our Dictionary
let currentWord;

// currentWordImg will be an Array of sprites, where each value is one letter
let currentWordImg;

// Timer. Adjust to change the length of a round
let timer = 2;

// WORDS will be our imported dictionary of words in an array
let WORDS;

// When timer hits 0 we will throw this to 1 to begin the end of round mechanics
let roundEndSwitch = 0;

function preload(){
  // Runs once and loads assets
  // NOTE: "this" === Phaser.Scene

  // Load image assets
  this.load.image("background", "./assets/img/background.gif")
  this.load.image('ground', './assets/img/platform.png');
  this.load.image('skeleton', './assets/img/skeleton.png');
  this.load.image('bloodchunk', './assets/img/particles/bloodchunk.png');
  this.load.image('red', './assets/img/particles/red.png');
  this.load.image('bone', './assets/img/particles/bone.png');

  // Load Akuma sprites
  this.load.multiatlas('akuma', './assets/spritesheets/akuma/akuma.json', './assets/spritesheets/akuma');

  // Load audio assets
  this.load.audio('fiercekick', './assets/sounds/fiercekickA3.wav',);
  this.load.audio('fiercepunch', './assets/sounds/fiercepunchA3.wav',);
  this.load.audio('lightkick', './assets/sounds/lightkickA3.wav',);
  this.load.audio('lightpunch', './assets/sounds/lightpunchA3.wav',);
  this.load.audio('mediumpunch', './assets/sounds/mediumpunchA3.wav',);
  this.load.audio('memescream', './assets/sounds/memescream.wav',);

  // Load alphabet images (in a for loop to save space)
  for (let i in alphabet) {
    this.load.image(alphabet[i], "./assets/img/alphabet/"+alphabet[i]+".png");
  }

}
function create(){

  // Dictionary
  this.dictionary = new DICTIONARY();
  WORDS = this.dictionary.WORDS;
  
  // Background
  // NOTE: We'll be using config.width or height a lot to get the dimensions of our game
  const bg = this.add.image(config.width / 2, config.height / 2, "background");
  bg.setDisplaySize(config.width, config.height);

  // Platforms
  let platforms = this.physics.add.staticGroup();

  platforms.create(config.width / 8, (config.height / 2) + 100, 'ground')
    .setScale(0.5);

  platforms.create((config.width / 8) + 200, (config.height / 2) + 100, 'ground')
  .setScale(0.5);

  // Add A-Z as clickable keys for our game
  this.keys = this.input.keyboard.addKeys(alphabet.join(","));
  // Add spacebar for testing attacks I guess
  this.keys.SPACE = this.input.keyboard.addKey
        (Phaser.Input.Keyboard.KeyCodes.SPACE);

  // Skeleton Enemy
  this.skeleton = this.physics.add.sprite(config.width / 8 + 50, config.height / 2, 'skeleton')
    .setScale(0.25)
    .setBounce(0.2)
    .setCollideWorldBounds(true);
  this.skeleton.flipX = true;
  
  // Add Player Character
  this.PlayerCharacter = new PlayerCharacter(this, config.width / 8, config.height / 2)

  // Pick & display first word
  currentWord = newWord(WORDS);
  currentWordImg = currentWord.slice(0);
  this.wordContainer = this.add.container(config.width / 2, config.height / 5);
  newWordToScreen(this);

  // Add round timer to screen
  this.timertext = this.add
      .text(config.width / 2, 10, ("Time Left: " + timer), {
        font: "18px monospace",
        fill: "#000000",
        padding: { x: 20, y: 10 },
        backgroundColor: "#ffffff",
        originX : 0.5
      });
  this.timertext.x -= this.timertext.width / 2;

  // Add players total word combo to screen
  this.combo = 3;
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
  this.physics.add.overlap(this.skeleton, this.PlayerCharacter.hadoken, hitSkeleton, null, this);

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
  
  // Attack *Hit* Sound Array
  this.sounds = {};
  this.sounds.hits = ['fiercepunch', 'fiercekick', 'lightpunch', 'lightkick', 'mediumpunch']; 

  // Game timer event
  this.time.addEvent({ delay: 1000, callback: countDown, callbackScope: this, repeat: (this.combo - 1)});
}

function update() {
  if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) {
    this.PlayerCharacter.AkumaUppercut(this);
  }
  // If there are characters left to type
  if (currentWord.length > 0) {
    
    // If the A-Z keyboard key that matches currentWord[0] is being pressed.
    if (Phaser.Input.Keyboard.JustDown(this.keys[currentWord[0]])) {

      // Color it's sprite green, and push it to the back of the array.
      currentWordImg[0].setTint(0x00ff00);
      currentWordImg.push(currentWordImg.shift());

      // Now make shift the array making currentWord[1] the new [0]
      currentWord.shift();
    }

  // If there are not characters left to type,
  } else {
    for (let i in currentWordImg) {
      // Destroy the word's sprites
      currentWordImg[i].destroy();
    }
    // Add to combo
    this.combo += 1;
    this.combotext.setText("COMBO: " + this.combo);

    // New word to screen
    currentWord = newWord(WORDS);
    newWordToScreen(this);

    // Attack the enemy
    this.PlayerCharacter.akumaAttack(this);
  }

  // If the round is over and we haven't thrown the switch yet,
  if (timer === 0 && roundEndSwitch === 0){
    // Throw the switch
    roundEndSwitch = 1;

    //let meme = this.sound.add('memescream');
    //meme.play();

    // End of round function
    roundEnd(this);
  }
}

// Grab a random word from an array of words
function newWord(arrayOfWords) {

  // Generate random array index
  const randIndex = Math.floor(Math.random() * arrayOfWords.length);

  // Output random word
  return arrayOfWords[randIndex].toUpperCase().split(""); // LOOKUP INNERHTML

}

// Generate a word's letters in an array, and assign sprites to them
function newWordToScreen(scene) {
  // ASKING FOR HELP, Why do I have to pass scene in here? 

  // X location of where to put the word


  // if this isn't the first time we've used currentWordImg,
  // erase it and make it the new word character array
  if (currentWordImg > currentWord.length) {
    currentWordImg = currentWord.slice(0);
  }

  // Assign letters to sprites and place them on screen

  let xCharacterOffset = 40;
  for (let i = 0; i < currentWord.length; i++) {
    
                                    // (x, y, key)
    currentWordImg[i] = scene.add.image(i * xCharacterOffset, 0, currentWord[i]);
      //.setOrigin(0)

    scene.wordContainer.add([currentWordImg[i]]);
  }
  // Currently, only the first character is centered
  // Center the whole word by using 
  scene.wordContainer.x = 
  //(game width center) - (half of (wordlength * x coordinate offsets) 
  (config.width / 2 - (((currentWord.length * xCharacterOffset) - 40 ) / 2));
}

// Called when our invisible hadoken connects with the skeleton
function hitSkeleton(skeleton, hadoken) {

  // Set skeletons velocityX to 0 so he doesn't go flying
  skeleton.setVelocityX(0);
  // Destroy the projectile
  hadoken.destroy()

  // Emit bones and blood
  this.particles.bone.emitParticleAt(skeleton.x, skeleton.y);
  this.particles.bloodchunk.emitParticleAt(skeleton.x, skeleton.y);

  this.particles.hadoken.setVisible(false);

  // Hit sound effect tied to hadoken exploding
  let hitSounds = this.sounds.hits

  // Grab a random hitsound from sounds.hits array
  let random = Math.floor(Math.random() * hitSounds.length)
  let randomHitSound = this.sound.add(hitSounds[random]);
  randomHitSound.play();

  // ASK FOR HELP OR FIX YOURSELF : Camera shaking everything. shake skeleton only?
  this.cameras.main.setName('cam1');
  // Camera shake
  const shakecam = this.cameras.add().setName('shakecam');
  shakecam.ignore = (this.timertext);
  shakecam.shake(100, 0.01);

}

// Called by our create() game timer event
function countDown() {
  timer--;
  this.timertext.setText("Time Left: " + timer);
}

// End of round function
function roundEnd(scene) {
  // Destroy text on screen
  scene.combotext.destroy();
  scene.timertext.destroy();
    for (let i in currentWordImg) {
     currentWordImg[i].destroy();
    }
  // Call the attack function with end of round = true.
  scene.PlayerCharacter.superCombo(scene, scene.combo)
}