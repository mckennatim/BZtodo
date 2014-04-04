<?php 
include('/usr/local/lib/tm/ChromePhp.php');
include  '/usr/local/lib/tm/db.php';
$list=mysql_real_escape_string($_GET['list']);
ChromePhp::log($list);

$db= new Db('test');

try {
  $dbh  = new PDO("mysql:host=$db->host; dbname=$db->database",$db->user, $db->pass);
  $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $sql  = 'SELECT `items` FROM `todos` WHERE list=?';
  $stmt = $dbh->prepare($sql);
  $stmt->execute(array($list));
  $result = $stmt->fetch(PDO::FETCH_OBJ);
  //print_r($result);
} catch(PDOException $e) {
echo '{"error":{"text":'. $e->getMessage() .$sql.'}}'; 
}

$retJSON= json_encode($result);
echo $retJSON;
?>