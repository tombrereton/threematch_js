<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $game_id = $_POST['gameID'];
    $data_string = $_POST['dataString'];
    $file = fopen($_SERVER['DOCUMENT_ROOT'] . '/data/' . $game_id . '.txt', 'a');
    fwrite($file, $data_string . PHP_EOL);
    fclose($file);
}
?>

