document.getElementById('progress').style.width = WIDTH + 'px';

// the game
var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'game');

game.state.add('load', loadState);
game.state.add('intro', introState);
game.state.add('play', playState);

game.state.start('load');

document.getElementById('changeName').onclick = changeName;

var nickName = localStorage['nickName'] || '';
var count = 3;

updateHighScores(0);
updateHighScores(1);
updateHighScores(2);
