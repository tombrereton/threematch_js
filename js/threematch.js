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

