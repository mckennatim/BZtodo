<?php  
class Tbl {
	public $tblname;
	public $insarr;
	public $fieldStr;
	public $insValStr;
	public $insWcolon;
	public $insSql;
	public $dbo;
	public $whereStr;
	public $lastInsertId;
	public function Tbl($tablename, $dbo) {
		$this->tblname=$tablename;
		$this->dbo = $dbo;
	}
	public function getPrimary(){

	}
	public function setInsArr($insarr){
		$this->insarr=$insarr;
		$inf = ' (';
		$inv = ' (';
		foreach ($insarr as $key => $value) {
			$newkey = ':'.$key;
			$this->insWcolon[$newkey]=$value;
			$inf .= '`'. $key.'`, ' ;
			$inv .= $newkey.', ' ;
		}
		$this->fieldStr = substr_replace($inf ,") ",-2);
		$this->insValStr = substr_replace($inv ,") ",-2);
		$this->insSql='INSERT INTO `'. $this->tblname .'`'. $this->fieldStr . ' VALUES'. $this->insValStr ;
	}
	public function getLastRec(){

	}
	public function setWhereStr($wherearr){
		$ws=' WHERE ';
		foreach ($wherearr as $key => $value){
			$ws .= $key. ' = "' . $value . '" AND ';
		}
		$this->whereStr = substr_replace($ws ,"",-4);
	}
	public function selectWhere()
	{
		$db=$this->dbo;
		$whereQry= 'SELECT '. $this->fieldStr.' FROM '.$this->tblname . $this->whereStr;
		try {
			$dbh  = new PDO("mysql:host=$db->host; dbname=$db->database",$db->user, $db->pass);
			$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$sql  = $whereQry;
			$stmt = $dbh->prepare($sql);
			$stmt->execute();
			$result = $stmt->fetchAll(PDO::FETCH_OBJ);
			return $result;
		} catch(PDOException $e) {
	      	echo '{"error":{"text":'. $e->getMessage() .$sql.'}}'; 
		}  	
	}
	public function deleteWhere(){
		$db=$this->dbo;
		$delQry= 'DELETE FROM '.$this->tblname . $this->whereStr;
		try {
			$dbh  = new PDO("mysql:host=$db->host; dbname=$db->database",$db->user, $db->pass);
			$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$sql  = $delQry;
			$stmt = $dbh->prepare($sql);
			$stmt->execute();
		} catch(PDOException $e) {
	      	echo '{"error":{"text":'. $e->getMessage() .$sql.'}}'; 
		}  	
	}
	public function pdo_insert(){
		$db=$this->dbo;
	try {
		$dbh  = new PDO("mysql:host=$db->host; dbname=$db->database",$db->user, $db->pass);
		$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$sql  = $this->insSql;
		$stmt = $dbh->prepare($sql);
		$stmt->execute($this->insWcolon);
      	$this->lastInsertId=$dbh->lastInsertId();
	} catch(PDOException $e) {
      	$this->lastInsertId=0;
      	echo '{"error":{"text":'. $e->getMessage() .$sql.'}}'; 
	}  		
	}
}
?>