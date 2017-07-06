// var score = 0;
// var scoreText;

var scoreText;
var movesText;
var medalsText;
var levelText;

document.getElementById('progress').style.width = WIDTH + 'px';

// the game
var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'game');
// var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'game',
//     {preload: preload, create: create, update: update});

game.state.add('load', loadState);
game.state.add('intro', introState);
game.state.add('play', playState);
// game.state.add('finishedLevel', finishedLevelState);

game.state.start('load');

// function preload() {
    // background
    // game.load.image('stone', 'assets/stone_light_2.jpg');
    // game.load.image('ground', 'assets/ground.png');
    // game.load.image('grid', 'assets/grid.png');
    //
    // // sprite atlas
    // game.load.atlasJSONArray('threematch', 'assets/threematch.png', 'assets/threematch.json');
// }


// function create() {
    // gameID = (new Date()).getTime() + '-' + Math.floor(Math.random() * 1E16);
    // TERMINATED = false;
    // SCORE = 0;
    // lineNumber = 0;
    //
    // TOTAL_MOVES = MOVES_LEFT = movesPerLevel[level];
    // totalMedals = medalsLeft = medalsPerLevel[level];
    // ICE_ROWS = iceRowsPerLevel[level];
    //
    // // physics engine
    // game.physics.startSystem(Phaser.Physics.ARCADE);
    //
    // // background
    // var stone = game.add.sprite(0, 0, 'stone');
    // stone.height = HEIGHT;
    // stone.width = WIDTH;
    //
    // var ground = game.add.sprite(0, HEIGHT / 30, 'ground');
    // ground.height = HEIGHT;
    // ground.width = WIDTH;
    //
    // var grid = game.add.sprite(MARGIN_H, MARGIN_V, 'grid');
    // grid.height = grid.width = ROWS * CELL;
    //
    // // gemGroup group
    // medalGroup = game.add.group();
    // iceGroup = game.add.group();
    // gemGroup = game.add.group();
    // removedMedalGroup = game.add.group();
    //
    // // initialise grids and sprites
    // initMedalGrid(medalsLeft, medalGroup);
    // initIceGrid(iceGroup);
    // initGemGrid(gemGroup);
    //
    // startFile(gameID, MOVES_LEFT, medalsLeft);
    // sendData(gameID, lineNumber++, 'start');
    // sendData(gameID, lineNumber++, getGameState());
    //
    // // add functions for clicking on gems
    // game.input.onDown.add(gemSelect);
    // game.input.onUp.add(gemDeselect);
    //
    // // setup up SCORE text
    // var scroreT = ("        " + 0).slice(-8);
    // var movesT = ("      " + MOVES_LEFT).slice(-6);
    // var medalsT = ("      " + medalsLeft).slice(-6);
    // var inset = 16 * WIDTH / 450;
    // scoreText = game.add.text(inset, HEIGHT - 3 * TEXT_HEIGHT, 'Score: ' + scroreT, fontSizeColour);
    // movesText = game.add.text(inset, HEIGHT - 2 * TEXT_HEIGHT, 'Moves: ' + movesT, fontSizeColour);
    // medalsText = game.add.text(inset, HEIGHT - 1 * TEXT_HEIGHT, 'Medals: ' + medalsT, fontSizeColour);
    // levelText = game.add.text(WIDTH - WIDTH / 4, HEIGHT - 1 * TEXT_HEIGHT, 'Level: ' + (level + 1), fontSizeColour);
// }

// function update() {
// }

document.getElementById('changeName').onclick = changeName;

updateHighScores(0);
updateHighScores(1);
updateHighScores(2);

var nickName = localStorage['nickName'] || null;

if (nickName === null || nickName === '') {
    changeName();
} else {
    updateUserScore(nickName);
}

