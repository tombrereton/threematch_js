// Results for GUI

var bonuses = [];
var removals = [];
var movements = [];
var additions = [];
var bonusesRemoved = 0;

// For logic only

var rowMatchGroups = [];
var columnMatchGroups = [];
var breakingFromRow = objectArray();
var breakingFromColumn = objectArray();
var removalsObArray = objectArray();
var bonusesOpArray = objectArray();

// Testing

var log = false;
var logFunc = log ? console.log : function () {};

function objectArray() {
    var result = {};
    for (var i = 0; i < ROWS; i++) {
        result[i] = {};
    }
    return result;
}

function getGem(i, j) {
    return i < 0 || ROWS <= i || j < 0 || COLS <= j ? -1 : gemArray[i][j].gemType;
}

function getGemPlusCoordinates(i, j) {
    if (gemArray[i][j] !== -1) {
        return {y: i, x: j, gem: gemArray[i][j]};
    } else {
        return -1;
    }
}

function randomGemType() {
    return Math.floor(GEM_TYPES * Math.random());
}

function randBonus(bonus) {
    return bonus ? 1 + Math.floor(4 * Math.random()) : 1;
}

function checkInsertion(i, j) {
    return (getGem(i, j) === getGem(i - 1, j) && getGem(i, j) === getGem(i - 2, j)) ||
        (getGem(i, j) === getGem(i, j - 1) && getGem(i, j) === getGem(i, j - 2));
}

function makeGrid() {
    gemArray = new Array(ROWS);
    for (var i = 0; i < ROWS; i++) {
        gemArray[i] = new Array(COLS);
        for (var j = 0; j < COLS; j++) {
            do {
                gemArray[i][j] = {gemType: randomGemType(), bonusType: randBonus()};
            } while (checkInsertion(i, j))
        }
    }
}

function findMatchesHelper(rowFind) {
    var matches = [];
    var iLimit = rowFind ? ROWS : COLS;
    var jLimit = rowFind ? COLS : ROWS;
    for (var i = 0; i < iLimit; i++) {
        var blockType = -1;
        var blockLength = 1;
        for (var j = 0; j < jLimit; j++) {
            var gemType = (rowFind ? gemArray[i][j] : gemArray[j][i]).gemType;
            if (gemType === blockType && gemType !== undefined) {
                // Continuation
                blockLength++;
                if (blockLength === 3) {
                    var lastMatch = rowFind ? {y: i, x: j - 2, gemType: gemType, matchLength: blockLength}
                        : {y: j - 2, x: i, gemType: gemType, matchLength: blockLength};
                    matches.push(lastMatch);
                } else if (3 < blockLength) {
                    lastMatch.matchLength++;
                }
            } else {
                // New block
                blockType = gemType;
                blockLength = 1;
            }
        }
    }
    return matches;
}

function addOrientation(array, i) {
    array.forEach(function (element) {
        element.orientation = i;
    });
}

function findMatches() {
    rowMatchGroups = findMatchesHelper(true);
    addOrientation(rowMatchGroups, 0);
    columnMatchGroups = findMatchesHelper(false);
    addOrientation(columnMatchGroups, 1);

    return rowMatchGroups.length || columnMatchGroups.length;
}

function largeFilter(match) {
    return 3 < match.matchLength;
}

function gemsFromGroup(match) {
    var coordinates = [];

    for (var k = 0; k < match.matchLength; k++) {
        var y = match.orientation ? match.y + k : match.y;
        var x = match.orientation ? match.x : match.x + k;

        coordinates.push(getGemPlusCoordinates(y, x));
    }

    return coordinates;
}

function lineBonuses() {
    var lineBonuses = objectArray();
    var allLargeMatches = rowMatchGroups.filter(largeFilter).concat(columnMatchGroups.filter(largeFilter));

    allLargeMatches.forEach(function (match) {
        var bonusType = 4 < match.matchLength ? 3 : 2;
        var y = match.y;
        var x = match.x;
        var bonus = {gemType: match.gemType, bonusType: bonusType};

        if (swapLocations !== undefined) {
            var coordinates = gemsFromGroup(match);

            coordinates.forEach(function (coordinate) {
                swapLocations.forEach(function (swap) {
                    if (coordinate.y === swap[0] && coordinate.x === swap[1]) {
                        y = coordinate.y;
                        x = coordinate.x;
                    }
                });
            });
        }
        lineBonuses[y][x] = bonus;
    });

    return lineBonuses;
}

function intersectionBonuses() {
    var interBonuses = objectArray();

    rowMatchGroups.forEach(function (rowMatch) {
        columnMatchGroups.forEach(function (columnMatch) {

            if (rowMatch.gemType === columnMatch.gemType) {
                if ((columnMatch.y <= rowMatch.y) && (rowMatch.y <= columnMatch.y + columnMatch.matchLength) &&
                    (rowMatch.x <= columnMatch.x) && (columnMatch.x <= rowMatch.x + rowMatch.matchLength)) {

                    interBonuses[rowMatch.y][columnMatch.x] = {gemType: rowMatch.gemType, bonusType: 4};
                }
            }
        });
    });

    return interBonuses;
}

function findBonuses() {
    bonusesOpArray = objectArray();
    var lineBonusesArray = lineBonuses();
    var interBonusesArray = intersectionBonuses();
    logFunc('lineBonusesArray', lineBonusesArray);
    logFunc('interBonusesArray', interBonusesArray);

    for (var i in interBonusesArray) {
        for (var j in interBonusesArray[i]) {
            bonusesOpArray[i][j] = interBonusesArray[i][j];
        }
    }

    for (var i in lineBonusesArray) {
        for (var j in lineBonusesArray[i]) {
            bonusesOpArray[i][j] = lineBonusesArray[i][j];
        }
    }
}

function addArrayToObArray(obArray, matches) {
    matches.forEach(function (gem) {
        obArray[gem.y][gem.x] = gem.gem;
    })
}

function addArrayToObArrayExtra(obArray, matches, extra) {
    matches.forEach(function (gem) {
        if (extra[gem.y][gem.x] === undefined) {
            obArray[gem.y][gem.x] = gem.gem;
        }
    })
}

function findBreaking() {
    breakingFromRow = objectArray();
    breakingFromColumn = objectArray();

    rowMatchGroups.forEach(function (match) {
        addArrayToObArray(breakingFromRow, gemsFromGroup(match));
    });
    columnMatchGroups.forEach(function (match) {
        addArrayToObArray(breakingFromColumn, gemsFromGroup(match));
    });
}

function rowBonus(y, x, gem) {
    var result = [];

    for (var j = 0; j < COLS; j++) {

        if (gemArray[y][j] !== -1) {
            result.push(getGemPlusCoordinates(y, j));
        }
    }

    return result;
}

function columnBonus(y, x, gem) {
    var result = [];

    for (var i = 0; i < ROWS; i++) {

        if (gemArray[i][x] !== -1) {
            result.push(getGemPlusCoordinates(i, x));
        }
    }

    return result;
}

function colorBonus(y, x, gem) {
    var result = [];
    var gemType = gem.gemType;

    for (var i = 0; i < ROWS; i++) {
        for (var j = 0; j < COLS; j++) {
            var gridGem = gemArray[i][j];
            if (gridGem !== -1 && gridGem.gemType === gemType) {
                result.push(getGemPlusCoordinates(i, j));
            }
        }
    }

    return result;
}

function squareBonus(y, x, gem) {
    var result = [];
    y = parseInt(y);
    x = parseInt(x);

    var iMin = Math.max(0, y - 1);
    var iMax = Math.min(ROWS, y + 2);
    var jMin = Math.max(0, x - 1);
    var jMax = Math.min(COLS, x + 2);

    for (var i = iMin; i < iMax; i++) {
        for (var j = jMin; j < jMax; j++) {
            if (gemArray[i][j] !== -1) {
                result.push(getGemPlusCoordinates(i, j));
            }
        }
    }

    return result;
}

function addCheck(obArray, i, j, gem) {
    if (obArray[i][j] === undefined) {
        obArray[i][j] = gem;
        return true;
    } else {
        return false;
    }
}

function cascade(gen1, rowBreak) {
    var gen2 = objectArray();

    for (var i in gen1) {
        for (var j in gen1[i]) {
            var gem = gen1[i][j];

            if (addCheck(removalsObArray, i, j, gem)) {
                switch (gem.bonusType) {
                    case 2:
                        addArrayToObArrayExtra(gen2, (rowBreak ? rowBonus : columnBonus)(i, j, gem), removalsObArray);
                        break;
                    case 3:
                        addArrayToObArrayExtra(gen2, colorBonus(i, j, gem), removalsObArray);
                        break;
                    case 4:
                        addArrayToObArrayExtra(gen2, squareBonus(i, j, gem), removalsObArray);
                        break;
                }
            }
        }
    }

    return gen2;
}

function flattenArrays() {
    removals = [];
    bonuses = [];
    bonusesRemoved = 0;

    for (var i in removalsObArray) {
        for (var j in removalsObArray[i]) {
            if (removalsObArray[i][j].bonusType !== 1) {
                bonusesRemoved++;
            }

            if (bonusesOpArray[i][j] === undefined && gemArray[i][j] !== -1) {
                removals.push({y: i, x: j});
            }
        }
    }

    for (var i in bonusesOpArray) {
        for (var j in bonusesOpArray[i]) {
            var gem = bonusesOpArray[i][j];
            bonuses.push({y: i, x: j, gemType: gem.gemType, bonusType: gem.bonusType});
        }
    }
}

function pullDown() {
    movements = [];
    additions = [];

    for (var j = 0; j < gemArray[0].length; j++) {
        var nonEmpty = 0;
        // Find lowest empty
        for (var i = gemArray.length - 1; 0 <= i; i--) {
            if (gemArray[i][j] === -1) {
                break;
            } else {
                nonEmpty++;
            }
        }
        // If any non-empty cells are above swap them to lowest empty
        for (var k = i - 1; 0 <= k; k--) {
            if (gemArray[k][j] !== -1) {
                movements.push([i--, j, k, j]);
                nonEmpty++;
            }
        }
        additions.push(ROWS - nonEmpty);
    }
}

function obArrayNonEmpty(obArray) {
    for (var i in obArray) {
        for (var j in obArray[i]) {
            return true;
        }
    }
    return false;
}

// Test functions

function printGrid() {
    var s = '';

    for (var i = 0; i < ROWS; i++) {
        for (var j = 0; j < COLS; j++) {
            s += gemArray[i][j] === -1 ? ' ' : gemArray[i][j].gemType;
        }
        s += '\n';
    }
    console.log(s);
}

function printGridBonus() {
    var numbers = '    0   1   2   3   4   5   6   7   8  \n';
    var divide = '  +---+---+---+---+---+---+---+---+---+\n';

    var s = numbers + divide;

    for (var i = 0; i < ROWS; i++) {
        s += i + ' |';
        for (var j = 0; j < COLS; j++) {
            var gem = gemArray[i][j];
            if (gem === -1) {
                s += '   |';
            } else {
                var gemType = gem.gemType;
                var bonusType = gem.bonusType;
                var bonusString = bonusType < 3 ? (bonusType === 1 ? ' ' : '+') : (bonusType === 3 ? '*' : '#');
                s += bonusString + gemType + bonusString + '|';
            }
        }
        s += '\n' + divide;
    }
    console.log(s);
}

function swap(y0, x0, y1, x1) {
    swapLocations = [[y0, x0], [y1, x1]];
    var temp = gemArray[y0][x0];
    gemArray[y0][x0] = gemArray[y1][x1];
    gemArray[y1][x1] = temp;
}

function effectRemovals() {
    for (var i in removalsObArray) {
        for (var j in removalsObArray[i]) {
            gemArray[i][j] = -1;
        }
    }
}

function effectBonuses() {
    for (var i in bonusesOpArray) {
        for (var j in bonusesOpArray[i]) {
            gemArray[i][j] = bonusesOpArray[i][j];
        }
    }
    bonusesOpArray = objectArray();
}

function effectMovements() {
    var temp = [];

    movements.forEach(function (movement) {
        var gem = gemArray[movement[2]][movement[3]];
        gemArray[movement[2]][movement[3]] = -1;
        temp.push([movement[0], movement[1], gem]);
    });

    temp.forEach(function (movement) {
        gemArray[movement[0]][movement[1]] = movement[2];
    });
}

function effectAdditions() {
    for (var j = 0; j < COLS; j++) {
        for (var i = 0; i < additions[j]; i++) {
            gemArray[i][j] = {gemType: randomGemType(), bonusType: 1};
        }
    }
}

// Create gemArray Logic > makeGrid()
// Show gemArray GUI
// (Add sprites to data structures)
// Set swap locations GUI
// (set swap locations)
// Swap GUI
// (modify data structure and animate)
// Find matches Logic > findMatches()
// (Make match group arrays)
// if no matches:
//     Swap GUI
//     (modify data structure and animate)
// else:
//     Loop:
//         Find bonusesOpArray created Logic > findBonuses()
//         (Make array of bonusesOpArray for GUI to add)
//         Find gems breaking Logic > findBreaking()
//         (Make array of gems for GUI to break)
//         Find ice broken, medals freed Logic
//         (Make arrays of ice and medals for GUI to remove)
//         Loop:
//             Cascade breaking, Logic > cascade()
//             (Check over all locations in prev gen for bonusesOpArray, process bonus and add to removalsObArray, store removalsObArray for next gen)
//             Animate bonusesOpArray, gems breaking, ice breaking, medals freeing GUI > effectRemovals(), effectBonuses()
//             (Modify data structures and animate)
//         Calculate movements Logic > pullDown()
//         (Make array of moves)
//         Calculate additions Logic > pullDown()
//         (Make array of additions)
//         Animate movements, additions GUI > effectMovements(), effectAdditions()
//         (modify data structure and animate)

function playInit() {
    makeGrid();
    printGridBonus();
}

function play(y0, x0, y1, x1) {
    swap(y0, x0, y1, x1);
    printGridBonus();
    if (findMatches()) {
        do {
            logFunc('rowMatchGroups', rowMatchGroups);
            logFunc('columnMatchGroups', columnMatchGroups);
            findBonuses();
            logFunc('bonusesOpArray', bonusesOpArray);
            findBreaking();
            logFunc('breakingFromRow', breakingFromRow);
            logFunc('breakingFromColumn', breakingFromColumn);
            var flip = true;
            while (obArrayNonEmpty(breakingFromRow) || obArrayNonEmpty(breakingFromColumn)) {
                removalsObArray = objectArray();
                breakingFromRow = cascade(breakingFromRow, flip);
                breakingFromColumn = cascade(breakingFromColumn, !flip);
                logFunc('breakingFromRow', breakingFromRow);
                logFunc('breakingFromColumn', breakingFromColumn);
                flip = !flip;
                logFunc('removalsObArray', removalsObArray);
                flattenArrays();
                logFunc('removals', removals);
                logFunc('bonuses', bonuses);
                effectRemovals();
                effectBonuses();
                printGridBonus();
            }
            pullDown();
            logFunc('movements', movements);
            logFunc('additions', additions);
            effectMovements();
            effectAdditions();
            printGridBonus();
            while (!findMatches() && !findMoves()) {
                // shuffleGems
                printGridBonus();
            }
        } while (findMatches())
    } else {
        swap(y0, x0, y1, x1);
        printGridBonus();
    }
}

function findMoves() {
    for (var i = 0; i < gemArray.length; i++) {
        for (var j = 0; j < gemArray[i].length; j++) {
            for (var k = 0; k < oneOffPatterns.length; k++) {
                var p = oneOffPatterns[k];

                if (getGem(i + p[0][0], j + p[0][1]) !== -1 &&
                    getGem(i + p[0][0], j + p[0][1]) === getGem(i + p[1][0], j + p[1][1]) &&
                    getGem(i + p[0][0], j + p[0][1]) === getGem(i + p[2][0], j + p[2][1])) {
                    return true;
                }

                if (getGem(i + p[0][1], j + p[0][0]) !== -1 &&
                    getGem(i + p[0][1], j + p[0][0]) === getGem(i + p[1][1], j + p[1][0]) &&
                    getGem(i + p[0][1], j + p[0][0]) === getGem(i + p[2][1], j + p[2][0])) {
                    return true;
                }
            }
        }
    }

    return false;
}
