<?php
$host = 'localhost';
$port = '5432';
$dbname = 'tom';
$user = 'tom';
$db = pg_connect("host=$host port=$port dbname=$dbname user=$user");

$nickname = 'Sam';
$score = 31278;
$query = "INSERT INTO scores (nickname, score) VALUES ('$nickname', $score)";

$result = pg_query($query);

function insertScore($nickname, $score)
{
    $query = "INSERT INTO scores (nickname, score) VALUES ('$nickname', $score)";
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

//$query = "SELECT nickname, MAX(score) as score FROM scores GROUP BY nickname ORDER BY score DESC LIMIT 10";
//$result = pg_query($query) or die('Query failed: ' . pg_last_error());
//
//$arr = pg_fetch_all($result);
//
////print_r($arr);
//
//foreach ($arr as $row){
//    echo $row['nickname'] . " " . $row['score'] . "\n";
//}
//echo $arr[0]['nickname']. " " . $arr[0]['score'];

echo getHighScores();

pg_close($db);

?>
