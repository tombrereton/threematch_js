<?php
$host = 'localhost';
$port = '5432';
$dbname = 'tom';
$user = 'tom';
$db = pg_connect("host=$host port=$port dbname=$dbname user=$user");

function insertScore($nickname, $score, $gameID)
{
    $query = "INSERT INTO scores (nickname, score, game_id) VALUES ('$nickname', $score, '$gameID')";
    $result = pg_query($query);
}

function getHighScores()
{
    $query = "SELECT nickname, MAX(score) as score FROM scores GROUP BY nickname ORDER BY score DESC LIMIT 10";
    $result = pg_query($query) or die('Query failed: ' . pg_last_error());
    $arr = pg_fetch_all($result);

    $tableString = '';

    $rank = 1;
    foreach ($arr as $row) {
        #
        $tableString .= "\t<tr>\n";
        $tableString .=
            "\t\t<td>" . $rank . "</td>\n"
            . "\t\t<td>" . $row['nickname'] . "</td>\n"
            . "\t\t<td>" . $row['score'] . "</td>\n";
        $tableString .= "\t</tr>\n";
        $rank++;
    }

    return $tableString;
}

function getUserHighscore($nickname)
{
    $query = "SELECT rank, nickname, max FROM (SELECT ROW_NUMBER() OVER(ORDER BY max DESC) AS rank, nickname, max FROM"
        . "(SELECT nickname, MAX(score) FROM scores GROUP BY nickname) AS max_scores) AS ranked_max_score WHERE nickname='$nickname'";
    $result = pg_query($query) or die('Query failed: ' . pg_last_error());

    $arr = pg_fetch_all($result);

    $tableString = '';
    $tableString .= "\t<tr>\n";
    $tableString .=
        "\t\t<td>" . $arr[0]['rank'] . "</td>\n"
        . "\t\t<td>" . $arr[0]['nickname'] . "</td>\n"
        . "\t\t<td>" . $arr[0]['max'] . "</td>\n";
    $tableString .= "\t</tr>\n";

    return $tableString;
}

//=============================================================

//insertScore('Gary', 13213, '1108230890-128302180942');
////echo getHighScores();
//
//$name = 'Gary';
//print_r(getUserHighscore($name));
//=============================================================

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if ($_POST['operationType'] == 'getHighScores') {
        echo getHighScores();
    } elseif ($_POST['operationType'] == 'getUserScore') {
        echo getUserHighscore($_POST['nickname']);
    }
}

//echo getUserHighscore('Sam');

pg_close($db);

?>
