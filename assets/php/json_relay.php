<?php
header("Content-type: application/json");
$url = $_GET["url"];
$fileContent = file_get_contents($url);
//$xml = simplexml_import_dom($fileContent);

//echo $dom;

//$file = readfile($url);
echo $fileContent;


?>