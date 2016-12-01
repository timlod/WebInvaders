<?php
require 'lib/Database.class.php';

session_start();
if($_SESSION['logged_in'] === true) {
    $scores;
    $name = $_SESSION["name"];
    $dbh = Database::getInstance();
    if(isset($_POST['showAll'])) {
        echo "ISSET";
        $id = -1;
        $select = $dbh->prepare("SELECT `id` FROM `user`  WHERE `name` = :name");
        $select->bindParam(':name', $name);
        $select->execute();
        while($row = $select->fetch()){
           $id = $row['id'];
        }
        echo "$id";
        if($id > -1) {
            $select = $dbh->prepare("SELECT `userId`, `score` FROM `score` WHERE `userId` = :id");
            $select->bindParam(':id', $id);
            $select->execute();
            while($row = $select->fetch()){
                $scores[] = $row;
            }
        } 
        $select = null;
    } else {
        echo "NOT";
        $select = $dbh->prepare("SELECT `userId`, `score` FROM `score` WHERE 1");
        $select->execute();
        while($row = $select->fetch()){
            $scores[] = $row;
        }
        $select = null;
    }
    echo "asdfasdfasdgr<pre>";
    print_r($scores);
    echo "</pre>";
}