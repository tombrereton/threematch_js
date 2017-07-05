function startFile(gameID, moves, medals) {
    $.post('php/start_file.php', {gameID: gameID, moves: moves, medals: medals}, function (data, state) {
    });
}

function sendData(gameID, lineNumber, dataString) {
    $.post('php/add_data.php', {gameID: gameID, dataString: lineNumber + '\t' + dataString}, function (data, state) {
    });
}

function sendScore(nickname, gameID, score, level) {
    $.post('php/scores_db.php', {
        operationType: 'sendScore',
        nickname: nickname,
        gameID: gameID,
        score: score,
        level: level
    }, function (data, state) {
        updateUserScore(nickname);
        updateHighScores()
    });
}

function updateHighScores(level) {
    $.post('php/scores_db.php', {operationType: 'getHighScores', level: level}, function (data, state) {
        document.getElementById('Level1').innerHTML = data;
    });
}

function updateUserScore(nickname) {
    $.post('php/scores_db.php', {operationType: 'getUserScore', nickname: nickname}, function (data, state) {
        document.getElementById('userHighScore').innerHTML = data;
    });
}
