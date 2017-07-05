function startFile(gameID, moves, medals) {
    $.post('php/start_file.php', {gameID: gameID, moves: moves, medals: medals}, function (data, state) {
        console.log(data);
    });
}

function sendData(gameID, lineNumber, dataString) {
    console.log(lineNumber);
    $.post('php/add_data.php', {gameID: gameID, dataString: lineNumber + '\t' + dataString}, function (data, state) {
        console.log(data);
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

function updateHighScores() {
    $.post('php/scores_db.php', {operationType: 'getHighScores'}, function (data, state) {
        document.getElementById('highscores').innerHTML = data;
    });
}

function updateUserScore(nickname) {
    $.post('php/scores_db.php', {operationType: 'getUserScore', nickname: nickname}, function (data, state) {
        document.getElementById('userHighScore').innerHTML = data;
    });
}
