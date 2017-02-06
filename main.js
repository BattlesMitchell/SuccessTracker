(function(angular){
	'use strict';
var app = angular.module('success_tracker', ['ngMessages', 'angular-growl']);

app.config(['growlProvider', function (growlProvider) {
  growlProvider.globalTimeToLive(3000);
}]);

app.controller('STController', ['$window', '$scope', 'growl', function($window, $scope, growl) {
  $scope.input = false;
  $scope.statistics = true;
  $scope.failTruthy = "";
  $scope.userList = [];
  $scope.leftDataList = ["dials", "contacts", "nurtures", "appointments"];
  $scope.rightDataList = ["dials", "contacts", "nurtures", "appointments"];
  $scope.statistics = [];
  $scope.errors = {"appointments" : ["required", "minlength", "maxlength"]};
  $scope.defaultGraphData = [
				{ x: 30,  y: 5.2 },
				{ x: 20, y: 3.4 },
				{ x: 10, y: 4.6 },
				{ x: 5,  y: 9.1 },
				{ x: 1,  y: 1.3 }
			];
  
  $scope.load = function(){
	  console.log("starting");
	$scope.getUserList();
	constructGraph("dials", "appointments", null, "line");
  }
  
  $scope.growlTest = function(){
	  console.log("Growling");
	  var config = {};
	  growl.success("<b>I'm</b> a success message", config);
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
  
  $scope.userName = "The Jesse Herfel Real Estate Group";
  $scope.count = 0;
  
  $scope.updateUserName = function(){
	console.log("updating username");
	$scope.userName = "in progress";  
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
  
  $scope.rightData = "dials";
  $scope.leftData = "appointments";
  
  $scope.getUserList = function(){
	//clean out the list of users and repopulate.
	$scope.userList = [];
	
	$.ajax({
	  method: "GET",
	  url: "REST.php",
	  data: {'data': "LIST"},
	  success: function(data){
		  data = JSON.parse(data);
		  var append_target = $("#available_users");
		  for(var i = 0; i < data.length; ++i){
			  $scope.userList.push(data[i].name);
		  }
		  $scope.$apply();
	  },
	  error: function(data){
		  console.log("failure");
		  console.log(data);
	  }
	});
  }
  
  $scope.getUserStatistics = function(user, rightData, leftData){
	  if(!rightData){
		  rightData = $scope.rightData;
	  }
	  
	  if(!leftData){
		  leftData = $scope.leftData;
	  }
	  
	  if(user){
		$scope.userName = user;
		if(user == "all"){
			$scope.userName = "The Jesse Herfel Group";
		}
		$.ajax({
		  method: "GET",
		  url: "REST.php",
		  data: {'data': user},
		  success: function(data){
			  data = JSON.parse(data);
			  $scope.statistics = data;
			  constructGraph(rightData, leftData, data, "line");
		  },
		  error: function(data){
			  console.log("failure");
			  console.log(data);
		  }
		});
	  }
  }
  
  $scope.showAll = function(){
	  $scope.getUserStatistics("all");
  }
    
  $scope.enterNewData = function(){
	$.ajax({
	  method: "POST",
	  url: "REST.php",
	  data: collateData($scope.name, $scope.date, $scope.dials, $scope.contacts, $scope.nurtures, $scope.appointments),
	  success: function(data){
		  $scope.getUserList();
	  },
	  error: function(data){
		  console.log("failure");
		  console.log(data);
	  }
	});
  }
  
  $scope.changeGatheredStatistics = function(leftData, rightData){
	  
	  //console.log("Changing Gathered User Statistics...");
	  //console.log("Left: ::" + leftData + ":: . Right: " + rightData);
	  
/* 	  if(!leftData){
		  console.log("Left data is null");
	  } */
	  
	  if(leftData && rightData){
		  //change both sides
		  //console.log("Changing Both Sides");
		  
		  $scope.leftData = leftData;
		  $scope.rightData = leftData;
	  }else if(leftData && !rightData){
		  //console.log("Changing Left Side");
		  
		  $scope.leftData = leftData;
		  //change only the left side
	  }else if(!leftData && rightData){
		  //console.log("Changing Right Side");
		  
		  $scope.rightData = rightData;
		  //change only the right side
	  }else{
		  //console.log("Changing nothing");
		  //both non-truthy
		  //do nothing
	  }
	  //$scope.getUserStatistics($scope.userName, $scope.leftData, $scope.rightData);
	  constructGraph($scope.rightData, $scope.leftData, $scope.statistics, "line");
  }
  
  function collateData(name, date, dials, contacts, nurtures, appointments){
	  var data = {'data' : "NEW", 'name': name, 'date': encodeDate(date), 'dials': dials, 'contacts': contacts, 'nurtures': nurtures, 'appointments': appointments};
	  return data;
  }
  
  function encodeDate(date){	  
	  return Date.parse(date);
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
	  
	  var y_axis_values = [];
	  var dataPoints = [];
	  
	/*{ label: "< 1 day",  y: 10  },
	{ label: "1 < 2 days", y: 15  }, */
	  for(var i = 0; i < data.length; ++i){
		  y_axis_values.push(data[i][numerator] / data[i][denominator]);
	  }
	  y_axis_values.sort();
	  
	  for(var i = 0; i < y_axis_values.length; ++i){
		  dataPoints.push({x: decodeDate(data[i][1]), y: (Math.round(y_axis_values[i] * 100) / 100)});
	  }
	  
	  return dataPoints;
  }
  
  function type_position(type){
	  switch(type){
		  case "dials": return 2;
		  case "contacts": return 3;
		  case "nurtures": return 4;
		  case "appointments": return 5;
	  }
	  return -1;
  }
  
  function constructGraph(ratio_denominator, ratio_numerator, initial_data, type){
	var title = {text: ratio_numerator + " per " + ratio_denominator + " for " + $scope.userName};
	var dataPoints = null;
	if(initial_data){
		dataPoints = updateGraphData(initial_data, ratio_denominator, ratio_numerator);
	}else{
		dataPoints = $scope.defaultGraphData;
	}

	var data = [{
		'type' : type,
		'dataPoints': dataPoints
	}];
	  
	var chart = new CanvasJS.Chart("chartContainer", {
		'title': title,
		'data': data
	});
	chart.render();
  }
  
}]);
})(window.angular);