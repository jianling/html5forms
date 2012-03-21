<?php
    header("Content-type: text/html; charset=utf-8");
    echo $_POST;
    echo file_get_contents("php://input");
?>