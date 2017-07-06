<?php
require('create_data_dir.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $game_id = $_POST['gameID'];
    $valid_id = preg_match('/^\d*-\d*$/', $game_id);
    if ($valid_id) {
        $data_file = fopen($_SERVER['DOCUMENT_ROOT'] . '/data/' . $game_id . '.txt', 'a');

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
