function startFile(gameID) {
    $.post('php/start_file.php', {gameID: gameID}, function (data, state) {
        console.log(data);
    });
}

function sendData(gameID, dataString) {
    $.post('php/add_data.php', {gameID: gameID, dataString: dataString}, function (data, state) {
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
