<?php
$data_dir = $_SERVER['DOCUMENT_ROOT'] . '/data';

if (!file_exists($data_dir)) {
    $oldmask = umask(0);
    mkdir($data_dir, 0744);
}
?>
