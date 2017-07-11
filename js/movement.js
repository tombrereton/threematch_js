// file for moving gems and animations
var canPick = true;
var newRow;
var newCol;
var oldRow;
var oldCol;
var swapLocations;

var progress;
var flip;
var findMatchesResult;

function gemSelect(e) {
    if (canPick && !TERMINATED) {

        if (isMobile) {
            newRow = Math.floor((game.input.pointer1.y - MARGIN_V) / CELL);
            newCol = Math.floor((game.input.pointer1.x - MARGIN_H) / CELL);
        } else {
            newRow = Math.floor((game.input.mousePointer.y - MARGIN_V) / CELL);
            newCol = Math.floor((game.input.mousePointer.x - MARGIN_H) / CELL);
        }


        var pickedOrb = gemAt(newRow, newCol);
        if (pickedOrb !== -1) {
            if (selectedOrb === null) {
                pickedOrb.gemSprite.height = SPRITE_SIZE * 1.2;
                pickedOrb.gemSprite.width = SPRITE_SIZE * 1.2;
                pickedOrb.gemSprite.bringToTop();
                selectedOrb = pickedOrb;
                oldRow = newRow;
                oldCol = newCol;
                swapLocations = [[newRow, newCol], [oldRow, oldCol]];
                game.input.addMoveCallback(gemMove);
            }
            else {
                swapLocations = [[newRow, newCol], [oldRow, oldCol]];
                if (areTheSame(pickedOrb, selectedOrb)) {
                    selectedOrb.gemSprite.width = SPRITE_SIZE;
                    selectedOrb.gemSprite.height = SPRITE_SIZE;
                    selectedOrb = null;
                    oldRow = null;
                    oldCol = null;
                }
                else {
                    if (areNext(newRow, newCol, oldRow, oldCol)) {
                        selectedOrb.gemSprite.width = SPRITE_SIZE;
                        selectedOrb.gemSprite.height = SPRITE_SIZE;
                        swapGems(selectedOrb, pickedOrb, true);
                    } else {
                        selectedOrb.gemSprite.width = SPRITE_SIZE;
                        selectedOrb.gemSprite.height = SPRITE_SIZE;
                        pickedOrb.gemSprite.height = SPRITE_SIZE * 1.2;
                        pickedOrb.gemSprite.width = SPRITE_SIZE * 1.2;
                        selectedOrb = pickedOrb;
                        oldRow = newRow;
                        oldCol = newCol;
                        // game.input.addMoveCallback(gemMove);
                    }
                }
            }
        }
    }
}

function swapGems(gem1, gem2, swapBack) {
    canPick = false;
    gemArrayCopy = $.extend(true, [], gemArray);

    var gem1Sprite = gemArray[getGemRow(gem1)][getGemCol(gem1)].gemSprite;
    var gem2Sprite = gemArray[getGemRow(gem2)][getGemCol(gem2)].gemSprite;

    // animations
    var toGem1Y = MARGIN_V + CELL / 2 + getGemRow(gem2) * CELL;
    var toGem1X = MARGIN_H + CELL / 2 + getGemCol(gem2) * CELL;
    var toGem2Y = MARGIN_V + CELL / 2 + getGemRow(gem1) * CELL;
    var toGem2X = MARGIN_H + CELL / 2 + getGemCol(gem1) * CELL;

    var gem1tween = game.add.tween(gem1Sprite).to({y: toGem1Y, x: toGem1X}, SWAP_SPEED, Phaser.Easing.Linear.None, true)
    var gem2tween = game.add.tween(gem2Sprite).to({y: toGem2Y, x: toGem2X}, SWAP_SPEED, Phaser.Easing.Linear.None, true)

    // swap in gemArray
    var temp = gemArray[getGemRow(gem1)][getGemCol(gem1)];
    gemArray[getGemRow(gem1)][getGemCol(gem1)] = gem2;
    gemArray[getGemRow(gem2)][getGemCol(gem2)] = temp;

    // look for matches after swap animation
    gem2tween.onComplete.add(function () {
        var matchFound = findMatches();
        if (!matchFound && swapBack) {
            swapGems(gem1, gem2, false);
        } else if (matchFound) {
            moveMade();
            sendData(gameID, lineNumber++, getGameState());
            sendData(gameID, lineNumber++, getAction());
            handleMatches();
            selectedOrb = null;
        } else {
            selectedOrb = null;
            canPick = true;
        }
    });
}

function gemMove(event, pX, pY) {
    if (event.id === 0 && selectedOrb !== null) {
        var distX = pX - selectedOrb.gemSprite.x;
        var distY = pY - selectedOrb.gemSprite.y;
        var deltaRow = 0;
        var deltaCol = 0;
        if (Math.abs(distX) > CELL / 2) {
            if (distX > 0) {
                deltaCol = 1;
                deltaRow = 0;
            } else {
                deltaCol = -1;
                deltaRow = 0;
            }
        } else if (Math.abs(distY) > CELL / 2) {
            if (distY > 0) {
                deltaRow = 1;
                deltaCol = 0;
            } else {
                deltaRow = -1;
                deltaCol = 0;
            }
        }
        if (deltaRow + deltaCol !== 0) {
            newRow = getGemRow(selectedOrb);
            newCol = getGemCol(selectedOrb);
            var pickedOrb = gemAt(newRow + deltaRow, newCol + deltaCol);
            if (pickedOrb !== -1) {
                oldRow = getGemRow(pickedOrb);
                oldCol = getGemCol(pickedOrb);
                swapLocations = [[newRow, newCol], [oldRow, oldCol]];
                game.input.deleteMoveCallback(gemMove);
                selectedOrb.gemSprite.width = SPRITE_SIZE;
                selectedOrb.gemSprite.height = SPRITE_SIZE;
                swapGems(selectedOrb, pickedOrb, true);
            }
        }
    }
}

function updateScore() {
    // medal score is added in removeMedal function
    SCORE += 100 * CASCADE * (removals.length + bonuses.length + 5 * bonusesRemoved );
    var scoreT = ("        " + SCORE).slice(-8);
    scoreT = 'Score: ' + scoreT;
    scoreText.setText(scoreT);
}

function moveMade() {
    MOVES_LEFT--;
    var movesT = ("      " + MOVES_LEFT).slice(-6);
    movesT = 'Moves: ' + movesT;
    movesText.setText(movesT);
    updateProgressBar();
}

function decrementMedalCount() {
    medalsLeft--;
    var medalsT = ("      " + medalsLeft).slice(-6);
    medalsT = 'Medals: ' + medalsT;
    medalsText.setText(medalsT);
}

function areTheSame(gem1, gem2) {
    return gem1 === gem2;
}

function areNext(row, col, oldRow, oldCol) {
    return Math.abs(row - oldRow) + Math.abs(col - oldCol) === 1;
}

function getGemRow(gem) {
    return Math.floor(gem.gemSprite.y / CELL);
}

function getGemCol(orb) {
    return Math.floor(orb.gemSprite.x / CELL);
}

function gemAt(row, col) {
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) {
        return -1;
    }
    return gemArray[row][col];
}

function gemDeselect(e) {
    game.input.deleteMoveCallback(gemMove);
}

function removeGems() {
    progress += removals.length + bonuses.length;

    for (var i = 0; i < removals.length; i++) {

        var r = removals[i].y;
        var c = removals[i].x;

        var gemSprite = gemArray[r][c].gemSprite;
        gemSprite.events.onAnimationComplete.add(killGem);
        gemSprite.play('explode', 30, false, true);

        removeIce(r, c);

        function killGem() {
            progress--;
            cascadeLoop();
        }

        // set grid spot to empty
        gemArray[r][c] = -1;
    }


}

function addBonuses() {

    for (var i = 0; i < bonuses.length; i++) {

        var r = bonuses[i].y;
        var c = bonuses[i].x;
        var type = bonuses[i].gemType;
        var bonusType = bonuses[i].bonusType;

        // remove old gem
        gemArray[r][c].gemSprite.kill();
        gemArray[r][c] = -1;
        removeIce(r, c);

        addGem(r, c, type, bonusType);

        // make new bonus shake
        var bonusSprite = gemArray[r][c].gemSprite;
        var bonusTween = game.add.tween(bonusSprite).to({x: bonusSprite.position.x + 5}, SHAKE_SPEED / 4, Phaser.Easing.Bounce.InOut, false, 0, 0, true);
        var bonusTween2 = game.add.tween(bonusSprite).to({x: bonusSprite.position.x - 5}, SHAKE_SPEED / 4, Phaser.Easing.Bounce.InOut, false, 0, 0, true);
        var bonusTween3 = game.add.tween(bonusSprite).to({x: bonusSprite.position.x + 5}, SHAKE_SPEED / 4, Phaser.Easing.Bounce.InOut, false, 0, 0, true);
        var bonusTween4 = game.add.tween(bonusSprite).to({x: bonusSprite.position.x - 5}, SHAKE_SPEED / 4, Phaser.Easing.Bounce.InOut, false, 0, 0, true);
        bonusTween.chain(bonusTween2);
        bonusTween2.chain(bonusTween3);
        bonusTween3.chain(bonusTween4);
        bonusTween.start();

        bonusTween4.onComplete.add(function () {
            progress--;
            cascadeLoop();
        })
    }
    updateScore();
    bonuses = []
}

function moveGems() {
    progress += movements.length;
    for (var i = 0; i < movements.length; i++) {
        var newRow = movements[i][0];
        var newCol = movements[i][1];
        var oldRow = movements[i][2];
        var oldCol = movements[i][3];

        // get sprite and make tween
        var gemSprite = gemArray[oldRow][oldCol].gemSprite;
        var row_coord = MARGIN_V + CELL / 2 + newRow * CELL;
        var gemTween = game.add.tween(gemSprite).to({y: row_coord}, FALL_SPEED, FALL_ANIMATION, true);

        gemTween.onComplete.add(function () {
            progress--;
            matchesLoop();
        });

        // swap in gemArray
        var temp = gemArray[newRow][newCol];
        gemArray[newRow][newCol] = gemArray[oldRow][oldCol];
        gemArray[oldRow][oldCol] = temp;
    }
}

function addGemsAbove() {
    for (var col = 0; col < additions.length; col++) {

        var gemsToBeAdded = additions[col];
        progress += gemsToBeAdded;

        for (var rowAbove = 0; rowAbove < gemsToBeAdded; rowAbove++) {

            // create sprite and tween it downwards
            var type = Math.floor(Math.random() * GEM_TYPES);
            var gemSprite = createGemSprite(type, -rowAbove - 1, col);
            var row_coord = MARGIN_V + CELL / 2 + (gemsToBeAdded - rowAbove - 1) * CELL;
            var gemTween = game.add.tween(gemSprite).to({y: row_coord}, FALL_SPEED, FALL_ANIMATION, true);


            // on tween complete try finding more matches
            gemTween.onComplete.add(function () {
                progress--;
                matchesLoop();
            });

            // add new gem to grid with sprite that is added above
            gemArray[gemsToBeAdded - rowAbove - 1][col] = new GemObject(type, 1, gemSprite);
        }
    }
}

function wiggle(aProgress, aPeriod1, aPeriod2) {
    var current1 = aProgress * Math.PI * 2 * aPeriod1;
    var current2 = aProgress * (Math.PI * 2 * aPeriod2 + Math.PI / 2);

    return Math.sin(current1) * Math.cos(current2);
}

function shuffle(array) {
    var i, j, x;
    for (i = array.length; 0 < i; i--) {
        j = Math.floor(i * Math.random());
        x = array[i - 1];
        array[i - 1] = array[j];
        array[j] = x;
    }
}

function shuffleGems() {
    var temp = [];
    var i, j;

    for (i = 0; i < ROWS; i++) {
        for (j = 0; j < COLS; j++) {
            temp.push(gemArray[i][j]);
        }
    }

    shuffle(temp);

    for (i = 0; i < ROWS; i++) {
        for (j = 0; j < COLS; j++) {
            gemArray[i][j] = temp.pop();
        }
    }
}

function shuffleGemsAnimation(endFunction) {
    progress += ROWS * COLS;

    for (var i = 0; i < ROWS; i++) {
        for (var j = 0; j < COLS; j++) {
            yPix = MARGIN_V + (i + 0.5) * CELL;
            xPix = MARGIN_H + (j + 0.5) * CELL;
            var tween = game.add.tween(gemArray[i][j].gemSprite).to({y: yPix, x: xPix}, FALL_SPEED, FALL_ANIMATION, true);
            tween.onComplete.add(function () {
                progress--;
                if (progress === 0) {
                    endFunction();
                }
            });
        }
    }
}
function handleMatches() {
    // Start to handle matches
    // This is the first time round, set cascade to 1
    CASCADE = 1;
    // Set moving and removing to 0, these help control the looping
    progress = 0;
    // Start the matches loop
    matchesLoop();
}

function returnControl() {
    // No matches and moves available, return control to player
    canPick = true;
    // Clear selection
    selectedOrb = null;
    // Check if the player has won
    checkWin();
}

function matchesLoop() {
    if (0 !== progress) {
        // Do nothing
    } else if (findMatches()) {
        // Matches exist
        // Find bonuses created
        findBonuses();
        // Find the first generation of gems breaking
        findBreaking();
        // Initialise flip to true, this alternates the direction of row and column line bonuses
        flip = true;
        // Start the cascade loop, this repeatedly activates bonuses
        cascadeLoop();
    } else {
        // There are mo matches left, go to shuffle loop to check for moves
        shuffleLoop(returnControl);
    }
}

function cascadeLoop() {
    if (0 !== progress) {
        // Do nothing
    } else if (obArrayNonEmpty(breakingFromRow) || obArrayNonEmpty(breakingFromColumn)) {
        // There are 'breaking' gems
        // Clear the object array of removals
        removalsObArray = objectArray();
        // Break the current generations of breaking gems and find the next one (if any)
        breakingFromRow = cascade(breakingFromRow, flip);
        breakingFromColumn = cascade(breakingFromColumn, !flip);
        // Alternate flip for next generation
        flip = !flip;
        // Flatten object arrays to normal arrays
        flattenArrays();
        // Remove gems and start removal animations, adds callback to this function
        removeGems();
        // Add bonuses and start animation, adds callback to this function
        addBonuses();
        // Loop this function
        cascadeLoop();
    } else {
        // All breaking gems have broken
        // pullDown calculates all movements and how many additions are needed in each row
        pullDown();
        // This moves the gems that need moving
        moveGems();
        // This adds in the new gems
        addGemsAbove();
        // Increment cascade so additional matches after falling are worth more points
        CASCADE++;
        // Run matches loop
        matchesLoop();
    }
}

function shuffleLoop(endFunction) {
    var shuffled = false;
    while (!findMoves() || findMatches()) {
        shuffleGems();
        shuffled = true;
    }

    if (shuffled) {
        setTimeout(function () {
            shuffleGemsAnimation(endFunction)
        }, 0);
    } else {
        endFunction();
    }
}

function nextLevel() {
    level = (level + 1) % 3;
    changeTab(level);
    resetProgressBar();
    game.input.onDown.add(playState.create);

    var nextLevelText = game.add.text(game.world.centerX, game.world.centerY + HEIGHT / 4, 'Click for next level', {
        font: 'bold 32pt Helvetica',
        fill: '#000'
    });
    nextLevelText.anchor.setTo(0.5, 0.5);
}

function checkWin() {
    if (medalsLeft === 0) {
        TERMINATED = true;
        extrapolateScore();
        var winText = game.add.text(game.world.centerX, game.world.centerY, 'You Won!', {
            font: 'bold 40pt Arial',
            fill: '#000'
        });
        winText.anchor.setTo(0.5, 0.5);
        sendData(gameID, lineNumber++, getGameState());
        sendData(gameID, lineNumber++, '-1--1--1--1');
        sendScore(nickName, gameID, SCORE, level, true);
        nextLevel();
    } else if (MOVES_LEFT === 0) {
        TERMINATED = true;
        var winText = game.add.text(game.world.centerX, game.world.centerY, 'Game Over', {
            font: 'bold 40pt Arial',
            fill: '#000'
        });
        winText.anchor.setTo(0.5, 0.5);
        sendData(gameID, lineNumber++, getGameState());
        sendData(gameID, lineNumber++, '-1--1--1--1');
        sendScore(nickName, gameID, SCORE, level, false);
        nextLevel();
    }
}

function extrapolateScore() {
    var avgPerMove = SCORE / (TOTAL_MOVES - MOVES_LEFT);
    SCORE += Math.floor(avgPerMove * MOVES_LEFT);
    var scoreT = ("        " + SCORE).slice(-8);
    scoreT = 'Score: ' + scoreT;
    scoreText.setText(scoreT);
}
