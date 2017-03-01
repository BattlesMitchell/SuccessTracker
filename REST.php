<?php
	/*
		RESTful API. Governs CRUD operations.
	*/
	$method = $_SERVER['REQUEST_METHOD'];
	
	switch($method){
		case "GET":
			$data = $_GET['data'];
			if($data == "LIST"){
				$exit_value = get_user_list($_GET['type']);
			}else{
				$exit_value = get_user_statistics($data, $_GET['type'], $_GET['start'], $_GET['end']);
			}
			break;
		case "POST":
			//add error handling here
			$data = $_POST['data'];
			add_user_statistics($_POST['type']);//, $_POST['name'], $_POST['date'], $_POST['dials'], $_POST['contacts'], $_POST['nurtures'], $_POST['appointments']);
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
	function add_user_statistics($type){//, $name, $date, $dials, $contacts, $nurtures, $appointments){
		// Connecting, selecting database
		$dbconn = pg_connect("host=localhost dbname=postgres user=battlesm password=password")
			or die('Could not connect: ' . pg_last_error());
		
		// Performing SQL query
		$query = "INSERT INTO ";
		
		if($type == "isa"){
			$query = $query . "isa ";
			$query = $query . "VALUES('" . $_POST['name'] . "', " . $_POST['date'] . ", " . $_POST['dials'] . ", " . $_POST['contacts'] . ", " . $_POST['nurtures'] . ", '" . $_POST['listingAppointments'] . "', '" . $_POST['buyerAppointments'] . "')";
		}else{
			$query = $query . "agent ";
			$query = $query . "VALUES('" . $_POST['name'] . "', " . $_POST['date'] . ", " . $_POST['dials'] . ", " . $_POST['contacts'] . ", " . $_POST['nurtures'] . ", '" . $_POST['las'] . "', '" . $_POST['lah'] . "', '" . $_POST['lt'] . "', '" . $_POST['bas'] . "', '" . $_POST['bah'] . "', '" . $_POST['bbas'] . "', '" . $_POST['cw'] . "', '" . $_POST['ca'] . "')";
		}
		
		
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
	function get_user_statistics($name, $type, $start, $end){
		// Connecting, selecting database
		$dbconn = pg_connect("host=localhost dbname=postgres user=battlesm password=password")
			or die('Could not connect: ' . pg_last_error());

		$query = "SELECT * FROM ";//successes";
		
		if($type == "isa"){
			$query = $query . "isa WHERE ";
		}else{
			$query = $query . "agent WHERE ";
		}
		
		// Performing SQL query
		if($name != "all"){
			$query = $query . "name = '" . $name . "' AND ";
		}
		
		$query = $query . "date >= " . $start . " AND date <= " . $end;
		
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
	
	function get_user_list($type){
		// Connecting, selecting database
		$dbconn = pg_connect("host=localhost dbname=postgres user=battlesm password=password")
			or die('Could not connect: ' . pg_last_error());

		// Performing SQL query
		$query = "SELECT DISTINCT name FROM ";
		$query = $query . $type;
		
		$result = pg_query($query) or die('Query failed: ' . pg_last_error());
		$value_arr = array ();
		$count = 0;
		
		// Printing results in HTML
		while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
			array_push($value_arr, $line);
		}

		// Free resultset
		pg_free_result($result);

/* 		$query = "SELECT DISTINCT name FROM isa";
		
		while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
			$unique = true;
			for($i = 0; $i < $count; ++$i){
				if(value_arr[$i] == $line){
					$unique = false;
				}
			}
			if($unique){
				array_push($value_arr, $line);
			}
		} */
		
		// Closing connection
		pg_close($dbconn);
		
		return $value_arr;
	}
?>