<?php
// php image proxy


$img = $_REQUEST['img'];


$remoteImage = $img;
$imginfo = getimagesize($remoteImage);
header("Content-type: ".$imginfo['mime']);
readfile($remoteImage);
?>