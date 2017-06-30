/**
 * Created by tom on 27/06/17.
 */
var game = new Phaser.Game(800, 600, Phaser.AUTO, '',
    {preload: preload, create: create, update: update});

function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
}

var player;
var platforms;
var cursors;

var stars;
var score = 0;
var scoreText;

function create() {
    // physics engine
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // background
    game.add.sprite(0, 0, 'sky');

    // platforms group containing ground and 2 ledges to jump on
    platforms = game.add.group();

    // enable physics for platform group
    platforms.enableBody = true;

    // create ground
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    // scale ground to fit (original is 400x32 so double its size)
    ground.scale.setTo(2, 2);

    // stop it from falling when jumping on it
    ground.body.immovable = true;

    // create 2 ledges
    var ledge = platforms.create(400, 400, 'ground');

    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'ground');

    ledge.body.immovable = true;


    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');

    // we need to enable physics on the player
    game.physics.arcade.enable(player);

    // player physics properties. give this guy a slight bounce
    player.body.bounce.y = 1.5;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    // our two animations, walking left and right
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    // our controls
    cursors = game.input.keyboard.createCursorKeys();

    // create stars
    stars = game.add.group();

    stars.enableBody = true;

    // here we create 12 of them evenly spaced apart
    for(var i = 0; i<12;i++){

        //create a star inside of the stars group
        var star = stars.create(i*70, 0, 'star');

        // let gravity do its thing
        star.body.gravity.y = 6;

        // this just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }


    // setup up score text
    scoreText = game.add.text(16,16,'score: 0', {fontSize: '32px', fill: '#000'});

}

function update() {

    // collide the player and the stars with the platforms
    var hitPlatform = game.physics.arcade.collide(player, platforms);

    // collide stars with platform
    game.physics.arcade.collide(stars, platforms);

    // check if players collides with star
    game.physics.arcade.overlap(player, stars, collectStar, null, this)

    // reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown) {
        // move to the left
        player.body.velocity.x = -150;

        player.animations.play('left');
    } else if (cursors.right.isDown){
        //move body to the right
        player.body.velocity.x = 150;

        player.animations.play('right')
    } else {
        // stand still
        player.animations.stop();

        player.frame = 4;
    }

    // allow the player to jump if touching the ground
    if (cursors.up.isDown && player.body.touching.down && hitPlatform){
        player.body.velocity.y = -350;
    }
}

function collectStar(player, star){
    // removes the star from the screen
    star.kill();

    // add to score
    score += 10;
    scoreText.text = 'Score: ' + score;
}

