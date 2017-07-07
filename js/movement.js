// file for moving gems and animations
var canPick = true;
var newRow;
var newCol;
var oldRow;
var oldCol;
var swapLocations;

var moving;
var removing;
var shuffling;
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
    removing = removals.length + bonuses.length;

    for (var i in removals) {

        var r = removals[i].y;
        var c = removals[i].x;

        var gemSprite = gemArray[r][c].gemSprite;
        gemSprite.events.onAnimationComplete.add(killGem);
        gemSprite.play('explode', 30, false, true);

        removeIce(r, c);

        function killGem() {
            removing--;
            cascadeLoop();
        }

        // set grid spot to empty
        gemArray[r][c] = -1;
    }


}

function addBonuses() {

    for (var i in bonuses) {

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
            removing--;
            cascadeLoop();
        })
    }
    updateScore();
    bonuses = []
}

function moveGems() {
    moving = movements.length;
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
            moving--;
            initialHandling();
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
        moving += gemsToBeAdded;

        for (var rowAbove = 0; rowAbove < gemsToBeAdded; rowAbove++) {

            // create sprite and tween it downwards
            var type = Math.floor(Math.random() * GEM_TYPES);
            var gemSprite = createGemSprite(type, -rowAbove - 1, col);
            var row_coord = MARGIN_V + CELL / 2 + (gemsToBeAdded - rowAbove - 1) * CELL;
            var gemTween = game.add.tween(gemSprite).to({y: row_coord}, FALL_SPEED, FALL_ANIMATION, true);


            // on tween complete try finding more matches
            gemTween.onComplete.add(function () {
                moving--;
                // checkWin();
                initialHandling();
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
    var shuffling = ROWS * COLS;
    var targets = [];
    var temp = [];
    var i, j, gem, target, c = 0, gemSprite, tween, yPix, xPix;

    for (i = 0; i < ROWS; i++) {
        for (j = 0; j < COLS; j++) {
            targets.push([i, j]);
        }
    }

    shuffle(targets);

    for (i = 0; i < ROWS; i++) {
        for (j = 0; j < COLS; j++) {
            gem = gemArray[i][j];
            target = targets[c++];
            gemSprite = gem.gemSprite;
            yPix = MARGIN_V + (target[0] + 0.5) * CELL;
            xPix = MARGIN_H + (target[1] + 0.5) * CELL;
            tween = game.add.tween(gemSprite).to({y: yPix, x: xPix}, FALL_SPEED, FALL_ANIMATION, true);
            tween.onComplete.add(function () {
                shuffling--;
                shuffleLoop();
            });
            temp.push([target, gem]);
        }
    }

    for (var k = 0; k < temp.length; k++) {
        target = temp[k][0];
        gem = temp[k][1];
        gemArray[target[0]][target[1]] = gem;
    }


}

function handleMatches() {
    CASCADE = 1;
    moving = 0;
    removing = 0;
    shuffling = 0;
    findMatchesResult = true;
    initialHandling();
}

function initialHandling() {
    if (0 !== moving || 0 !== shuffling) {
        // Gems still moving
        return;
    } else if (findMatchesResult) {
        // Matches exist
        findBonuses();
        findBreaking();
        flip = true;
        cascadeLoop();
    } else {
        // No matches exist
        shuffling = 0;
        shuffleLoop();
    }
}

function cascadeLoop() {
    if (0 !== removing) {
        // Breaking still animating
        return;
    } else if (obArrayNonEmpty(breakingFromRow) || obArrayNonEmpty(breakingFromColumn)) {
        // More gems to break due to bonuses
        removalsObArray = objectArray();
        breakingFromRow = cascade(breakingFromRow, flip);
        breakingFromColumn = cascade(breakingFromColumn, !flip);
        flip = !flip;
        flattenArrays();
        removeGems();
        addBonuses();
        cascadeLoop();
    } else {
        // All gems broken
        pullDown();
        moveGems();
        addGemsAbove();
        findMatchesResult = findMatches();
        CASCADE++;
        initialHandling();
    }
}

function shuffleLoop() {
    if (0 !== shuffling)  {
        // Still shuffling
        return;
    } else if(findMoves()) {
        // Moves found
        if (findMatchesResult) {
            initialHandling();
        } else {
            canPick = true;
            selectedOrb = null;
            checkWin();
            sendData(gameID, lineNumber++, getProgressState());
            sendData(gameID, lineNumber++, getGameState());
        }
    } else {
        // No moves found
        shuffleGems();
        findMatchesResult = findMatches();
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
        sendScore(nickName, gameID, SCORE, level, true);
        nextLevel();
    } else if (MOVES_LEFT === 0) {
        TERMINATED = true;
        var winText = game.add.text(game.world.centerX, game.world.centerY, 'Game Over', {
            font: 'bold 40pt Arial',
            fill: '#000'
        });
        winText.anchor.setTo(0.5, 0.5);
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
