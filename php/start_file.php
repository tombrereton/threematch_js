<?php
require('create_data_dir.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $game_id = $_POST['gameID'];
    $valid_id = preg_match('/^\d*-\d*$/', $game_id);
    echo $_SERVER['DOCUMENT_ROOT'] . PHP_EOL;
    if ($valid_id) {
        $path = $_SERVER['DOCUMENT_ROOT'] . '/data/' . $game_id . '.txt';
        echo $path . PHP_EOL;
        echo $data_file = fopen($path, 'a');

        $block = 1;
        if (flock($data_file, LOCK_EX, $block)) {
            {
                include('header.php');
                flock($data_file, LOCK_EX, $block);
            }
        }

        fclose($data_file);
    }
}
?>
