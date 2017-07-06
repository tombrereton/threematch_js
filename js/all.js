(function () {

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
    return i < 0 || ROWS <= i || j < 0 || COLS <= j ? -1 : gemArray[i][j];
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
    return (getGem(i, j).gemType === getGem(i - 1, j).gemType && getGem(i, j).gemType === getGem(i - 2, j).gemType) ||
        (getGem(i, j).gemType === getGem(i, j - 1).gemType && getGem(i, j).gemType === getGem(i, j - 2).gemType);
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
        } while (findMatches())
    } else {
        swap(y0, x0, y1, x1);
        printGridBonus();
    }
}
// Shared variables
var ROWS = 9;
var COLS = 9;

// Game variables
var LEVEL_1_TOTAL_MEDALS = 3;
var LEVEL_2_TOTAL_MEDALS = 4;
var LEVEL_3_TOTAL_MEDALS = 5;
var TOTAL_MOVES; // = 20;
var MOVES_LEFT; //  = 20;
var GEM_TYPES = 6;
var BONUS_TYPES = 3;
var ICE_ROWS = 5;
var ICE_LAYERS = 1;
var RANDOM_SEED = undefined; // Set to NONE to use current system time
var TERMINATED = false;

var level = 0;
var medalsPerLevel = [3, 4, 5];
var iceRowsPerLevel = [5, 7, 9];
var movesPerLevel = [20, 25, 30];
var totalMedals;
var lineNumber;

// GUI variables
var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    windowWidth = w.innerWidth || e.clientWidth || g.clientWidth,
    windowHeight = w.innerHeight || e.clientHeight || g.clientHeight;
var WIDTH;
var HEIGHT;
var maxHeight = 600;
if ((windowWidth - 20) * 4 / 3 < 0.8 * windowHeight) {
    // Phone / portrait
    WIDTH = windowWidth - 20;
    HEIGHT = WIDTH * 4 / 3;
} else {
    // Desktop / landscape
    HEIGHT = Math.min(0.8 * windowHeight, maxHeight);
    WIDTH = HEIGHT * 3 / 4;
}
var CELL = (WIDTH - WIDTH / 50) / COLS;
var MARGIN_H = (WIDTH - (COLS * CELL)) / 2;
var MARGIN_V = HEIGHT / 64;
var SCALE = 0.9;
var SPRITE_SIZE = CELL * SCALE;
var TEXT_HEIGHT = CELL * 0.7;

// Animation variables
var SWAP_SPEED = 200;
var ICE_FADE_SPEED = 800;
var GEM_FADE_SPEED = 500;
var FALL_SPEED = 600;
var FALL_ANIMATION = Phaser.Easing.Linear.None;
var CASCADE = 1;
var removalsBonusesCount;
var SHAKE_RADIUS = 8;
var SHAKE_SPEED = 200;
var SHAKE_PERIOD1 = 500;
var SHAKE_PERIOD2 = 500;
var flipLineBreak = true;
var FREEING_MEDAL = false;

// location arrays
var medalLocations = [];

// other variables
var selectedOrb;

// groups
var medalGroup;
var iceGroup;
var gemGroup;
var removedMedalGroup;

// Grid variables
var gemArray = [];
var iceArray = [];
var medalArray = [];
var medalState = [];

// on screen text variables
var SCORE = 0;
var medalsLeft; // = LEVEL_1_TOTAL_MEDALS;
var tempMedalFreed = 0;
// var fontSizeColour = {fontSize: '26px', fill: '#000'};
var fontSizeColour = {fontSize: (26 * HEIGHT / 600) + 'px', fill: '#000'};

// id variables
var gameID;

// mobile detection
var isMobile = false; //initiate as false
// device detection
if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) isMobile = true;

var scoreText;
var movesText;
var medalsText;
var levelText;
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
    emptyGrid(medalState);
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
    tempMedalFreed++;

    // row,col is top left corner of medal
    var medalSprite = medalArray[row][col].medalSprite;
    medalGroup.remove(medalSprite);
    removedMedalGroup.add(medalSprite);
    game.world.bringToTop(removedMedalGroup);

    // on complete
    medalSprite.events.onAnimationComplete.add(killSprite);

    medalSprite.scale.setTo(2);
    medalSprite.x = game.world.centerX;
    medalSprite.y = game.world.centerY;
    medalSprite.anchor.setTo(0.5, 0.5);
    medalSprite.play('spin');


    function killSprite() {
        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < 2; j++) {

                // get medal details
                var r = row + i;
                var c = col + j;

                medalSprite.kill();
                medalArray[r][c] = -1;
            }
        }
    }
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

function getProgressState() {
    var medalsUncovered = totalMedals - medalsLeft;
    var score = SCORE;
    var action = swapLocations;

    action = action[0][0].valueOf() + '-' + action[0][1] + '-' + action[1][0] + '-' + action[1][1];

    var progress = medalsUncovered.valueOf() + '\t' + SCORE.valueOf() + '\t' + action;

    return progress;
}

function getGameState() {
    var gameState = '';

    for (var i = 0; i < ROWS; i++) {
        for (var j = 0; j < COLS; j++) {
            var s = gemArray[i][j].gemType + '\t' + gemArray[i][j].bonusType + '\t';

            var ice = -1;
            if (iceArray[i][j] !== -1) {
                ice = iceArray[i][j].layer;
            }

            var m = '-1';
            if (medalState[i][j] !== -1) {
                m = medalState[i][j];
            } else if (iceArray[i][j] === -1 && medalArray[i][j] !== -1) {
                m = medalArray[i][j].portion;
                medalState[i][j] = m;
            }

            s = s + ice + '\t' + m + '\t';
            gameState += s;
        }
    }

    return gameState;
}
function updateProgressBar() {
    var percentage = 100 / TOTAL_MOVES * (TOTAL_MOVES - MOVES_LEFT);

    if (percentage <= 50) {
        document.getElementById('prog-success').style.width = percentage + '%';
    } else if (percentage <= 75) {
        percentage -= 50;
        document.getElementById('prog-success').style.width = '50%';
        document.getElementById('prog-warning').style.width = percentage + '%';
    } else {
        percentage -= 75;
        document.getElementById('prog-warning').style.width = '25%';
        document.getElementById('prog-danger').style.width = percentage + '%';
    }
}

function resetProgressBar() {
    document.getElementById('prog-danger').style.width = '0%';
    document.getElementById('prog-warning').style.width = '0%';
    document.getElementById('prog-success').style.width = '0%';
}

function changeName() {
    nickName = prompt('please enter your nickname for scoring:');
    if (!nickName) {
        // User cancelled prompt or just pressed enter
        nickName = 'default';
        localStorage['nickname'] = undefined;
    } else {
        localStorage['nickname'] = nickName;
    }
    updateUserScore(nickName);
}

function changeTab(level) {
    var oldLevel = (level + 2) % 3;
    var newLevel = level % 3;
    var oldTabHeader = "tabLevel" + (oldLevel);
    var oldTabPane = "Level" + (oldLevel);
    var tabHeader = "tabLevel" + (newLevel);
    var tabPane = "Level" + (newLevel);
    document.getElementById(oldTabHeader).classList.remove('active');
    document.getElementById(oldTabPane).classList.remove('active');
    document.getElementById(tabHeader).classList.add('active');
    document.getElementById(tabPane).classList.add('active');
}
var introState = {
    create: function () {

        // background
        var stone = game.add.sprite(0, 0, 'stone');
        stone.height = HEIGHT;
        stone.width = WIDTH;


        var startText = game.add.text(game.world.centerX, game.world.centerY - HEIGHT / 4, 'Gem Island', {
            font: '30px Helvetica',
            fill: '#000'
        });
        startText.anchor.setTo(0.5);

        var freeMedalText = game.add.text(game.world.centerX, game.world.centerY, 'Free the medals...', {
            font: '26px Helvetica',
            fill: '#000'
        });
        freeMedalText.anchor.setTo(0.5);

        var freeMedalText = game.add.text(game.world.centerX, game.world.centerY + HEIGHT * 7 / 16, 'Click to start', {
            font: '26px Helvetica',
            fill: '#000'
        });
        freeMedalText.anchor.setTo(0.5);


        // add sprite and scale it
        var type = 0;
        var name = "stone" + type + '/01';
        var gem = game.add.sprite(game.world.centerX - WIDTH * 1 / 8, game.world.centerY - HEIGHT * 3 / 16, 'threematch', name);
        gem.anchor.setTo(0.5, 0.5);

        type = 2;
        name = "stone" + type + '/01';
        var gem = game.add.sprite(game.world.centerX, game.world.centerY - HEIGHT * 3 / 16, 'threematch', name);
        gem.anchor.setTo(0.5, 0.5);

        type = 3;
        name = "stone" + type + '/01';
        var gem = game.add.sprite(game.world.centerX + WIDTH * 1 / 8, game.world.centerY - HEIGHT * 3 / 16, 'threematch', name);
        gem.anchor.setTo(0.5, 0.5);


        var medal = game.add.sprite(game.world.centerX, game.world.centerY + HEIGHT * 3 / 16, 'threematch', 'medal/01');
        medal.anchor.setTo(0.5, 0.5);
        medal.width = 2 * (SPRITE_SIZE);
        medal.height = 2 * (SPRITE_SIZE);

        // animations
        var names = Phaser.Animation.generateFrameNames('medal/', 1, 4, '', 2);
        var names2 = Phaser.Animation.generateFrameNames('medal/', 4, 1, '', 2);
        names.push(names2);
        var anim = medal.animations.add('spin', names, 10, true);
        medal.play('spin');


        game.input.onDown.add(this.start);
    },


    start: function () {
        game.state.start('play')
    }
};

var loadState = {
    preload: function () {
        var loadingText = game.add.text(game.world.centerX, game.world.centerY, 'loading...', {
            font: '30px Helvetica',
            fill: '#ffffff'
        });
        loadingText.anchor.setTo(0.5);


        game.load.image('stone', 'assets/stone_light_2.jpg');
        game.load.image('ground', 'assets/ground.png');
        game.load.image('grid', 'assets/grid.png');

        // sprite atlas
        game.load.atlasJSONArray('threematch', 'assets/threematch.png', 'assets/threematch.json');


    },

    create: function () {

        game.state.start('intro')

    }


};// file for moving gems and animations
var canPick = true;
var newRow;
var newCol;
var oldRow;
var oldCol;
var swapLocations;

var moving;
var removing;
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
    SCORE += 100 * CASCADE * (removals.length + bonuses.length + 2 * bonusesRemoved + 5 * tempMedalFreed);
    tempMedalFreed = 0;
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


function handleMatches() {
    CASCADE = 1;
    moving = 0;
    removing = 0;
    findMatchesResult = true;
    initialHandling();
}

function initialHandling() {
    if (0 !== moving) {
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
        canPick = true;
        selectedOrb = null;
        checkWin();
        sendData(gameID, lineNumber++, getProgressState());
        sendData(gameID, lineNumber++, getGameState());
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

function nextLevel() {

    var gameIDCopy = gameID;
    if (gameID === gameIDCopy) {
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
    var bonusPoints = Math.floor(avgPerMove * MOVES_LEFT);

    SCORE += bonusPoints;
    tempMedalFreed = 0;
    var scoreT = ("        " + SCORE).slice(-8);
    scoreT = 'Score: ' + scoreT;
    scoreText.setText(scoreT);
}
function startFile(gameID, moves, medals) {
    $.post('php/start_file.php', {gameID: gameID, moves: moves, medals: medals}, function (data, state) {
    });
}

function sendData(gameID, lineNumber, dataString) {
    $.post('php/add_data.php', {gameID: gameID, dataString: lineNumber + '\t' + dataString}, function (data, state) {
    });
}

function sendScore(nickname, gameID, score, level, win) {
    $.post('php/scores_db.php', {
        operationType: 'sendScore',
        nickname: nickname,
        gameID: gameID,
        score: score,
        level: level,
        win: win
    }, function (data, state) {
        updateUserScore(nickname);
        updateHighScores(0);
        updateHighScores(1);
        updateHighScores(2);
    });
}

function updateHighScores(level) {
    $.post('php/scores_db.php', {operationType: 'getHighScores', level: level}, function (data, state) {

        if (level === 0) {
            document.getElementById('Level0').innerHTML = data;
        } else if (level === 1) {
            document.getElementById('Level1').innerHTML = data;
        } else if (level === 2) {
            document.getElementById('Level2').innerHTML = data;
        }
    });
}

function updateUserScore(nickname) {
    $.post('php/scores_db.php', {operationType: 'getUserScore', nickname: nickname}, function (data, state) {
        document.getElementById('userScoreTitle').innerHTML = "High Score: " + nickname;
        document.getElementById('userHighScore').innerHTML = data;
    });
}
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

        startFile(gameID, MOVES_LEFT, medalsLeft);
        sendData(gameID, lineNumber++, 'start');
        sendData(gameID, lineNumber++, getGameState());

        // add functions for clicking on gems
        game.input.onDown.add(gemSelect);
        game.input.onUp.add(gemDeselect);

        // setup up SCORE text
        var scoreT = ("        " + 0).slice(-8);
        var movesT = ("      " + MOVES_LEFT).slice(-6);
        var medalsT = ("      " + medalsLeft).slice(-6);
        var inset = 16 * WIDTH / 450;
        scoreText = game.add.text(inset, HEIGHT - 3 * TEXT_HEIGHT, 'Score: ' + scoreT, fontSizeColour);
        movesText = game.add.text(inset, HEIGHT - 2 * TEXT_HEIGHT, 'Moves: ' + movesT, fontSizeColour);
        medalsText = game.add.text(inset, HEIGHT - 1 * TEXT_HEIGHT, 'Medals: ' + medalsT, fontSizeColour);
        levelText = game.add.text(WIDTH - WIDTH / 4, HEIGHT - 1 * TEXT_HEIGHT, 'Level: ' + (level + 1), fontSizeColour);
    }
}
document.getElementById('progress').style.width = WIDTH + 'px';

// the game
var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'game');

game.state.add('load', loadState);
game.state.add('intro', introState);
game.state.add('play', playState);

game.state.start('load');


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
})();
