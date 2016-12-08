<?php
require 'lib/Database.class.php';
session_start();
if (!isset($_SESSION['list'])) {
    $_SESSION['list'] = array();
}

$scores;
$name = $_SESSION["name"];
$dbh = Database::getInstance();

$action = isset($_GET['show']) ? $_GET['show'] : '';

if ($action === 'highestScore' && $_SESSION['logged_in'] === true) {
    $id = -1;
    $select = $dbh->prepare("SELECT `id` FROM `user`  WHERE `name` = :name");
    $select->bindParam(':name', $name);
    $select->execute();
    while ($row = $select->fetch()) {
        $id = $row['id'];
    }
    if ($id > -1) {
        $select = $dbh->prepare("SELECT `score` FROM `score` WHERE `userId` = :id ORDER BY `score` DESC LIMIT 1");
        $select->bindParam(':id', $id);
        $select->execute();
        while ($row = $select->fetch()) {
            $scores = $row['score'];
        }
    }
    $select = null;
    echo json_encode($scores);
}

if ($action === 'name' && $_SESSION['logged_in'] === true) {
    echo json_encode($name);
}

