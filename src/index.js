import BootScene from "./BootScene.js"
import MenuScene from "./MenuScene.js"
import HelpScene from "./HelpScene.js"
import PreGameScene from "./PreGameScene.js"
import GameScene from "./GameScene.js"

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 736,
  parent: "game-container", // Id of the DOM element to add the canvas to
  scene: [BootScene, MenuScene, HelpScene, PreGameScene, GameScene],
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      gravity: { y: 1000 }
    }
  }
};

const game = new Phaser.Game(config);