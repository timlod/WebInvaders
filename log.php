<?php

require 'lib/Database.class.php';
session_start();
$action = isset($_GET['show']) ? $_GET['show'] : '';

if ($action === 'log') {
    $log = [];
    if (empty($_SESSION['logged_in'])){
        echo json_encode(['logged_in'=>false,'name'=>'']);
    } else {
        $log['login'] = $_SESSION['logged_in'];
        $log['name'] = $_SESSION['name'];
        echo json_encode($log);
    }
}
