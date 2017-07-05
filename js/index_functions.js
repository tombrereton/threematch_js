function updateProgressBar() {
    var percentage = 100 / TOTAL_MOVES * (TOTAL_MOVES - MOVES_LEFT);
    console.log(percentage);

    if (percentage <= 50) {
        document.getElementById('prog-success').style.width = percentage + '%';
    } else if (percentage <= 75) {
        percentage -= 50;
        document.getElementById('prog-success').style.width = '50%';
        document.getElementById('prog-warning').style.width = percentage + '%';
    } else {
        percentage -= 75;
        document.getElementById('prog-warning').style.width = '25%';
        document.getElementById('prog-danger').style.width = percentage + '%';
    }
}

function resetProgressBar() {
    document.getElementById('prog-danger').style.width = '0%';
    document.getElementById('prog-warning').style.width = '0%';
    document.getElementById('prog-success').style.width = '0%';
}

function changeName() {
    nickName = null;
    while (nickName === null || nickName === '') {
        nickName = prompt('please enter your nickname for scoring:')
        localStorage['nickName'] = nickName;
    }
    updateUserScore(nickName);
}
