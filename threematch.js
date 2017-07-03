var player;
var platforms;
var cursors;

var stars;
var score = 0;
var scoreText;

// the game
var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'game',
    {preload: preload, create: create, update: update});

function preload() {
    // background
    game.load.image('stone', 'assets/stone_light_2.jpg');
    game.load.image('ground', 'assets/ground.png');

    // sprite atlas
    game.load.atlasJSONArray('threematch', 'assets/threematch.png', 'assets/threematch.json');
}



function create() {
    // physics engine
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // background
    var stone = game.add.sprite(0, 0, 'stone');
    stone.height = HEIGHT;
    stone.width = WIDTH;

    var ground = game.add.sprite(0, HEIGHT / 30, 'ground');
    ground.height = HEIGHT;
    ground.width = WIDTH;

    // gemGroup group
    medalGroup = game.add.group();
    iceGroup = game.add.group();
    gemGroup = game.add.group();
    removedMedalGroup = game.add.group();

    // initialise grids and sprites
    initMedalGrid(LEVEL_1_TOTAL_MEDALS, medalGroup);
    initIceGrid(iceGroup);
    initGemGrid(gemGroup);

    // add functions for clicking on gems
    game.input.onDown.add(gemSelect);
    game.input.onUp.add(gemDeselect);


    // OLD STUFF BELOW
    // our controls
    cursors = game.input.keyboard.createCursorKeys();

    // setup up SCORE text
    var scroreT = ("        " + 0).slice(-8);
    var movesT = ("      " + 20).slice(-6);
    var medalsT = ("      " + 3).slice(-6);
    scoreText = game.add.text(16, HEIGHT - 3 * TEXT_HEIGHT, 'Score: ' + scroreT, {fontSize: '32px', fill: '#000'});
    movesText = game.add.text(16, HEIGHT - 2 * TEXT_HEIGHT, 'Moves: ' + movesT, {fontSize: '32px', fill: '#000'});
    medalsText = game.add.text(16, HEIGHT - 1 * TEXT_HEIGHT, 'Medals: ' + medalsT, {fontSize: '32px', fill: '#000'});
    highScoreText = game.add.text(WIDTH - WIDTH * 0.38, HEIGHT - 2 * TEXT_HEIGHT, 'High Score: ', {
        fontSize: '32px',
        fill: '#000'
    });
    highScoreText = game.add.text(WIDTH - WIDTH * 0.33, HEIGHT - 1 * TEXT_HEIGHT, '000,000', {
        fontSize: '32px',
        fill: '#000'
    });

}

function update() {
}

