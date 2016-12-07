<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Database
 *
 * @author florianwimmenauer
 */
class Database {

    private static $instance;
    private static $dsn = 'mysql:dbname=WebInvaders;host=localhost';
    private static $user = 'root';
    private static $password = '';

    public static function getInstance() {
        if (null === self::$instance) {
            self::$instance = new PDO(self::$dsn, self::$user, self::$password);
        }

        return self::$instance;
    }

    protected function __construct() {
        
    }

    private function __clone() {
        
    }

    private function __wakeup() {
        
    }

}
