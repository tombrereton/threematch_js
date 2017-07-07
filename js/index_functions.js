function updateProgressBar() {
    var percentage = 100 / TOTAL_MOVES * (TOTAL_MOVES - MOVES_LEFT);

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
    var promtString = 'please enter your nickname for scoring:';
    nickName = '';
    while (!nickName) {
        nickName = prompt(promtString);
        if (!nickName || nickName.match(/^ +$/)) {
            // User declined to provide nickname
            nickName = 'default';
            localStorage['nickName'] = '';
        } else if (nickName.match(/^.{21,}$/)) {
            // User provided a long nickname
            promtString = 'please enter your nickname for scoring, 20 characters max:';
            nickName = '';
        } else if (nickName.match(/[^\w ]/)) {
            // User provided a bad nickName
            promtString = 'please enter your nickname for scoring, alphanumerics and spaces only:';
            nickName = '';
        } else {
            localStorage['nickName'] = nickName;
        }
    }
    updateUserScore(nickName);
}

function changeTab(level) {
    var oldLevel = (level + 2) % 3;
    var newLevel = level % 3;
    var oldTabHeader = "tabLevel" + (oldLevel);
    var oldTabPane = "Level" + (oldLevel);
    var tabHeader = "tabLevel" + (newLevel);
    var tabPane = "Level" + (newLevel);
    document.getElementById(oldTabHeader).classList.remove('active');
    document.getElementById(oldTabPane).classList.remove('active');
    document.getElementById(tabHeader).classList.add('active');
    document.getElementById(tabPane).classList.add('active');
}
