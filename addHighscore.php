<?php
require 'lib/Database.class.php';

session_start();
if($_SESSION['logged_in'] === true) {
    $score = filter_input(INPUT_POST, 'score');
    $name = $_SESSION["name"];
    $id = -1;
    $dbh = Database::getInstance();
    $select = $dbh->prepare("SELECT `id` FROM `user`  WHERE `name` = :name");
    $select->bindParam(':name', $name);
    $select->execute();
    
    while($row = $select->fetch()){
       $id = $row['id'];
    }
    $select = null;
    if($id > -1) {
        $insert = $dbh->prepare("INSERT INTO `score`(`userId`, `score`) VALUES (:id, :score)");
        $insert->bindParam(':id', $id);
        $insert->bindParam(':score', $score);
        $insert->execute();
        $insert = null;
    } 
     header('Location: game.html');
}