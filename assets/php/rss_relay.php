<?php
header("Content-type: text/xml");
$url = $_GET["url"];
$fileContent = file_get_contents($url);
//$xml = simplexml_import_dom($fileContent);

//echo $dom;

//$file = readfile($url);
echo $fileContent;


?>