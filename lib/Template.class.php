<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Template
 *
 * @author florianwimmenauer
 */
class Template {

    //put your code here
    private $toAssign = [];

    public function assign($key, $value) {
        $this->toAssign[$key] = $value;
    }

    public function display($file) {
        $content = file_get_contents($file);
        foreach ($this->toAssign as $key => $value) {
            $content = str_replace('{$' . $key . '}', $value, $content);
        }
        echo($content);
    }

}
