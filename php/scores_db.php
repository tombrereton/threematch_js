<?php
// requires php-pgsql
// uncomment line in php.ini where it has php-pgsql

require 'db_config.php';
require 'db_functions.php';
// make a db_config file and put this inside:

//<?php
//$db_config = array(
//    'host' => 'host',
//    'port' => 'port',
//    'dbname' => 'dbname',
//    'user' => 'user',
//    'passwd' => 'passwd'
//);

$host = $db_config['host'];
$port = $db_config['port'];
$dbname = $db_config['dbname'];
$user = $db_config['user'];
$passwd = $db_config['passwd'];

$db = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$passwd");

// start session
// save last request time in global session
// if diff of last time and this time is less than 2 second, exit
session_start();

if ($_SESSION['last_request_time'] and $_POST['operationType'] == 'sendScore') {
    if (time() - $_SESSION['last_request_time'] < 2) {
        exit('Too many requests sent.');
    }
}

$_SESSION['last_request_time'] = time();


if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if ($_POST['operationType'] == 'getHighScores') {
        echo getHighScores($_POST['level'], 10);
    } elseif ($_POST['operationType'] == 'getUserScore') {
        echo getUserHighscore($_POST['nickname']);
    } elseif ($_POST['operationType'] == 'sendScore') {
        $nickname = $_POST['nickname'];
        $score = $_POST['score'];
        $gameID = $_POST['gameID'];
        $level = $_POST['level'];
        $win = $_POST['win'];
        insertScore($nickname, $score, $gameID, $level, $win);
    }
}

pg_close($db);

?>
