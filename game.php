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
    $select = $dbh->prepare("SELECT * FROM `user` AS u
INNER JOIN `score` AS s ON u.`id` = s.`userId`
WHERE u.`name` = :name
ORDER BY s.`score` DESC LIMIT 1");

    $select->bindParam(':name', $name);
    $select->execute();
    while ($row = $select->fetch()) {
        $scores = $row['score'];
    }
    $select = null;
    echo json_encode($scores);

}

if ($action === 'name' && $_SESSION['logged_in'] === true) {
    echo json_encode($name);
}
$action = isset($_GET['addHighscore']) ? $_GET['addHighscore'] : '';
if ($action === 'new' && $_SESSION['logged_in'] === true) {
    $score = $_POST['score'];
    $id = -1;
    $select = $dbh->prepare("SELECT `id` FROM `user`  WHERE `name` = :name");
    $select->bindParam(':name', $name);
    $select->execute();
    while ($row = $select->fetch()) {
        $id = $row['id'];
    }
    if ($id > -1) {
        $select = $dbh->prepare("INSERT INTO `score`(`userId`, `score`) VALUES (:id, :score)");
        $select->bindParam(':id', $id);
        $select->bindParam(':score', $score);
        $select->execute();
    }
    $select = null;
    echo 1;
}
