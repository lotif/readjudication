var app = angular.module('readjudicationApp', []);
app.controller('readjudicationPageController', function($scope) {
	$scope.pageTitle = "Readjudication";

	$scope.merchantForm = {merchantId: "", nameOfAccount: ""};	

	$scope.merchants = [
		{_id:"55c8f0a894848ebfb9371ec1",merchantId:"295375177885",nameOfAccount:"Test 6 July 18"},
		{_id:"55c8f08694848ebfb9371ec0",merchantId:"295375177884",nameOfAccount:"Test 6 July 17"},
		{_id:"55c8f0ba94848ebfb9371ec2",merchantId:"295375178882",nameOfAccount:"JMeter Test 2014-06-16"}
	];
});