<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $game_id = $_POST['gameID'];
    $data_string = $_POST['dataString'];
    echo $data_string . PHP_EOL;
    $valid_id = preg_match('/^\d+-\d+$/', $game_id);
    $valid_string = preg_match('/^((0\tstart)|([-\d\t]{1,813}))$/', $data_string);
    if ($valid_id && $valid_string) {
        $file = fopen($_SERVER['DOCUMENT_ROOT'] . '/data/' . $game_id . '.txt', 'a');
        fwrite($file, $data_string . PHP_EOL);
        fclose($file);
    }
}
