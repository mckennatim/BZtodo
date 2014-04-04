<?php 
include('/usr/local/lib/tm/ChromePhp.php');
include  '/usr/local/lib/tm/db.php';
$list=$_GET['list'];
if(isset($_POST['data'])){
  $blob=$_POST['data'];
  ChromePhp::log($blob);
}else{
  $blob='a blob';
}

ChromePhp::log($list);

$db = new Db('test');

$dbh  = new PDO("mysql:host=$db->host; dbname=$db->database",$db->user, $db->pass);
$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

try {
  $dsql = "DELETE FROM `todos` WHERE `list`= ?";
  $stmt = $dbh->prepare($dsql);
  $stmt->execute(array($list));
} catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .$dsql.'}}'; 
} 

try {
  $sql = "INSERT INTO `todos` (`list`, `items`) VALUES (?, ?)";
  $stmt = $dbh->prepare($sql);
  $stmt->execute(array($list, $blob));
} catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .$sql.'}}'; 
} 
?>
