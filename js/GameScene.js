import PlayerCharacter from "./akuma.js";
import DICTIONARY from "./words.js";

class GameScene extends Phaser.Scene {
  constructor() {
      super({ key: 'GameScene'});
  }

create(){
  this.alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

  this.numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];


  // this.currentWord will be a random word from our Dictionary
  this.currentWord;
  
  // this.currentWordImg will be an Array of sprites, where each value is one letter
  this.currentWordImg;
  
  // Timer. Adjust to change the length of a round
  this.timer = 2;
  
  // this.WORDS will be our imported dictionary of this.words in an array
  this.WORDS;

  // When this.timer hits 0 we will throw this to 1 to begin the end of round mechanics
  this.roundEndSwitch = 0;
  
  // Players total word combo
  this.combo = 10;

  // At the end of the round
  this.roundEndCombo = 0;
  
  // Dictionary
  this.dictionary = new DICTIONARY();
  this.WORDS = this.dictionary.WORDS;
  
  // Points
  this.score = 0;

  
  // Background
  // NOTE: We'll be using this.sys.game.config.width or height a lot to get the dimensions of our game
  this.background = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, "background");
  this.background.play("background");

  // Add starting "GO!" text to the screen
  this.goText = this.add
      .text(this.sys.game.config.width / 2, 200, ("GO!"), {
        fontFamily: "arcade",
        fontSize: 100,
        fill: "#ffffff",
        padding: { x: 20, y: 10 },
        originX : 0.5
      }).setStroke('#312088', 6)
      .setDepth(10);
      this.goText.x -= this.goText.width / 2;

      this.tweens.add({
        targets: this.goText,
        alpha: { value: 0, duration: 1, ease: 'Power1', delay: 1000 },
      });

  // Platforms
  let platforms = this.physics.add.staticSprite(this.sys.game.config.width / 2, this.sys.game.config.height - 50, 'ground').setAlpha(0.0);


  // Add A-Z as clickable keys for our game
  this.keys = this.input.keyboard.addKeys(this.alphabet.join(","));

  // Add spacebar for testing attacks
  this.keys.SPACE = this.input.keyboard.addKey
        (Phaser.Input.Keyboard.KeyCodes.SPACE);

  // Boss
  this.boss = this.physics.add.sprite(1100, 400, 'anakaris')
    .setCollideWorldBounds(true)
    .setFlipX(true);

  // Skeleton Enemy
  this.skeletons = this.add.group();
  this.summonNewSkeleton(this);
  
  // Add Player Character
  this.PlayerCharacter = new PlayerCharacter(this, this.sys.game.config.width / 8, this.sys.game.config.height / 2 + 180)

  // Pick & display first word
  this.currentWord = this.newWord(this.WORDS);
  this.currentWordImg = this.currentWord.slice(0);
  this.wordContainer = this.add.container(this.sys.game.config.width / 2, this.sys.game.config.height / 5);
  this.newWordToScreen(this);

  // Add round timer to screen
  this.timertext = this.add
      .text(this.sys.game.config.width / 2, 10, ("TIME LEFT: " + this.timer), {
        fontFamily: "arcade",
        fontSize: 50,
        fill: "#ffffff",
        padding: { x: 20, y: 10 },
        originX : 0.5
      }).setStroke('#312088', 6)
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
      fontFamily: "arcade",
      fontSize: 80,
      fill: "#ffffff",
      padding: { x: 20, y: 10 }})
      .setStroke('#312088', 6)
      .setOrigin(0.5);
  this.comboText.x = this.comboImage.x;
  this.comboText.y = 105;
  
  // add both to container and set depth so the explosion appears under the text
  this.comboContainer
        .add(this.comboText)
        .add(this.comboImage)
        .setDepth(10);
  
  // this.comboContainer.tweentarget = this.add.container(0, 0);

  // this.generateNumberImg(this.combo, this.comboContainer.tweentarget, 15, 60, this);

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
      fontFamily: "arcade",
      fontSize: 60,
      fill: "#f8d838",
      padding: { x: 20, y: 10 }})
      .setStroke('#312088', 6)
      .setOrigin(0.5)
      .setVisible(false);
      this.scoreText.x = this.comboContainer.x
      this.scoreText.y = 500
        
  // Physics colliders
  this.physics.add.collider(this.PlayerCharacter.akuma, platforms);
  this.physics.add.collider(this.skeletons, platforms);
  this.physics.add.collider(this.boss, platforms);
  this.physics.add.overlap(this.skeletons, this.PlayerCharacter.hadoken, this.hitSkeleton, null, this);
  this.physics.add.overlap(this.boss, this.PlayerCharacter.hadoken, this.hitBoss, null, this);

  // Particles
  this.particles = {};
  this.particles.bone = this.add.particles('bone');
  this.particles.bloodchunk = this.add.particles('bloodchunk');
  this.particles.fire = this.add.particles('fire');
  this.particles.vortex = this.add.particles('flares');
  this.particles.vortex2 = this.add.particles('flares');
  this.particles.summonSkeleton = this.add.particles('sparklered');
  
  this.particles.bone.createEmitter({
    x: 200,
    y: 300,
    lifespan: 2000,
    quantity: {min: 20, max: 30},
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

  // Summon Skeleton particles
  this.particles.summonSkeleton.createEmitter({
    x: { min: 260, max: 340 },
    y: this.sys.game.config.height / 2 + 280,
    lifespan: { min: 300, max: 500 },
    speed: { min: 20, max: 1000 },
    angle: 270,
    scale: { start: 0.2, end: 0 },
    quantity: 100,
    blendMode: 'ADD',
    on:false
  });
  
  // add super combo lazer
  this.anims.create({ key: 'blast', frames: this.anims.generateFrameNames('lazer', { prefix: 'lazer_', start: 0, end: 22, zeroPad: 2 }), frameRate: 50});
  this.lazer = this.add.sprite(this.PlayerCharacter.akuma.x, 120 , "lazer").setScale(1.3);

  this.lazer2 = this.add.sprite(this.sys.game.config.width / 2 + 300, this.PlayerCharacter.akuma.y, "lazer").setAlpha(1, 1, 0, 1 ).setScale(2).setAngle(90);


  // Attack *Hit* Sound Array
  this.sounds = {};
  this.sounds.hits = ['fiercepunch', 'fiercekick', 'lightpunch', 'lightkick', 'mediumpunch']; 

  // Game timer event. Every 1 second, call countDown function. repeat (this.timer) times
  this.time.addEvent({ delay: 1000, callback: this.countDown, callbackScope: this, repeat: (this.timer)});

}

update() {

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

    // combo text font test
    // this.generateNumberImg(this.combo, this.comboContainer.tweentarget, 15, 60, this);

    // Player comboText animation
    this.comboTween.restart();

    // New word to screen
    this.currentWord = this.newWord(this.WORDS);
    this.newWordToScreen(this);

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
    this.roundEnd(this);
  }

  if (this.scoreTween !== undefined) {
    this.scoreText.setText("TOTAL SCORE: " + Math.floor(this.scoreTween.getValue()))
  }
}

// Grab a random word from an array of words
newWord(arrayOfWords) {

  // Generate random array index
  const randIndex = Math.floor(Math.random() * arrayOfWords.length);

  // Output random word
  return arrayOfWords[randIndex].toUpperCase().split(""); // LOOKUP INNERHTML

}

// Generate a word's letters in an array, and assign sprites to them
newWordToScreen(scene) {

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
  (this.sys.game.config.width / 2 - (((scene.currentWord.length * xCharacterOffset) - 40 ) / 2));
}

// Called when our invisible hadoken connects with the skeleton
hitSkeleton(skeleton, hadoken) {
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

  skeleton.destroy();

  this.particles.summonSkeleton.emitParticle();

  this.summonNewSkeleton(this);
}

hitBoss(boss, hadoken) {
  hadoken.destroy()

  boss.setTint(0xff0000);

  this.time.addEvent({ delay: 50, callback: boss.clearTint, callbackScope: boss});

  // Hit sound effect tied to hadoken exploding
  let hitSounds = this.sounds.hits

  // Grab a random hitsound from sounds.hits array
  let random = Math.floor(Math.random() * hitSounds.length)
  let randomHitSound = this.sound.add(hitSounds[random]);
  randomHitSound.play();

  //stone particles

  //bigger bone particles
}

summonNewSkeleton(scene) {
  scene.skeletons.add
    (scene.physics.add.sprite(300, scene.sys.game.config.height / 2 + 80, 'skeleton')
    .setScale(0.0)
    .setBounce(0.2)
    .setAlpha(0.0)
    .setCollideWorldBounds(true)
    .setFlipX(true));

    this.tweens.add({
      targets: scene.skeletons.children.entries,
      alpha: { value: 1, duration: 250, ease: 'Power1',}
    });
    this.tweens.add({
      targets: scene.skeletons.children.entries,
      scaleX: 0.5,
      scaleY: 0.5,
      duration: 250,
    });
}

// Called by our create() game this.timer event
countDown() {
  this.timer--;
  this.timertext.setText("TIME LEFT: " + this.timer);
    
  if (this.timer === 5) {
    // play 5 sec countdown sound
    this.timertext.setTint(0xff0000);
  }
}

  // End of round function
  roundEnd(scene) {
    scene.timertext.destroy();
    scene.comboContainer.setScale(1.5);
    scene.comboContainer.x = (this.sys.game.config.width / 2) - (scene.comboImage.width / 2);
    scene.comboContainer.y = 50;
    
    scene.comboContainer.setVisible(false);
    
    // destroy this.currentWordImg
    for (let i in scene.currentWordImg) {
      scene.currentWordImg[i].destroy();
    }
    // Call the attack function with end of round = true & combo > 0.
    if (scene.combo > 0) {
      scene.PlayerCharacter.superComboOpeningAnimation(scene, scene.PlayerCharacter);
    }
  }

  roundEndScoreTally(scene) {
    
    // Add text animation for score
    scene.scoreTween = scene.tweens.addCounter({
    from: 0,
    to: scene.score,
    duration: (2.5 * scene.score)
    });

    
    scene.scoreText.x = scene.sys.game.config.width / 2;
    scene.scoreText.y = 605;
    scene.scoreText.setVisible(true);
  }

    
  superComboTally(scene) {
    scene.comboContainer.setVisible(true);
    
    scene.particles.fire.emitParticleAt(scene.comboContainer.x + 115, scene.comboContainer.y + 160);
    
    scene.roundEndCombo += 1
    scene.comboText.setText(scene.roundEndCombo);
    // Player comboText animation
    scene.comboTween.restart();
  }
}

export default GameScene;
