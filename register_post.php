<?php

require 'lib/Database.class.php';


try {
    $dbh = Database::getInstance();
    $name = filter_input(INPUT_POST, 'name');

    $pw = password_hash(filter_input(INPUT_POST, 'pw'), PASSWORD_BCRYPT);
    $range = array(
        'options' => array('min_range' => 1, 'max_range' => 6)
    );
    $grade = filter_input(INPUT_POST, 'grade', FILTER_VALIDATE_INT, $range);

    if ($grade == FALSE || $grade == NULL) {
        echo "INVALID INPUT";
    } else {
        $insert = $dbh->prepare("INSERT INTO `user`(`name`, `password`, `grade`) "
                . "VALUES (:name, :pw, :grade)");
        $insert->bindParam(':name', $name);
        $insert->bindParam(':pw', $pw);
        $insert->bindParam(':grade', $grade);
        $insert->execute();
        $insert = null;
    }
    $dbh = null;
} catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
}