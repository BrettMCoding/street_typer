import PlayerCharacter from "./akuma.js";
import Boss from "./anakaris.js";

class PreGameScene extends Phaser.Scene {
  constructor() {
      super({ key: 'PreGameScene'});
  }

create(){
  // Background
  // NOTE: We'll be using this.sys.game.config.width or height a lot to get the dimensions of our game
  this.background = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, "background");
  this.background.play("background");

  this.preGameTimer = 3

  // Platforms
  let platforms = this.physics.add.staticSprite(this.sys.game.config.width / 2, this.sys.game.config.height - 50, 'ground').setAlpha(0.0);

  // Add Player Character
  this.PlayerCharacter = new PlayerCharacter(this, this.sys.game.config.width / 8, this.sys.game.config.height / 2 + 180)
  this.PlayerCharacter.akuma.anims.play('supercharge');


  // Add Boss
  this.particles = {};
  this.particles.bossChunk = this.add.particles('anakaris_chunk1').setDepth(15);
  this.particles.bossChunkTwo = this.add.particles('anakaris_chunk2').setDepth(15);

  this.boss = new Boss({ scene: this, x: 950, y: 670 });
  this.boss.anims.play('bossintro');

  let bossintro = this.sound.add('bosssoundintro');
  bossintro.play();

  // Add 3 second countdown timer to screen
  this.preGameTimerText = this.add
      .text(this.sys.game.config.width / 2, 200, (this.preGameTimer), {
        fontFamily: "arcade",
        fontSize: 100,
        fill: "#ffffff",
        padding: { x: 20, y: 10 },
        originX : 0.5
      }).setStroke('#312088', 6)
      .setDepth(10);
  // origin and setOrigin are used to change the pivot point of things,
  // but I can't get it to work great? So width division like below is used a lot
  this.preGameTimerText.x -= this.preGameTimerText.width / 2;
        
  // Physics colliders
  this.physics.add.collider(this.PlayerCharacter.akuma, platforms);
  this.physics.add.collider(this.boss, platforms);


  let go = this.sound.add('321go')
  go.play();

  // Game timer event. Every 1 second, call countDown function. repeat (this.timer) times
  this.time.addEvent({ delay: 1000, callback: this.preGameCountDown, callbackScope: this, repeat: (this.preGameTimer)});
  this.time.addEvent({ delay: 3000, callback: this.roundStart, callbackScope: this});


}

  update() {
  }

  // Called by our create() game this.timer event
  preGameCountDown() {
    this.preGameTimer--;
    this.preGameTimerText.setText(this.preGameTimer);
  }

  // End of PreGameScene function
  roundStart() {
    this.scene.start('GameScene');
  }
}

export default PreGameScene;
