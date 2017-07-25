// =========================================================
// Objects for entries in the grids

function GemObject(gemType, bonusType, gemSprite) {
    // instantiate with: var gemObject = new GemObject(1, 0, sprite);
    this.gemType = gemType;
    this.bonusType = bonusType;
    this.gemSprite = gemSprite;
}

function IceObject(layer, iceSprite) {
    // layer = -1 represents no ice
    this.layer = layer;
    this.iceSprite = iceSprite;
}

function MedalObject(portion, medalSpite) {
    // portion == -1 represents no portion
    // portion has values 0,1,2,3 == top-left,top-right,bottom-left, bottom-right
    this.portion = portion;
    this.medalSprite = medalSpite;
}

// =========================================================
// Initialise methods

function initMedalGrid(medals, medalGroup) {
    emptyGrid(medalArray);
    // emptyGrid(medalState);
    medalLocations = [];

    var i = 0;
    while (i < medals) {

        // get random top left corner position
        var row = parseInt(Math.random() * ICE_ROWS) + ROWS - ICE_ROWS;
        var col = parseInt(Math.random() * COLS);

        if (checkMedalBoundaries(row, col)) {
            addMedal(row, col, medalGroup);
            i++;
        }
    }
}

function initIceGrid(iceGroup) {
    emptyGrid(iceArray);

    for (var i = 0; i < ROWS; i++) {
        for (var j = 0; j < COLS; j++) {

            if (i >= (ROWS - ICE_ROWS)) {
                // create ice
                var ice = createIceSprite(i, j);
                iceGroup.add(ice);

                // add object to gemArray entry
                iceArray[i][j] = new IceObject(ICE_LAYERS, ice);
            } else {
                iceArray[i][j] = new IceObject(-1, null);
            }
        }
    }

}

function initGemGrid(spriteGroup) {
    for (var i = 0; i < ROWS; i++) {
        gemArray[i] = [];
        for (var j = 0; j < COLS; j++) {

            var type;
            var gemSprite; //= createGemSprite(type, i, j);

            do {
                // get gem details
                type = Math.floor(Math.random() * GEM_TYPES);
                var bonusType = 1;

                // assign object to entry
                gemArray[i][j] = new GemObject(type, bonusType, gemSprite);
            } while (checkInsertion(i, j));

            // create sprite once type is decided
            gemSprite = createGemSprite(type, i, j);
            gemArray[i][j].gemSprite = gemSprite;
            spriteGroup.add(gemSprite);
        }
    }
    selectedOrb = null;
}


// =========================================================
// Initialise helper methods

function emptyGrid(grid) {
    for (var i = 0; i < ROWS; i++) {
        grid[i] = [];
        for (var j = 0; j < COLS; j++) {
            grid[i][j] = -1
        }
    }
}

function checkMedalBoundaries(row, col) {
    if (row < ROWS - 1 && col < COLS - 1) {
        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < 2; j++) {
                if (medalArray[row + i][col + j] !== -1) {
                    return false;
                }
            }
        }
        return true;
    }
    return false;
}

function addMedal(row, col, medalGroup) {
    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 2; j++) {

            // get medal details
            var portion = j + 2 * i;
            var r = row + i;
            var c = col + j;
            var medalSprite;

            if (portion === 0) {
                medalSprite = createMedalSprite(row, col);
                medalGroup.add(medalSprite);
            } else {
                medalSprite = undefined;
            }


            medalArray[r][c] = new MedalObject(portion, medalSprite);
            if (portion === 0) {
                medalLocations.push([r, c, portion])
            }
        }
    }
}

function createGemSprite(type, row, col) {
    var y_coord = MARGIN_V + CELL / 2 + row * (CELL);
    var x_coord = MARGIN_H + CELL / 2 + col * (CELL);

    this.gemType = type;
    var name = "stone" + type + '/01';

    // add sprite and scale it
    var gem = game.add.sprite(x_coord, y_coord, 'threematch', name);
    gem.anchor.setTo(0.5, 0.5);
    gem.width = SPRITE_SIZE;
    gem.height = SPRITE_SIZE;
    gem.inputEnabled = true;
    // gem.events.onInputDown.add(gemSelect);

    // animations
    gem.animations.add('explode', [1, 2, 3, 4, 5, 6, 7, 8, 9], 25, false);
    gem.animations.add('type2', ['stone' + type + '/02'], 5, false);
    gem.animations.add('type3', ['stone' + type + '/03'], 10, false);
    gem.animations.add('type4', ['stone' + type + '/04'], 10, false);

    return gem;
}

function createMedalSprite(row, col) {
    var y_coord = MARGIN_V + CELL + row * (CELL);
    var x_coord = MARGIN_H + CELL + col * (CELL);
    var medal = game.add.sprite(x_coord, y_coord, 'threematch', 'medal/01');
    medal.anchor.setTo(0.5, 0.5);
    medal.width = 2 * (SPRITE_SIZE);
    medal.height = 2 * (SPRITE_SIZE);

    // animations
    var names = Phaser.Animation.generateFrameNames('medal/', 1, 4, '', 2);
    var names2 = Phaser.Animation.generateFrameNames('medal/', 4, 1, '', 2);
    names.push(names2);
    var anim = medal.animations.add('spin', names, 10, true);

    // stop animation after 3 loops
    anim.onLoop.add(medalAnimLoop, this);

    return medal;
}

function createIceSprite(row, col) {
    var y_coord = MARGIN_V + CELL / 2 + row * (CELL);
    var x_coord = MARGIN_H + CELL / 2 + col * (CELL);
    var ice = game.add.sprite(x_coord, y_coord, 'threematch', 'ice');
    ice.anchor.setTo(.5, .5);
    ice.width = CELL * 1.05;
    ice.height = CELL * 1.05;

    return ice;
}


function removeIce(row, col) {
    if (iceArray[row][col] !== -1) {
        var iceSprite = iceArray[row][col].iceSprite;
        var iceTween = game.add.tween(iceSprite).to({alpha: 0}, ICE_FADE_SPEED, Phaser.Easing.Linear.None, true, 0, 0, false);

        iceTween.onComplete.add(function () {
            if (iceArray[row][col] !== -1) {
                iceArray[row][col].iceSprite.kill();
            }
            iceArray[row][col] = -1;
            freeMedals();
        });
    }
}


function isFreeableMedal(row, col) {
    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 2; j++) {
            if (iceArray[row + i][col + j] !== -1) {
                return false;
            }
        }
    }
    return true;
}

function freeMedals() {
    for (var i = 0; i < medalLocations.length; i++) {
        var row = medalLocations[i][0];
        var col = medalLocations[i][1];

        if (iceArray[row][col] === -1 && isFreeableMedal(row, col)) {
            removeMedal(row, col);
            medalLocations.splice(i, 1);
        }
    }
}

function removeMedal(row, col) {
    decrementMedalCount();

    // reduce cascade by 1 as it is incremented before it gets here
    var medalScoreValue = 40;
    SCORE += 100 * (CASCADE - 1) * (medalScoreValue);
    var scoreT = ("        " + SCORE).slice(-8);
    scoreT = 'Score: ' + scoreT;
    scoreText.setText(scoreT);

    // row,col is top left corner of medal
    var medalSprite = medalArray[row][col].medalSprite;
    medalGroup.remove(medalSprite);
    removedMedalGroup.add(medalSprite);
    game.world.bringToTop(removedMedalGroup);

    // on complete
    medalSprite.events.onAnimationComplete.add(function () {
        medalSprite.kill();
    });

    medalSprite.scale.setTo(2);
    medalSprite.x = game.world.centerX;
    medalSprite.y = game.world.centerY;
    medalSprite.anchor.setTo(0.5, 0.5);
    medalSprite.play('spin');
}


function medalAnimLoop(sprite, animation) {
    if (animation.loopCount === 3) {
        animation.loop = false;
    }
}


function addGem(row, col, gemType, bonusType) {
    var gemSprite = createGemSprite(gemType, row, col);

    if (bonusType === 2) {
        gemSprite.play('type2');
    } else if (bonusType === 3) {
        gemSprite.play('type3');
    } else if (bonusType === 4) {
        gemSprite.play('type4');
    }

    gemArray[row][col] = new GemObject(gemType, bonusType, gemSprite);
    gemGroup.add(gemSprite);

}

function getAction() {
    var action = swapLocations;

    action = action[0][0].valueOf() + '-' + action[0][1] + '-' + action[1][0] + '-' + action[1][1];

    return action;
}

function getGameState() {
    var medalsUncovered = totalMedals - medalsLeft;
    var gameState = '' + SCORE + '\t' + medalsUncovered + '\t';

    for (var i = 0; i < ROWS; i++) {
        for (var j = 0; j < COLS; j++) {
            var s = gemArrayCopy[i][j].gemType + '\t' + gemArrayCopy[i][j].bonusType + '\t';

            var ice = -1;
            if (iceArray[i][j] !== -1) {
                ice = iceArray[i][j].layer;
            }

            var m = -1;
            if (iceArray[i][j] === -1 && medalArray[i][j] !== -1) {
                m = medalArray[i][j].portion;
            }

            s = s + ice + '\t' + m + '\t';
            gameState += s;
        }
    }

    return gameState;
}
