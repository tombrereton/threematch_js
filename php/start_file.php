<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $game_id = $_POST['gameID'];
    $data_file = fopen($_SERVER['DOCUMENT_ROOT'] .'/data/' . $game_id . '.txt', 'a');
    $header_file = fopen('header.txt', 'r');
    while (!feof($header_file)) {
        fwrite($data_file, fgets($header_file));
    }
    fclose($data_file);
    fclose($header_file);
}
?>