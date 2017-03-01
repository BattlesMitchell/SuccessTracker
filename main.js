(function(angular){
	'use strict';
var app = angular.module('success_tracker', ['ngMessages', 'angular-growl', 'ui.toggle']);

app.config(['growlProvider', function (growlProvider) {
  growlProvider.globalTimeToLive(3000);
}]);

app.controller('STController', ['$window', '$scope', 'growl', function($window, $scope, growl) {
  $scope.input = false;
  $scope.statistics = true;
  $scope.statisticsToggle = true;
  $scope.failTruthy = "";
  $scope.userList = [];
  
  $scope.agent = false;
  $scope.ISA = false;
  
  $scope.isaDateRangeStart = undefined;
  $scope.isaDateRangeEnd = undefined;
  $scope.agentDateRangeStart = undefined;
  $scope.agentDateRangeEnd = undefined;
  
  $scope.userType = "agent";
  
  $scope.inputSelector = true;
  //$scope.leftDataList = ["dials", "contacts", "nurtures", "appointments"];
  //$scope.rightDataList = ["dials", "contacts", "nurtures", "appointments"];
  
  $scope.isaDataList = ["dials", "contacts", "nurtures", "listing appointments", "buyer appointments"];
  $scope.agentDataList = ["dials", "contacts", "nurtures", "listing appointments set", "listing appointments held", "Listings taken", "Buyer appointments set", "Buyer appointments held",
  "Buyer Broker Agreement's Signed", "Contracts Written", "Contracts Accepted"];
  
  //$scope.statistics = [];
  $scope.errors = {"appointments" : ["required", "minlength", "maxlength"]};
  
  $scope.load = function(){
	//console.log("starting");
	$scope.getUserList();
	if($scope.userType == "isa"){
		$scope.getUserStatistics($scope.isaUserName, "", "", "isa");
		//constructGraph($scope.isaRightData, $scope.isaLeftData, $scope.isaStatistics, "line");
	}else{
		$scope.getUserStatistics($scope.agentUserName, "", "", "agent");
		//constructGraph($scope.agentRightData, $scope.agentLeftData, $scope.agentStatistics, "line");
	}
  }
  
  $scope.growlTest = function(){
	  console.log("Growling");
	  var config = {};
	  growl.success("<b>I'm</b> a success message", config);
  }
  
  $scope.growlSuccess = function(type){
	  console.log("Growling");
	  var config = {};
	  growl.success("Successfully input new " + type + " data!");
  }
  
  $scope.growlError = function(type, errorMsg){
	  console.log("Growling");
	  var config = {};
	  growl.error("Failed to input input new " + type + " data.<br>" + errorMsg);
  }
  
  $scope.inputData = function(){
	  $scope.statistics = false;
	  $scope.input = true;
	  $("#home").removeClass("active");
	  $("#inputData").addClass("active");
  }
  
  $scope.homeData = function(){
	  $scope.input = false;
	  $scope.statistics = true;
	  $("#inputData").removeClass("active");
	  $("#home").addClass("active");
  }
  
  
  //DUMMY FUNCTIONS - PURELY FOR DEV TESTING PURPOSES
  
  $scope.isaUserName = "all";
  $scope.agentUserName = "all";
  //$scope.count = 0;
  
  $scope.updateUserName = function(){
	//console.log("updating username");
	if($scope.userType == "isa"){
		$scope.isaUserName = "in progress";
	}else{
		$scope.agentUserName = "in progress";
	}
  }
 
  $scope.testPHP = function(){
	$.ajax({
	  method: "POST",
	  url: "REST.php",
	  data: {'data': "sent"},
	  success: function(data){
		  console.log("success");
		  console.log(data);
	  },
	  error: function(data){
		  console.log("failure");
		  console.log(data);
	  }
	});
  }
  //END DUMMY FUNCTIONS - PURELY FOR DEV TESTING PURPOSES
  
  $scope.isaRightData = "dials";
  $scope.isaLeftData = "nurtures";
  
  $scope.agentRightData = "dials";
  $scope.agentLeftData = "nurtures";
  
  /***
	Updates the type of user displayed on the statistics page.
	Agent to and from ISA
  
  */
  $scope.updateStatisticsUserType = function(){
	  if($scope.userType == "isa"){
		  $scope.userType = "agent";
		  $scope.getUserStatistics($scope.agentUserName, "", "", "agent");
		  constructGraph($scope.agentRightData, $scope.agentLeftData, $scope.agentStatistics, "line");
	  }else{
		  $scope.userType = "isa";
		  $scope.getUserStatistics($scope.isaUserName, "", "", "isa");
		  constructGraph($scope.isaRightData, $scope.isaLeftData, $scope.isaStatistics, "line");
	  }
	  
	  //constructGraph($scope.rightData, $scope.leftData, $scope.statistics, "line");
  }
  
  /***
	On the input data form this toggles the type of form.
  
  */
  $scope.chooseInputForm = function(type){
	  $scope.inputSelector = false;
	  
	  if(type == "ISA"){
		  $scope.ISA = true;
	  }
	  
	  if(type == "agent"){
		  //console.log("setting agent to true");
		  $scope.agent = true;
	  }
  }
  
  
  /***
	Reset's the input form (for use with Back button)
  
  */
  $scope.formReset = function(){
	  $scope.inputSelector = true;
	  $scope.ISA = false;
	  $scope.agent = false;
  }
  
  /***
	gets a list of all availble users 
  
  */
  $scope.getUserList = function(){
	//clean out the list of users and repopulate.
	$scope.agentUserList = [];
	$scope.isaUserList = [];
	
	$.ajax({
	  method: "GET",
	  url: "REST.php",
	  data: {'data': "LIST", 'type': "isa"},
	  success: function(data){
		  data = JSON.parse(data);
		  var append_target = $("#available_users");
		  for(var i = 0; i < data.length; ++i){
			  $scope.isaUserList.push(data[i].name);
		  }
		  $scope.$apply();
	  },
	  error: function(data){
		  console.log("failure");
		  console.log(data);
	  }
	});
	
	$.ajax({
	  method: "GET",
	  url: "REST.php",
	  data: {'data': "LIST", 'type': "agent"},
	  success: function(data){
		  data = JSON.parse(data);
		  var append_target = $("#available_users");
		  for(var i = 0; i < data.length; ++i){
			  $scope.agentUserList.push(data[i].name);
		  }
		  $scope.$apply();
	  },
	  error: function(data){
		  console.log("failure");
		  console.log(data);
	  }
	});
  }
  
  $scope.getUserStatistics = function(user, rightData, leftData, userType, start, end){
	  
	  var startDate = 0;
	  var endDate = 0;
	  
	  if(!start){
		  start = getStartDate(userType);  
	  }
	  
	  if(!end){
		  end = getEndDate(userType);  
	  }
	  
	  if(userType == "isa"){
		  if(!rightData){
			  rightData = $scope.isaRightData;
		  }
		  
		  if(!leftData){
			  leftData = $scope.isaLeftData;
		  }
		  
		  if(start){
			  startDate = encodeDate(start);
		  }else{
			  startDate = Date.now();
			  var millisInDay = 86400000;
			  var millisThirtyDays = millisInDay * 30;
			  startDate = startDate - millisThirtyDays;
		  }
		  
		  if(end){
			  endDate = encodeDate(end);
		  }else{
			  endDate = Date.now();
		  }
		  
	  }else{
		  if(!rightData){
			  rightData = $scope.agentRightData;
		  }
		  
		  if(!leftData){
			  leftData = $scope.agentLeftData;
		  }
		  
		  if(start){
			  startDate = encodeDate(start);
		  }else{
			  startDate = Date.now();
			  var millisInDay = 86400000;
			  var millisThirtyDays = millisInDay * 30;
			  startDate = startDate - millisThirtyDays;
		  }
		  
		  if(end){
			  endDate = encodeDate(end);
		  }else{
			  endDate = Date.now();
		  }
	  }
	  
	  if(user){
		if(userType == "isa"){
			$scope.isaUserName = user;
		}else{
			$scope.agentUserName = user;
		}
		
		console.log("Getting user statistics for user: " + user + ". And for userType: " + userType + ". For date range from: " + startDate + " to: " + endDate);
		
		$.ajax({
		  method: "GET",
		  url: "REST.php",
		  data: {'data': user, 'type': userType, 'start': startDate, 'end': endDate},
		  success: function(data){
			  data = JSON.parse(data);
			  //console.dir(data);
			  if(userType == "isa"){
				  $scope.isaStatistics = data;
			  }else{
				  $scope.agentStatistics = data;
			  }
			  constructGraph(rightData, leftData, data, "line");
		  },
		  error: function(data){
			  console.log("failure");
			  console.log(data);
		  }
		});
	  }
  }
  
  $scope.changeDateRange = function(type){
	  var user = "", start = null, end = null;
	  if(type == "isa"){
		console.log("ISA Type");
	    user = $scope.isaUserName;
		start = $scope.isaDateRangeStart;
		end = $scope.isaDateRangeEnd;
	  }else{
		console.log("Agent Type");
		user = $scope.agentUserName;  
		start = $scope.agentDateRangeStart;
		end = $scope.agentDateRangeEnd;
	  }
	  
	  console.log("End: " + end + "//Start: " + start);
	  
	  $scope.getUserStatistics(user, null, null, type, start, end);  
  }
  
  function getStartDate(type){
	  var start = null;
	  if(type == "isa"){
		  start = $scope.isaDateRangeStart;
	  }else{
		  start = $scope.agentDateRangeStart;
	  }
	  
	  if(start){
		  return start;
	  }else{
		  return null;
	  }
  }
  
  function getEndDate(type){
	  var end = null;
	  if(type == "isa"){
		  end = $scope.isaDateRangeEnd;
	  }else{
		  end = $scope.agentDateRangeEnd;
	  }
	  
	  if(end){
		  return end;
	  }else{
		  return null;
	  }	  
  }
  
  function errorCheck(){
	  if(true){
		  console.log("Passed all the checks.");
		  //passes every check
		  return null;
	  }
	  console.log("failed to pass a check.");
	  return "Generic error - you failed to input everything.";
  }
  
  $scope.showAll = function(type){
	  $scope.getUserStatistics("all", "", "", type);
  }
    
  $scope.enterNewData = function(type){
	var errors = errorCheck();
	if(errors){
		console.log("Erroring out.");
		//failure - if truthy then the return contains errors
		$scope.growlError(type, errors);
	}else{
		console.log("Successful");
		//success - errors is not truthy. no errors
		$scope.growlSuccess(type);
	}
	  
	  
	$.ajax({
	  method: "POST",
	  url: "REST.php",
	  data: collateData(),
	  success: function(data){
		  $scope.getUserList();
	  },
	  error: function(data){
		  console.log("failure");
		  console.log(data);
	  }
	});
  }
  
  $scope.changeISAStatistics = function(leftData, rightData){
	  if(leftData && rightData){
		  $scope.isaLeftData = leftData;
		  $scope.isaRightData = leftData;
	  }else if(leftData && !rightData){
		  $scope.isaLeftData = leftData;
	  }else if(!leftData && rightData){
		  $scope.isaRightData = rightData;
	  }else{
	  }
	  //change $scope.statistics
	  constructGraph($scope.isaRightData, $scope.isaLeftData, $scope.isaStatistics, "line");	  
  }
  
  $scope.changeAgentStatistics = function(leftData, rightData){
	  if(leftData && rightData){
		  $scope.agentLeftData = leftData;
		  $scope.agentRightData = leftData;
	  }else if(leftData && !rightData){
		  $scope.agentLeftData = leftData;
	  }else if(!leftData && rightData){
		  $scope.agentRightData = rightData;
	  }else{
	  }
	  //change $scope.statistics
	  constructGraph($scope.agentRightData, $scope.agentLeftData, $scope.agentStatistics, "line");	 
  }
  
  
  function collateData(){//name, date, dials, contacts, nurtures, appointments){
	  var data = {};//{'data' : "NEW", 'name': name, 'date': encodeDate(date), 'dials': dials, 'contacts': contacts, 'nurtures': nurtures, 'appointments': appointments};
	  
	  if($scope.ISA){
		  data = {'data' : "NEW", 'type': "isa", 'name': $scope.ISAname, 'date': encodeDate($scope.ISAdate), 'dials': $scope.ISAdials, 'contacts': $scope.ISAcontacts, 'nurtures': $scope.ISAnurtures, 'listingAppointments': $scope.ISAlistingappointments, 'buyerAppointments': $scope.ISAbuyerappointments};
		  console.dir(data);
	  }else if($scope.agent){
		  data = {'data' : "NEW", 'type': "agent", 'name': $scope.name, 'date': encodeDate($scope.date), 'dials': $scope.dials, 'contacts': $scope.contacts, 'nurtures': $scope.nurtures, 'las': $scope.las, 'lah': $scope.lah, 'lt': $scope.lt, 'bas': $scope.bas, 'bah': $scope.bah, 'bbas': $scope.bbas, 'cw': $scope.cw, 'ca': $scope.ca};		  
	  }else{
		  console.log("Error: Tried to submit without a form selected");
	  }
	  
	  console.dir(data);
	  
	  return data;
  }
  
  function encodeDate(date){	  
	  return Date.parse(date);
  }
  
  function getDateFromMillis(millis){
	  
	  return new Date(parseInt(millis));
	  
  }
  
  function decodeDate(age){	  
	  var current = Date.now();	  
	  var millisInDay = 86400000;
	  
	  age = (current - age);
	  
	  return (age / millisInDay);
  }
  
  function updateGraphData(data, ratio_denominator, ratio_numerator){
	  
	  var denominator  = type_position(ratio_denominator);
	  var numerator = type_position(ratio_numerator);
	  
	  var originalDataPointLength = 0;
	  if(data.length > 0){
		originalDataPointLength = data[0].length;
	  }
	  
	  //var y_axis_values = [];
	  var dataPoints = [];

	  for(var i = 0; i < data.length; ++i){
		  var top = 1;
		  if(numerator >= 5){
			  top = count_names(data[i][numerator]);
		  }else{
			  top = data[i][numerator];
		  }
		  
		  var bottom = 1;
		  if(denominator >= 5){
			  bottom = count_names(data[i][denominator]);
		  }else{
			  bottom = data[i][denominator];
		  }
		  
		  data[i].push(top / bottom);
		  
		  //y_axis_values.push(top / bottom);
		  //y_axis_values.push(data[i][numerator] / data[i][denominator]);
	  }
	  //y_axis_values.sort();
	  
	  //var labels
	  console.dir(data);
	  
	  data.sort(compareSecondColumn);
	  
	  console.dir(data);
	  
	  for(var i = 0; i < data.length; ++i){
		  //dataPoints.push({x: decodeDate(data[i][1]), y: (Math.round(y_axis_values[i] * 100) / 100)});
		  //dataPoints.push({x: getDateFromMillis(data[i][1]), y: ((Math.round(y_axis_values[i] * 100) / 100)), 'meta': {'name': data[i][0], 'numerator': {'value': data[i][numerator], 'name': ratio_numerator}, 'denominator': {'value': data[i][denominator], 'name': ratio_denominator}}});
		  dataPoints.push({x: getDateFromMillis(data[i][1]), y: ((Math.round(data[i][originalDataPointLength] * 100) / 100)), 'meta': {'name': data[i][0], 'numerator': {'value': data[i][numerator], 'name': ratio_numerator}, 'denominator': {'value': data[i][denominator], 'name': ratio_denominator}}});
	  }
	  
	  //console.dir(dataPoints);	
	  
	  return dataPoints;
  }
  

    /**
	 * Thank you to user jahroy from StackOverflow.
	 *
	 * Solution available at
	 * http://stackoverflow.com/questions/16096872/how-to-sort-2-dimensional-array-by-column-value
	 *
	*/
	function compareSecondColumn(a, b) {
		if (a[1] === b[1]) {
			return 0;
		}
		else {
			return (a[1] < b[1]) ? -1 : 1;
		}
	}
  
  function type_position(type){
	  if($scope.userType == "isa"){
		  switch(type){
			  case "dials": return 2;
			  case "contacts": return 3;
			  case "nurtures": return 4;
			  case "listing appointments": return 5;
			  case "buyer appointments": return 6;
		  }
	  }else{
		  switch(type){
			  case "dials": return 2;
			  case "contacts": return 3;
			  case "nurtures": return 4;
			  case "listing appointments set": return 5;
			  case "Listing appointments held": return 6;
			  case "Listings taken": return 7;
			  case "Buyer appointments set": return 8;
			  case "Buyer appointments held": return 9;
			  case "Buyer Broker Agreement's Signed": return 10;
			  case "Contracts Written": return 11;
			  case "Contracts Accepted": return 12;
			  
		  } 
	  }
	  return -1;
  }
  
  function count_names(names){
	  //split on comma and count number of individual names
	  var splNames = names.split(",");
	  
	  var size = 1;
	  
	  size = splNames.length;
	  
	  return size;
  }
  
  function constructGraph(ratio_denominator, ratio_numerator, initial_data, type){
	var userName = "";
	if($scope.userType == "isa"){
		userName = $scope.isaUserName;
		if(userName == "all"){
			userName = "The Jesse Herfel Group";
		}
	}else{
		userName = $scope.agentUserName;
		if(userName == "all"){
			userName = "The Jesse Herfel Group";
		}
	}
	
	var title = {text: ratio_numerator + " per " + ratio_denominator + " for " + userName};
	var dataPoints = null;
	if(initial_data){
		dataPoints = updateGraphData(initial_data, ratio_denominator, ratio_numerator);
	}else{
		//dataPoints = $scope.getUserStatistics("all", "", "", $scope.userType);//dataPoints = $scope.defaultGraphData;
		console.log("Error: Chart Data not initialized properly!");
	}

	var data = [{
		'type' : type,
		'xValueType': "dateTime",
		'dataPoints': dataPoints
	}];
	
	var chart = new CanvasJS.Chart($scope.userType + "ChartContainer", {
		'title': title,
		'toolTip' :{   
			//'content': "Date: {x}<br>Success Percentage: {y}%",
			'contentFormatter': function (e) {
				return "Name: " + e.entries[0].dataPoint.meta.name + "<br>Date: " + e.entries[0].dataPoint.x + "<br>" + "Success Percentage: " + e.entries[0].dataPoint.y * 100 + "%<br>Number of " + e.entries[0].dataPoint.meta.numerator.name + ": " + e.entries[0].dataPoint.meta.numerator.value + "<br>Number of " + e.entries[0].dataPoint.meta.denominator.name + ": " + e.entries[0].dataPoint.meta.denominator.value;
			}
		},
	    'axisX' : {
			'title': "Date",
			'valueFormatString': "DD-MMM-YYYY",
			'gridThickness': 2
		},
		'axisY' : {
			'title': "Success Percentage",
			'valueFormatString': "##0%" //'percentFormatString': "#0.##"
		},
		'data': data
	});
	
	chart.render();
  }
  
}]);
})(window.angular);