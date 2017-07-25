<?php
// requires php-pgsql
// uncomment line in php.ini where it has php-pgsql

require 'db_config.php';
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

function insertScore($nickname, $score, $gameID, $level, $win)
{
    $nickname = preg_replace('/[^\w ]+/', '', $nickname);
    if (0 < strlen($nickname) && strlen($nickname) <= 20) {
        global $db;
        $result = pg_prepare($db, 'insertScore', "INSERT INTO scores (nickname, score, game_id, level, win) VALUES ($1,$2,$3,$4,$5)");
        $result = pg_execute($db, 'insertScore', array($nickname, $score, $gameID, $level, $win));
    }
}

function getHighScores($level)
{
    global $db;
    $level = preg_replace('/[^\d ]+/', '', $level);
    $query_string = "SELECT nickname, MAX(score) as score FROM scores WHERE level = $1 GROUP BY nickname ORDER BY score DESC LIMIT 10";
    $result = pg_prepare($db, 'getHighScores', $query_string);
    $result = pg_execute($db, 'getHighScores', array($level));
    $arr = pg_fetch_all($result);

    $tableString = '';

    $rank = 1;

    if ($arr) {
        include('table_header.php');

        foreach ($arr as $row) {
            $tableString .= "\t<tr>\n";
            $tableString .=
                "\t\t<td>" . $rank . "</td>\n"
                . "\t\t<td>" . $row['nickname'] . "</td>\n"
                . "\t\t<td align='right'>" . $row['score'] . "</td>\n";
            $tableString .= "\t</tr>\n";
            $rank++;
        }


        $tableString .= "</tbody>\n</table>";
    } else {
        $tableString = "<tr><td></td><td>None</td><td></td></tr>";
    }

    return $tableString;
}

function getUserHighscore($nickname)
{
    global $db;
    $nickname = preg_replace('/[^\w ]+/', '', $nickname);
    $query_string = "SELECT rank, nickname, max, level FROM (SELECT " .
        "ROW_NUMBER() OVER(PARTITION BY level ORDER BY max DESC) AS rank, nickname, max, level FROM (SELECT " .
        "nickname, MAX(score), level FROM scores GROUP BY nickname, level) AS max_level) AS ranked_max_level " .
        "WHERE nickname = $1";
    $result = pg_prepare($db, 'userHighScore', $query_string);
    $result = pg_execute($db, 'userHighScore', array($nickname));

    $arr = pg_fetch_all($result);

    $tableString = '';
    if ($arr) {
        foreach ($arr as $row) {
            $tableString .= "\t<tr>\n";
            $tableString .=
                "\t\t<td>" . $row['rank'] . "</td>\n"
                . "\t\t<td align='right'>" . ($row['level'] + 1) . "</td>\n"
                . "\t\t<td align='right'>" . $row['max'] . "</td>\n";
            $tableString .= "\t</tr>\n";
        }
    } else {
        $tableString = "<tr><td></td><td>New user!</td><td></td></tr>";
    }

    return $tableString;
}

// start session
// save last request time in global session
// if diff of last time and this time is less than 2 second, exit
session_start();

if ($_SESSION['last_request_time'] and $_POST['operationType'] == 'sendScore'){
    if (time() - $_SESSION['last_request_time'] < 2){
        exit('Too many requests sent.');
    }
}

$_SESSION['last_request_time'] = time();


if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if ($_POST['operationType'] == 'getHighScores') {
        echo getHighScores($_POST['level']);
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
