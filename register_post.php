<?php

require 'lib/Database.class.php';


try {
    $dbh = Database::getInstance();
    $name = filter_input(INPUT_POST, 'name');

    $pw = password_hash(filter_input(INPUT_POST, 'password'), PASSWORD_BCRYPT);

    $nameAvailable = TRUE;
    
    $select = $dbh->prepare("SELECT `name` FROM `user`  WHERE `name` = :name");
    $select->bindParam(':name', $name);
    $select->execute();
    if($select->rowCount() > 0){
        $nameAvailable = FALSE;
    } 
    $select = null;
    if($nameAvailable === TRUE){
        $insert = $dbh->prepare("INSERT INTO `user`(`name`, `password`) VALUES (:name, :pw)");
        $insert->bindParam(':name', $name);
        $insert->bindParam(':pw', $pw);
        $insert->execute();
        $insert = null;
        
        session_start();
        $_SESSION['logged_in'] = true;
        $_SESSION['name'] = $name;
        $_SESSION['grade'] = $grade;
        header('Location: game.html');
    } else {
        header('Location: register.html');
    }
    $dbh = null;
} catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
}