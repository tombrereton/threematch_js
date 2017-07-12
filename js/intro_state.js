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

