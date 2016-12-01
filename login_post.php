<?php

require 'lib/Database.class.php';

const name = "Name";
const pw = "pw";
try {
    $dbh = Database::getInstance();
    $name = filter_input(INPUT_POST, 'user');
    $pw = filter_input(INPUT_POST, 'password');

    
    $select = $dbh->prepare("SELECT `password` FROM `user` WHERE `name` = :name");
    
    $select->bindParam(':name', $name);
   
    $select->execute();
    $readPW;
    while($row = $select->fetch()){
       $readPW = $row['password'];
    }
  
    if (password_verify($pw, $readPW)) { 
        session_start();
        $_SESSION['logged_in'] = true;
        $_SESSION['name'] = $name;
        header('Location: userdata.php');
    } else {
        echo "PW OR USER NAME WRONG";
    }
    
    $insert = null;

    $dbh = null;
} catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
}
