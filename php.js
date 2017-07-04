function startFile(gameID) {
    $.post('start_file.php', {gameID: gameID}, function (data, state) {
        console.log(data);
    });
}

function sendData(gameID, dataString) {
    $.post('add_data.php', {gameID: gameID, dataString: dataString}, function (data, state) {
        console.log(data);
    });
}

function sendScore(nickname, gameID, score) {
    $.post('high_scores.php', {nickname: nickname, gameID: gameID, score: score}, function (data, state) {
        console.log(data);
    });
}