<?php
	/*
		RESTful API. Governs CRUD operations.
	*/
	$method = $_SERVER['REQUEST_METHOD'];
	
	switch($method){
		case "GET":
			$data = $_GET['data'];
			if($data == "LIST"){
				$exit_value = get_user_list();
			}else{
				$exit_value = get_user_statistics($data);
			}
			break;
		case "POST":
			//add error handling here
			$data = $_POST['data'];
			add_user_statistics($_POST['name'], $_POST['date'], $_POST['dials'], $_POST['contacts'], $_POST['nurtures'], $_POST['appointments']);
			break;
		case "PUT":
			$data = $_PUT['data'];
			break;
		case "DELETE":
			$data = $_DELETE['data'];
			break;
	}

	//echo($data . " and recieved"); //need to echo out the data that i want to return...
	//return $data . " and recieved";
	$exit_value = json_encode($exit_value);
	echo $exit_value;
	return $exit_value;
	
	/**
	*	Switch to prepared statement
	*/
	function add_user_statistics($name, $date, $dials, $contacts, $nurtures, $appointments){
		// Connecting, selecting database
		$dbconn = pg_connect("host=localhost dbname=postgres user=battlesm password=password")
			or die('Could not connect: ' . pg_last_error());

		// Performing SQL query
		$query = "INSERT INTO successes VALUES('" . $name . "', " . $date . ", " . $dials . ", " . $contacts . ", " . $nurtures . ", " . $appointments . ")";
		$result = pg_query($query) or die('Query failed: ' . pg_last_error());

		// Free resultset
		pg_free_result($result);

		// Closing connection
		pg_close($dbconn);
		
		return $value_arr;
	}
	
	
	/**
	*	Switch to prepared Statement
	*/
	function get_user_statistics($name){
		// Connecting, selecting database
		$dbconn = pg_connect("host=localhost dbname=postgres user=battlesm password=password")
			or die('Could not connect: ' . pg_last_error());

		$query = "SELECT * FROM successes";
		// Performing SQL query
		if($name != "all"){
			$query = $query . " WHERE name = '" . $name . "'";
		}
		
		$result = pg_query($query) or die('Query failed: ' . pg_last_error());
		$value_arr = array ();
		
		// Printing results in HTML
		while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
			$temp = array ();
			foreach ($line as $current_value) {
				array_push($temp, $current_value);
			}
			array_push($value_arr, $temp);
		}

		// Free resultset
		pg_free_result($result);

		// Closing connection
		pg_close($dbconn);
		
		return $value_arr;
	}
	
	function get_user_list(){
		// Connecting, selecting database
		$dbconn = pg_connect("host=localhost dbname=postgres user=battlesm password=password")
			or die('Could not connect: ' . pg_last_error());

		// Performing SQL query
		$query = "SELECT DISTINCT name FROM successes";
		$result = pg_query($query) or die('Query failed: ' . pg_last_error());
		$value_arr = array ();
		
		// Printing results in HTML
		while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
			array_push($value_arr, $line);
		}

		// Free resultset
		pg_free_result($result);

		// Closing connection
		pg_close($dbconn);
		
		return $value_arr;
	}
?>