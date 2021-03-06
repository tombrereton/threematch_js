var playState = {
    create: function () {
        game.input.onDown.remove(playState.create);

        gameID = (new Date()).getTime() + '-' + Math.floor(Math.random() * 1E16);
        TERMINATED = false;
        SCORE = 0;
        lineNumber = 0;

        TOTAL_MOVES = MOVES_LEFT = movesPerLevel[level];
        totalMedals = medalsLeft = medalsPerLevel[level];
        ICE_ROWS = iceRowsPerLevel[level];

        // physics engine
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // background
        var stone = game.add.sprite(0, 0, 'stone');
        stone.height = HEIGHT;
        stone.width = WIDTH;

        var ground = game.add.sprite(0, HEIGHT / 30, 'ground');
        ground.height = HEIGHT;
        ground.width = WIDTH;

        var grid = game.add.sprite(MARGIN_H, MARGIN_V, 'grid');
        grid.height = grid.width = ROWS * CELL;

        // gemGroup group
        medalGroup = game.add.group();
        iceGroup = game.add.group();
        gemGroup = game.add.group();
        removedMedalGroup = game.add.group();

        // initialise grids and sprites
        initMedalGrid(medalsLeft, medalGroup);
        initIceGrid(iceGroup);
        initGemGrid(gemGroup);

        shuffleLoop(function () {});

        startFile(gameID, MOVES_LEFT, medalsLeft);
        // sendData(gameID, lineNumber++, 'start');
        // sendData(gameID, lineNumber++, getGameState());

        // add functions for clicking on gems
        game.input.onDown.add(gemSelect);
        game.input.onUp.add(gemDeselect);

        // setup up SCORE text
        var scoreT = ("        " + 0).slice(-8);
        var movesT = ("      " + MOVES_LEFT).slice(-6);
        var medalsT = ("      " + medalsLeft).slice(-6);
        var inset = 16 * WIDTH / 450;
        scoreText = game.add.text(inset, HEIGHT - 3 * TEXT_HEIGHT, 'Score: ' + scoreT, fontSizeColour);
        movesText = game.add.text(inset, HEIGHT - 2 * TEXT_HEIGHT, 'Moves left: ' + movesT, fontSizeColour);
        medalsText = game.add.text(inset, HEIGHT - 1 * TEXT_HEIGHT, 'Medals left: ' + medalsT, fontSizeColour);
        levelText = game.add.text(WIDTH - WIDTH / 4, HEIGHT - 1 * TEXT_HEIGHT, 'Level: ' + (level + 1), fontSizeColour);
    }
};
