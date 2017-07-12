<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $game_id = $_POST['gameID'];
    $data_string = $_POST['dataString'];
    $valid_id = preg_match('/^\d+-\d+$/', $game_id);
    $valid_string = preg_match('/^[-\d\t]{1,1000}$/', $data_string);
    if ($valid_id && $valid_string) {
        $file = fopen($_SERVER['DOCUMENT_ROOT'] . '/data/' . $game_id . '.txt', 'a');
        $block = 1;
        if (flock($file, LOCK_EX, $block)) {
            {
                fwrite($file, $data_string . PHP_EOL);
                flock($file, LOCK_EX, $block);
            }
        }
        fclose($file);
    }
}
?>
