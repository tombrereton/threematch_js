// Shared variables
var ROWS = 9;
var COLS = 9;

// Game variables
var LEVEL_1_TOTAL_MEDALS = 3
var LEVEL_2_TOTAL_MEDALS = 4
var LEVEL_3_TOTAL_MEDALS = 5
var TOTAL_MOVES = 20;
var MOVES_LEFT = 20;
var GEM_TYPES = 6
var BONUS_TYPES = 3
var ICE_ROWS = 5
var ICE_LAYERS = 1
var RANDOM_SEED = undefined  // Set to NONE to use current system time
var TERMINATED = false;

// GUI variables
var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    windowWidth = w.innerWidth || e.clientWidth || g.clientWidth,
    windowHeight = w.innerHeight || e.clientHeight || g.clientHeight;
var HEIGHT = Math.min(600, windowHeight);// * w.devicePixelRatio;
var WIDTH = Math.min(450, windowWidth);//* w.devicePixelRatio;
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
// var score = 0;
var SCORE = 0;
var medalLeft = LEVEL_1_TOTAL_MEDALS;
var tempMedalFreed = 0;


var gameID = (new Date()).getTime() + '-' +  Math.floor(Math.random() * 1E16);
