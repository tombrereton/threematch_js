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

$db = pg_connect("host=$host port=$port dbname=$dbname user=$user");

function insertScore($nickname, $score, $gameID, $level)
{
    global $db;
    $result = pg_prepare($db, 'insertScore', "INSERT INTO scores (nickname, score, game_id, level) VALUES ($1,$2,$3,$4)");
    $result = pg_execute($db, 'insertScore', array($nickname, $score, $gameID, $level));
}

function getHighScores()
{
    $query = "SELECT nickname, MAX(score) as score FROM scores GROUP BY nickname ORDER BY score DESC LIMIT 10";
    $result = pg_query($query) or die('Query failed: ' . pg_last_error());
    $arr = pg_fetch_all($result);

    $tableString = '';

    $rank = 1;

    if ($arr) {
        foreach ($arr as $row) {
            $tableString .= "\t<tr>\n";
            $tableString .=
                "\t\t<td>" . $rank . "</td>\n"
                . "\t\t<td>" . $row['nickname'] . "</td>\n"
                . "\t\t<td align='right'>" . $row['score'] . "</td>\n";
            $tableString .= "\t</tr>\n";
            $rank++;
        }
    } else {
        $tableString = "<tr><td></td><td>None</td><td></td></tr>";
    }

    return $tableString;
}

function getUserHighscore($nickname)
{
    global $db;
    $result = pg_prepare($db, 'userHighScore', "SELECT rank, nickname, max FROM (SELECT ROW_NUMBER() OVER(ORDER BY max DESC) AS rank, nickname, max FROM"
        . "(SELECT nickname, MAX(score) FROM scores GROUP BY nickname) AS max_scores) AS ranked_max_score WHERE nickname=$1");
    $result = pg_execute($db, 'userHighScore', array($nickname));

    $arr = pg_fetch_all($result);

    $tableString = '';
    if ($arr) {
        $tableString .= "\t<tr>\n";
        $tableString .=
            "\t\t<td>" . $arr[0]['rank'] . "</td>\n"
            . "\t\t<td>" . $arr[0]['nickname'] . "</td>\n"
            . "\t\t<td align='right'>" . $arr[0]['max'] . "</td>\n";
        $tableString .= "\t</tr>\n";
    } else {
        $tableString = "<tr><td></td><td>New user!</td><td></td></tr>";
    }

    return $tableString;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if ($_POST['operationType'] == 'getHighScores') {
        echo getHighScores();
    } elseif ($_POST['operationType'] == 'getUserScore') {
        echo getUserHighscore($_POST['nickname']);
    } elseif ($_POST['operationType'] == 'sendScore') {
        $nickname = $_POST['nickname'];
        $score = $_POST['score'];
        $gameID = $_POST['gameID'];
        $level = $_POST['level'];
        insertScore($nickname, $score, $gameID, $level);
    }
}

pg_close($db);

?>
