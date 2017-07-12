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


};