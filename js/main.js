const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 736,
  parent: "game-container", // Id of the DOM element to add the canvas to
  scene: {
    preload: preload,
    create: create,
    update: update
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

  for (i in alphabet) {
    this.load.image(alphabet[i], "./assets/img/alphabet/"+alphabet[i]+".png");
  }

}
function create(){
  //Background
  const bg = this.add.image(config.width / 2, config.height / 2, "background");
  bg.setDisplaySize(config.width, config.height);

  this.keys = this.input.keyboard.addKeys(alphabet.join(","));

  // Pick & show first word
  currentWord = newWord(WORDS);
  currentWordImg = currentWord.slice(0);
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
  }
}

function newWord(wordlist) {
  // Generate random array index
  const randIndex = Math.floor(Math.random() * wordlist.length);
  // Output random word
  return wordlist[randIndex].toUpperCase().split(""); // LOOKUP INNERHTML
}

function newWordToScreen(scene) {
  if (currentWordImg > currentWord.length) {
    currentWordImg = currentWord.slice(0);
  }

  for (let i = 0; i < currentWord.length; i++) {
    // find letters in current word and set placement on screen with ax / y300
    let ax = (config.width / 2) + (i * 40);
    currentWordImg[i] = scene.add.image(ax, config.height/5, currentWord[i]).setOrigin(0);
  }
}