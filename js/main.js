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
let keys;
let alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
let alphaImg = alphabet.slice(0);
let currentWord;

function preload(){
  // Runs once and loads assets

  // NOTE: "this" === Phaser.Scene
  this.load.image("background", "./assets/img/background.gif")

  for (i in alphabet) {
    this.load.image(alphabet[i], "./assets/img/alphabet/"+alphabet[i]+".png");
  }

}
function create(){
  // Runs after assets are loaded

  // You can access the game's config to read the width & height
  const { width, height } = this.sys.game.config;
  //Background
  const bg = this.add.image(width / 2, height / 2, "background");
  bg.setDisplaySize(width, height);

  //whole alphabet on screen test
  // for (let i = 0; i < alphaImg.length; i++) {
  //   let ax = 50 + (i * 40);
  //   alphaImg[i] = this.add.image(ax, 300, alphabet[i]).setOrigin(0)
  // }

  keys = this.input.keyboard.addKeys(alphabet.join(","));

  // Pick & show random word
  function newWord(wordlist) {
    // Generate random array index
    const randIndex = Math.floor(Math.random() * wordlist.length);
    // Output random word
    return wordlist[randIndex]; // LOOKUP INNERHTML
  }
  currentWord = newWord(WORDS).toUpperCase();

  for (let i = 0; i < currentWord.length; i++) {
    // find letters in current word and set placement on screen with ax / y300
    let ax = (width / 2) + (i * 40);
    alphaImg[i] = this.add.image(ax, height/5, currentWord[i]).setOrigin(0);
  }

}
function update() {
  for (let i = 0; i < currentWord.length; i++) {
    alphaImg[i].setTint((keys[currentWord[i]].isDown) ? 0x00ff00 : 0xffffff);
  }
  // imageA.setAlpha((keys.A.isDown) ? 1 : 0.2);
  // imageB.setAlpha((keys.B.isDown) ? 1 : 0.2);
  // imageC.setAlpha((keys.C.isDown) ? 1 : 0.2);
  // imageD.setAlpha((keys.D.isDown) ? 1 : 0.2);
  // imageE.setAlpha((keys.E.isDown) ? 1 : 0.2);
  // imageF.setAlpha((keys.F.isDown) ? 1 : 0.2);
  // imageG.setAlpha((keys.G.isDown) ? 1 : 0.2);
  // imageH.setAlpha((keys.H.isDown) ? 1 : 0.2);
  // imageI.setAlpha((keys.I.isDown) ? 1 : 0.2);
  // imageJ.setAlpha((keys.J.isDown) ? 1 : 0.2);
  // imageK.setAlpha((keys.K.isDown) ? 1 : 0.2);
  // imageL.setAlpha((keys.L.isDown) ? 1 : 0.2);
  // imageM.setAlpha((keys.M.isDown) ? 1 : 0.2);
  // imageN.setAlpha((keys.N.isDown) ? 1 : 0.2);
  // imageO.setAlpha((keys.O.isDown) ? 1 : 0.2);
  // imageP.setAlpha((keys.P.isDown) ? 1 : 0.2);
  // imageQ.setAlpha((keys.Q.isDown) ? 1 : 0.2);
  // imageR.setAlpha((keys.R.isDown) ? 1 : 0.2);
  // imageS.setAlpha((keys.S.isDown) ? 1 : 0.2);
  // imageT.setAlpha((keys.T.isDown) ? 1 : 0.2);
  // imageU.setAlpha((keys.U.isDown) ? 1 : 0.2);
  // imageV.setAlpha((keys.V.isDown) ? 1 : 0.2);
  // imageW.setAlpha((keys.W.isDown) ? 1 : 0.2);
  // imageX.setAlpha((keys.X.isDown) ? 1 : 0.2);
  // imageY.setAlpha((keys.Y.isDown) ? 1 : 0.2);
  // imageZ.setAlpha((keys.Z.isDown) ? 1 : 0.2);
  // Runs once per frame for the duration of the scene
}