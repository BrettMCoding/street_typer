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



function preload(){
  // Runs once and loads assets
  // NOTE: "this" === Phaser.Scene

  // Load image assets
  // Loop for background frames
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
function create(){
  
  // this.currentWord will be a random word from our Dictionary
  this.currentWord;
  
  // this.currentWordImg will be an Array of sprites, where each value is one letter
  this.currentWordImg;
  
  // Timer. Adjust to change the length of a round
  this.timer = 10;
  
  // this.WORDS will be our imported dictionary of this.words in an array
  this.WORDS;
  // When this.timer hits 0 we will throw this to 1 to begin the end of round mechanics
  this.roundEndSwitch = 0;
  
  // Players total word combo
  this.combo = 3;

  // At the end of the round
  this.roundEndCombo = 0;
  
  // Dictionary
  this.dictionary = new DICTIONARY();
  this.WORDS = this.dictionary.WORDS;
  
  // Points
  this.score = 0;
  
  // Background
  // NOTE: We'll be using config.width or height a lot to get the dimensions of our game
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
  this.background = this.add.sprite(config.width / 2, config.height / 2, "background");
  this.background.play("background");

  // Platforms
  let platforms = this.physics.add.staticGroup();

  platforms.create(config.width / 8, (config.height / 2) + 100, 'ground')
    .setScale(0.5);

  platforms.create((config.width / 8) + 200, (config.height / 2) + 100, 'ground')
  .setScale(0.5);

  // Add A-Z as clickable keys for our game
  this.keys = this.input.keyboard.addKeys(this.alphabet.join(","));

  // Add spacebar for testing attacks
  this.keys.SPACE = this.input.keyboard.addKey
        (Phaser.Input.Keyboard.KeyCodes.SPACE);

  // Skeleton Enemy
  this.skeleton = this.physics.add.sprite(config.width / 8 + 70, config.height / 2 - 40, 'skeleton')
    .setScale(0.35)
    .setBounce(0.2)
    .setCollideWorldBounds(true)
    .setFlipX(true);
  
  // Add Player Character
  this.PlayerCharacter = new PlayerCharacter(this, config.width / 8, config.height / 2)

  // Pick & display first word
  this.currentWord = newWord(this.WORDS);
  this.currentWordImg = this.currentWord.slice(0);
  this.wordContainer = this.add.container(config.width / 2, config.height / 5);
  newWordToScreen(this);

  // Add round timer to screen
  this.timertext = this.add
      .text(config.width / 2, 10, ("TIME LEFT: " + this.timer), {
        fontFamily: "Impact",
        fontSize: 50,
        fill: "#f8d838",
        padding: { x: 20, y: 10 },
        originX : 0.5
      }).setStroke('#312088', 3)
      .setDepth(10);
  // origin and setOrigin are used to change the pivot point of things,
  // but I can't get it to work great? So width division like below is used a lot
  this.timertext.x -= this.timertext.width / 2;


  // comboContainer holds comboText and comboImage to move them together
  this.comboContainer = this.add.container(16, 16);

  // comboImage is a prebuilt "COMBO" png from the arcade font      
  this.comboImage = this.add.image(70, 40, 'comboword')
    .setDepth(20)
    .setOrigin(0.5);
  
  // the combo integer
  this.comboText = this.add
      .text(15, 40, (this.combo), {
      fontFamily: "Impact",
      fontSize: 60,
      fill: "#f8d838",
      padding: { x: 20, y: 10 }})
      .setStroke('#312088', 3)
      .setOrigin(0.5);
  this.comboText.x = this.comboImage.x;
  this.comboText.y = 105;
  
  // add both to container and set depth so the explosion appears under the text
  this.comboContainer
        .add(this.comboText)
        .add(this.comboImage)
        .setDepth(10);
  
  // Add a tween animation that makes the combo number *pop* every +1
  this.comboTween = this.tweens.add({
    targets: this.comboText,
    scaleX: 2,
    scaleY: 2,
    duration: 50,
    yoyo: true,
    paused: true,
  });

  // Score text for every letter the player gets right
  this.scoreText = this.add
      .text(this.comboContainer.x, 500, ("TOTAL SCORE: " + this.score), {
      fontFamily: "Impact",
      fontSize: 60,
      fill: "#f8d838",
      padding: { x: 20, y: 10 }})
      .setStroke('#312088', 3)
      .setOrigin(0.5)
      .setVisible(false);
      this.scoreText.x = this.comboContainer.x
      this.scoreText.y = 500
        
  // Physics colliders
  this.physics.add.collider(this.PlayerCharacter.akuma, platforms);
  this.physics.add.collider(this.skeleton, platforms);
  this.physics.add.overlap(this.skeleton, this.PlayerCharacter.hadoken, hitSkeleton, null, this);

  // Particles
  this.particles = {};
  this.particles.bone = this.add.particles('bone');
  this.particles.bloodchunk = this.add.particles('bloodchunk');
  this.particles.fire = this.add.particles('fire');
  this.particles.vortex = this.add.particles('flares');
  this.particles.vortex2 = this.add.particles('flares');
  
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

  // add fire to attach to combo
  this.particles.fire.createEmitter({
      alpha: { start: 1, end: 0 },
      scale: { start: 0.5, end: 2.5 },
      quantity: 9,
      speed: {min: 40, max: 200},
      //tint: { start: 0xff945e, end: 0xff945e },
      angle: { min: 0, max: 360 },
      rotate: { min: -45, max: 0 },
      lifespan: { min: 100, max: 200 },
      blendMode: 'ADD',
      frequency: 1100,
      maxParticles: 10,
      x: this.comboText.getCenter().x + 17,
      y: this.comboText.getCenter().y + 20,
      on: false
  });

  // Super combo vortex particles
  this.circle = new Phaser.Geom.Circle(this.PlayerCharacter.akuma.x, this.PlayerCharacter.akuma.y, 500);
  this.particles.vortex.createEmitter({
    x: 0,
    y: 0,
    moveToX: {min: this.PlayerCharacter.akuma.x -15, max: this.PlayerCharacter.akuma.x +15},
    moveToY: {min: this.PlayerCharacter.akuma.y -15, max: this.PlayerCharacter.akuma.y +15},
    lifespan: {min:100,max:300},
    quantity: 100,
    scale: { start: 0.00, end: 0.08 },
    delay: {min:0, max:500},
    blendMode: 'ADD',
    emitZone: { source: this.circle, type: 'random', quantity: 1 },
    on: false
});
  // Super combo airborn particles
  this.circle2 = new Phaser.Geom.Circle(this.PlayerCharacter.akuma.x, this.PlayerCharacter.akuma.y + 100, 100);
  this.particles.vortex2.createEmitter({
    x: 0,
    y: 0,
    moveToX: {min: this.PlayerCharacter.akuma.x -50, max: this.PlayerCharacter.akuma.x +50},
    moveToY: {min: this.PlayerCharacter.akuma.y -50, max: this.PlayerCharacter.akuma.y -100},
    lifespan: {min:200,max:400},
    quantity: 20,
    scale: { start: 0.00, end: 0.08 },
    delay: {min:0, max:500},
    blendMode: 'ADD',
    emitZone: { source: this.circle, type: 'random', quantity: 1 },
    on: false
});
  
  // add super combo lazer
  this.anims.create({ key: 'blast', frames: this.anims.generateFrameNames('lazer', { prefix: 'lazer_', start: 0, end: 22, zeroPad: 2 }), frameRate: 50});
  this.lazer = this.add.sprite(this.PlayerCharacter.akuma.x, 120 , "lazer").setScale(1.3);

  this.lazer2 = this.add.sprite(config.width / 2 + 300, this.PlayerCharacter.akuma.y, "lazer").setAlpha(1, 1, 0, 1 ).setScale(2).setAngle(90);


  // Attack *Hit* Sound Array
  this.sounds = {};
  this.sounds.hits = ['fiercepunch', 'fiercekick', 'lightpunch', 'lightkick', 'mediumpunch']; 

  // Game timer event. Every 1 second, call countDown function. repeat (this.timer) times
  this.time.addEvent({ delay: 1000, callback: countDown, callbackScope: this, repeat: (this.timer)});
}

function update() {

  // spacebar super for testing
  if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) {
    this.PlayerCharacter.superComboOpeningAnimation(this);
  }

  // If there are characters left to type
  if (this.currentWord.length > 0) {
    
    // If the A-Z keyboard key that matches this.currentWord[0] is being pressed AND the round isn't over
    if (Phaser.Input.Keyboard.JustDown(this.keys[this.currentWord[0]]) & this.roundEndSwitch !== 1) {

      // Color it's sprite green, and push it to the back of the array.
      this.currentWordImg[0].setTint(0x00ff00);
      this.currentWordImg.push(this.currentWordImg.shift());
      this.score += 5

      // Now shift the array making this.currentWord[1] the new [0]
      this.currentWord.shift();
    }

  // If there are not characters left to type,
  } else {
    for (let i in this.currentWordImg) {
      // Destroy the word's sprites
      this.currentWordImg[i].destroy();
    }

    // Add to combo
    this.combo += 1;
    this.comboText.setText(this.combo);

    // Player comboText animation
    this.comboTween.restart();

    // New word to screen
    this.currentWord = newWord(this.WORDS);
    newWordToScreen(this);

    // Attack the enemy
    this.PlayerCharacter.akumaAttack(this);
  }

  // If the round is over and we haven't thrown the switch yet,
  if (this.timer === 0 && this.roundEndSwitch === 0){
    // Throw the switch
    this.roundEndSwitch = 1;

    // let meme = this.sound.add('memescream');
    // meme.play();

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

  // if this isn't the first time we've used currentWordImg,
  // erase it and make it the new word character array
  if (scene.currentWordImg > scene.currentWord.length) {
    scene.currentWordImg = scene.currentWord.slice(0);
  }

  // Assign sprites to currentWord's letters, and place them on screen
  let xCharacterOffset = 40;
  for (let i = 0; i < scene.currentWord.length; i++) {
    
    scene.currentWordImg[i] = scene.add.image(i * xCharacterOffset, 0, scene.currentWord[i]);

    scene.wordContainer.add([scene.currentWordImg[i]]);
  }
  // Currently, only the first character is centered
  // Center the whole word by using 
  scene.wordContainer.x = 
  //(game width center) - (half of (wordlength * x coordinate offsets) 
  (config.width / 2 - (((scene.currentWord.length * xCharacterOffset) - 40 ) / 2));
}

// Called when our invisible hadoken connects with the skeleton
function hitSkeleton(skeleton, hadoken) {

  // Set skeletons velocityX to 0 so he doesn't go flying
  skeleton.setVelocityX(0);
  // Destroy the projectile
  hadoken.destroy()

  // Emit bones and blood and combo fire
  this.particles.bone.emitParticleAt(skeleton.x, skeleton.y);
  this.particles.bloodchunk.emitParticleAt(skeleton.x, skeleton.y);

  // Hit sound effect tied to hadoken exploding
  let hitSounds = this.sounds.hits

  // Grab a random hitsound from sounds.hits array
  let random = Math.floor(Math.random() * hitSounds.length)
  let randomHitSound = this.sound.add(hitSounds[random]);
  randomHitSound.play();
  
}

// Called by our create() game this.timer event
function countDown() {
  this.timer--;
  this.timertext.setText("TIME LEFT: " + this.timer);
    
  if (this.timer === 5) {
    // play 5 sec countdown sound
    this.timertext.setTint(0xff0000);
  }
}

// End of round function
function roundEnd(scene) {
  scene.timertext.destroy();
  scene.comboContainer.setScale(1.5);
  scene.comboContainer.x = (config.width / 2) - (scene.comboImage.width / 2);
  scene.comboContainer.y = 50;

  scene.comboContainer.setVisible(false)

  // destroy this.currentWordImg
  for (let i in scene.currentWordImg) {
    scene.currentWordImg[i].destroy();
  }
  // Call the attack function with end of round = true & combo > 0.
  if (scene.combo > 0) {
  scene.PlayerCharacter.superComboOpeningAnimation(scene, scene.PlayerCharacter)
  }
}

