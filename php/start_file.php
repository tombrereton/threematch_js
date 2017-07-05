<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $game_id = $_POST['gameID'];
    $valid_id = preg_match('/^\d*-\d*$/', $game_id);
    if ($valid_id) {
        $data_file = fopen($_SERVER['DOCUMENT_ROOT'] . '/data/' . $game_id . '.txt', 'a');
        include('header.php');
        fclose($data_file);
    }
}
?>
