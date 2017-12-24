<?php 

function describeError($error) {

    switch ($error) {
	case 0:
	    $description = 'No Error';
	    break;
	case 1:
	    $description = 'Username or Password are empty';
	    break;
	case 2:
	    $description = 'Incorrect Length for Username, you must use at least 4 characters';
	    break;
	case 3:
	    $description = 'Incorrect Length for Password';
	    break;
	case 4:
	    $description = "Username must be alphanumeric";
	    break;
	case 5:
	    $description = "Server is having troubles connecting to the database"; 
	    break;
	case 6:
	    $description = "Username already exists";
	    break;
	case 7:
	    $description = "Login failed, Check your credentials!";
	    break;
	case 8:
	    $description = "Fact or source are empty";
	    break;
	case 9:
	    $description = "You're not looged in";
	    break;
	case 10:
	    $description = "No action defined";
	    break;
	case 11:
	    $description = "No limits defined";
	    break;
	case 12:
	    $description = "ID not defined";
	    break;
	default:
	    $description = "Unknown Error";
	    break;
    }

    return $description;

}
?>
