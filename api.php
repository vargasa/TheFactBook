<?php
require_once("error.php");

header('Content-Type: application/json');
if ( isset($_GET['action']) ) { 
    $action = $_GET['action']; 
    $error = 0;
} else {
    $error = 10;
    $response = array( "Error" => $error, "Description" => describeError($error) );
    echo json_encode($response);
    exit;
}
//----------------------------------------------------------//
function addUser($username, $password) {

    $error = 0;
    
    $username = filter_var($username, FILTER_SANITIZE_STRING);
    $password = filter_var($password, FILTER_SANITIZE_STRING);	
    $password = sha1( $password );
	
    require_once("DBConst.php");
    $conn = new mysqli($db_servername, $db_username, $db_password, $db_name);

    if ($conn->connect_error) {
	$error = 5;
    } else {
	$conn->query("SET NAMES 'utf8'");
	
	$table = "$table_prefix" . "users";
	    
	$pstmt = $conn->prepare("INSERT INTO  $table (Username,Password) VALUES (?,?)");
	$pstmt->bind_param('ss', $username_, $password_);
	
	$username_ = $username;
	$password_ = $password;
	
	if($pstmt->execute()){
	    $description = "User has been created";
	}
	else{
	    $error = 6;
	}
    }
    
    return $error;

}
//----------------------------------------------------------//
function login($username, $password) {

    $username = filter_var($username, FILTER_SANITIZE_STRING);
    $password = filter_var($password, FILTER_SANITIZE_STRING);
	
    $password = sha1( $password );
	
    require_once('DBConst.php');
	
    $conn = new mysqli( $db_servername, $db_username, $db_password, $db_name );
	
    if ($conn->connect_error) {
	$error = 5;
    } else {
	$conn->query("SET NAMES 'utf8'");
	    
	$table = "$table_prefix" . "users";
	    
	$pstmt = $conn->prepare("SELECT UserId, Username FROM $table WHERE Username=? AND Password=?");
	$pstmt->bind_param('ss', $username_, $password_);
	    
	$username_ = $username;
	$password_ = $password;
	$pstmt->execute();
	$pstmt->bind_result($userId, $username);
	$pstmt->fetch();
	
	$login = array("userId" => $userId, "username" => $username);
	$pstmt->close();
	$conn->close();
    }

    return $login;

}
//----------------------------------------------------------//
function deleteFact($userId, $factId) {
    
    $error = 0;
    
    require_once('DBConst.php');

    $conn = new mysqli($db_servername, $db_username, $db_password, $db_name);

    if ($conn->connect_error) {
	$error = 5;
    } else {
	$conn->query("SET NAMES 'utf8'");
	
	$table = "$table_prefix" . "facts";
	
	$pstmt = $conn->prepare("DELETE FROM $table WHERE FactId=? AND UserId=?");
	$pstmt->bind_param("ii", $factId_, $userId_);
	
	$factId_ = $factId;
	$userId_ = $userId;
	
	$pstmt->execute();
	$pstmt->close();
	$conn->close();
    }  
    
    return $error;
}
//----------------------------------------------------------//
function addTag($factId, $tagTitle) {

    $error = 0;

    require('DBConst.php');

    $conn = new mysqli($db_servername, $db_username, $db_password, $db_name);
	
    if ($conn->connect_error) {
	$error = 5;
    } else {
	
	$tagsTable = "$table_prefix" . "tags";
	$factsTagsTable = "$table_prefix" . "facts_tags";
	
	$pstmt = $conn->prepare("SELECT TagId FROM $tagsTable WHERE (UserId=? AND TagTitle=?)");
	$pstmt->bind_param("is", $_SESSION['userID'], $tagTitle);
	     
	$pstmt->execute();
	$pstmt->bind_result($tagId);
	$pstmt->fetch();
	$pstmt->close();
	
	if ( !$tagId ) {

	    $pstmt = $conn->prepare("INSERT INTO $tagsTable (UserId, TagTitle) values (?,?)");
	    $pstmt->bind_param("is", $_SESSION['userID'], $tagTitle );
	    $pstmt->execute();

	    $tagId = $pstmt->insert_id;
	    
	    $pstmt->close();

	}
	
	$pstmt = $conn->prepare("SELECT FactId FROM $factsTagsTable WHERE FactId=? AND TagId=?");
	$pstmt->bind_param("ii", $factId, $tagId);
	$pstmt->execute();
	$pstmt->store_result();
	$pstmt->fetch();
	
	$nrows = $pstmt->num_rows;
	$pstmt->close();

	if ($nrows == 0) {
	    $pstmt = $conn->prepare("INSERT INTO $factsTagsTable (FactId, TagId) values (?,?)");
	    $pstmt->bind_param("ii", $factId, $tagId);
	    $pstmt->execute();
	    $pstmt->close();
	}
    }

    return $error;

}
//----------------------------------------------------//
function getTags($factId){

    require('DBConst.php');
    $factsTable = "$table_prefix" . "facts";
    $tagsTable = "$table_prefix" . "tags";
    $factsTagsTable = "$table_prefix" . "facts_tags";
    
    $conn1 = new mysqli($db_servername, $db_username, $db_password, $db_name);

    $query = "SELECT $tagsTable.TagTitle 
	      FROM $factsTagsTable 
		      INNER JOIN $tagsTable 
		      ON $factsTagsTable.TagId = $tagsTable.TagId 
	      WHERE FactId = ?";
    
    $pstmt1 = $conn1->prepare($query);
    $pstmt1->bind_param("i", $factId);
    $pstmt1->execute();
    $pstmt1->bind_result($rTag);

    $rTags = array();
    
    while ( $pstmt1->fetch() ) {
	$rTags[] = $rTag;
    }

    $conn1->close();
    return $rTags;
}

//----------------------------------------------------------//
if ( $action == "addUser" ) {
    
    if ( !isset( $_POST['username'], $_POST['password']) ) {
	$error = 1;
    } elseif (strlen( $_POST['username']) > 20 || strlen($_POST['username']) < 4) {
	$error = 2;
    } elseif (strlen( $_POST['password']) > 20 || strlen($_POST['password']) < 4) {
	$error = 3;
    } elseif (ctype_alnum($_POST['username']) != true) {
	$error = 4;
    } else {
	$error = addUser( $_POST['username'], $_POST['password'] );
    }

    $response = array("Error" => $error, "Description" => describeError($error));
    echo json_encode($response, JSON_PRETTY_PRINT);
    exit;
//----------------------------------------------------------//
} elseif ( $action == "login" ) {
    
    session_start();
    
    if ( !isset( $_POST['username'], $_POST['password']) ) {
	$error = 1;
    } else {

	$login = login( $_POST['username'], $_POST['password'] );

	$userID = $login['userId'];
	$username = $login['username'];

	if ( $userID != false ) {
	    $_SESSION['userID'] = $login['userId'];
	    $_SESSION['username'] = $login['username'];
	} else {
	    $error = 7;
	}
	
    }
    
    if ( $error != 0 ) {
	$response = array("Error" => $error, "Description" => describeError($error));
	echo json_encode($response, JSON_PRETTY_PRINT);
	exit;
    } else {
	header('Location: board.php');
	exit;
    }

//----------------------------------------------------------//
} elseif ( $action == "logout" ) {
        
    session_start(); 
    session_unset();
    session_destroy();
    header('Location: index.php');
    exit;

//----------------------------------------------------------//
} elseif ( $action == "getFacts" ) {
    
    session_start();

    if ( isset($_SESSION['userID']) ) {

	$userID = $_SESSION['userID'];
	if ( isset($_GET['searchTerm']) ) { $searchTerm = $_GET['searchTerm']; }
	if ( isset($_GET['fromLimit']) && isset($_GET['toLimit']) ){
	    $fromLimit = (int)$_GET['fromLimit'];
	    $toLimit = (int)$_GET['toLimit'];	
	} else {
	    $error = 11;
	}

	require_once('DBConst.php');
	
	$conn = new mysqli($db_servername, $db_username, $db_password, $db_name);

	
	if ($conn->connect_error ) {
	    $error = 5;
	} else {
	    $conn->query("SET NAMES 'utf8'");
	    $factsTable = "$table_prefix" . "facts";

	    
	    if ( !isset($_GET['searchTerm']) ) {

		$pstmt = $conn->prepare( "SELECT SQL_CALC_FOUND_ROWS 
						  FactId,
						  Fact,
						  Source,
						  Time 
					  FROM $factsTable 
					  WHERE UserId=? ORDER BY Time DESC
					  LIMIT ? OFFSET ?" );
		$pstmt->bind_param( 'iii', $userId_, $limit_, $offset_);

	    } else {

		parse_str($_GET['searchTerm'], $sCommand);
		
		if ( !empty($sCommand['tag']) ) {
		    $factsTagsTable = $table_prefix . "facts_tags";
		    $tagsTable = $table_prefix . "tags";
		    $factsTable = $table_prefix . "facts";
		    
		    $pstmt = $conn->prepare("SELECT SQL_CALC_FOUND_ROWS
						     $factsTable.FactId,
						     $factsTable.Fact,
						     $factsTable.Source,
						     $factsTable.Time
					     FROM $tagsTable
						     INNER JOIN $factsTagsTable
						     ON $tagsTable.TagId = $factsTagsTable.TagId
						     INNER JOIN $factsTable
						     ON $factsTagsTable.FactId = $factsTable.FactId
					     WHERE $tagsTable.TagTitle=? 
						     AND $factsTable.UserId=?
						     ORDER BY $factsTable.Time DESC
						     LIMIT ? OFFSET ?");
		    $pstmt->bind_param( 'siii', $sCommand['tag'],$userId_, $limit_, $offset_ );
		} else {
		    $pstmt = $conn->prepare( "SELECT SQL_CALC_FOUND_ROWS 
						      FactId, 
						      Fact, 
						      Source, 
						      Time 
					      FROM $factsTable 
					      WHERE UserId=? 
						      AND ( Fact LIKE CONCAT('%', ?, '%') 
						      OR Source LIKE CONCAT('%', ?, '%')
					      ) 
						      ORDER BY Time DESC 
					      LIMIT ? OFFSET ?" );
		    $pstmt->bind_param( 'issii', $userId_, $search_, $search_, $limit_, $offset_);
		    $search_ = $searchTerm;
		}
	    }
	    $offset_ = $fromLimit - 1 ;
	    $limit_ = $toLimit - $offset_;	    
	    $userId_ = $userID;
	    $pstmt->execute();
	    $pstmt->bind_result( $rID, $rFact, $rSource, $rTime);

	    $facts[0] = array();

	    while ( $pstmt->fetch() ) {
		$facts[]= array( "Id" => $rID, 
		    "Fact" => $rFact, 
		    "Source" => $rSource, 
		    "Tags" => getTags($rID),
		    "Time" => $rTime
		) ;
	    }

	    
	    $pstmt->prepare("SELECT FOUND_ROWS()");
	    $pstmt->execute();
	    $pstmt->bind_result( $rTotal );
	    $pstmt->fetch();

	    //TODO: Implementar perPage Option

	    $facts[0] = array( "Error" => $error, 
		"Description" => describeError($error),
		"User" => $_SESSION['username'],
		"PerPage" => 50,
		"Total" => $rTotal, 
		"Range" => array("From" => $fromLimit, "To" => $toLimit )
	    );
	    
	    $response = $facts;
	    $pstmt->close();
	    $conn->close();
	    
	}
    } else {
	$error = 9;
    }

    if ( $error != 0){
	$response = array("Error" => "$error", "Description" => describeError($error));
    }
    
    echo json_encode($response, JSON_PRETTY_PRINT | JSON_FORCE_OBJECT);
    exit;

    
//----------------------------------------------------------//
} elseif ( $action == "addFact" ) {

    session_start();
    
    $fact = $_POST['fact'];
    $source = $_POST['source'];
    if ( isset($_POST['id']) ) { $id = $_POST['id']; }
    
    if ( isset( $_POST['username'] ) && isset( $_POST['password'] ) ) {

	$login = login( $_POST['username'], $_POST['password'] ) ;
	$userID = $login['userId'];
	
	if ($userID != false) {
	    $_SESSION['userID'] = $userID;
	} else {
	    $error = 7;
	}
    }

    if ( strlen($fact) == 0 || strlen($source) == 0) {
	$error = 8;
    } else {
	//TODO: Adaptar para introducir tags nuevas y antiguas.
	
	require('DBConst.php');

	$conn = new mysqli($db_servername, $db_username, $db_password, $db_name);
	
	 if ($conn->connect_error) {
	     $error = 5;
	 } else {
	     $conn->query("SET NAMES 'utf8'");
	     
	     $table = "$table_prefix" . "facts";
	     
	     if ( isset($id) && $id != 0 ){
		 
		 $factsTagsTable = $table_prefix . "facts_tags";

		 $pstmt = $conn->prepare("DELETE FROM $factsTagsTable WHERE FactId = ? ");
		 $pstmt->bind_param("i", $id);
		 $pstmt->execute();
		 $pstmt->close();

		 //Modify fact instead
		 $pstmt = $conn->prepare("UPDATE $table SET Fact=?, Source=? WHERE FactId = ? AND UserId=?");
		 $pstmt->bind_param("ssii", $fact_, $source_, $factId_ , $userId_);
		 
		 $fact_ = $fact;
		 $source_ = $source;
		 $factId_ = $id;
		 $userId_ = $_SESSION['userID'];
		 
		 $pstmt->execute();
		 $pstmt->close();

		 $edited = true;
	     } else {

		 $pstmt = $conn->prepare("INSERT INTO $table (Fact,Source,UserId) values (?,?,?)");
		 $pstmt->bind_param("ssi", $fact_, $source_, $userId_);
		 
		 $fact_ = $fact;
		 $source_ = $source;
		 $userId_ = $_SESSION['userID'];
		 
		 $pstmt->execute();
		 
		 $id = $pstmt->insert_id; //last id inserted
		 $edited = false;
		 
  		 $pstmt->close();
	     }

	     $tags = explode(',', $_POST['tags']);
	     
	     foreach ($tags as $tag) {
		 if (!empty($tag)) { addTag($id, $tag); }
	     }
	     
	     $pstmt = $conn->prepare( "SELECT FactId, Fact, Source, Time FROM $table 
				       WHERE UserId=? AND FactId=?" );

	     $pstmt->bind_param( 'ii', $userId_,$factId_);

	     $factId_ = $id;
	     $userId_ = $_SESSION['userID'];

	     $pstmt->execute();
	     $pstmt->bind_result( $rID, $rFact, $rSource, $rTime);
	     $pstmt->fetch();

	     
	     $response = array ("Error" => $error, 
		 "Description" => describeError($error), 
		 "Id" => $rID, 
		 "Fact" => (string)$rFact, 
		 "Source" => (string)htmlentities($rSource),
		 "Tags" => getTags($rID),
		 "Time" => (string)$rTime, 
		 "Edited" => $edited
	     );
	     
	     $pstmt->close();
	     $conn->close();
	 }
     }

    if ( $error != 0){
	$response = array("Error" => "$error", "Description" => describeError($error));
    }

    echo json_encode($response, JSON_PRETTY_PRINT | JSON_FORCE_OBJECT);
    exit;
//----------------------------------------------------------//
 } elseif ($action="deleteFact") {

     session_start();

     if ( isset($_SESSION['userID']) ) {
	 if ( isset($_GET['id']) ) {
	     $error = deleteFact( $_SESSION['userID'], $_GET['id'] );
	 } else {
	     $error = 12;
	 }
     } else {
	 $error = 9;
     }

     $response = array("Error" => $error, "Description" => describeError($error));
     
     echo json_encode($response,JSON_PRETTY_PRINT);
     exit;

}

?>
