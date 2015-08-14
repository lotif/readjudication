var app = angular.module('readjudicationApp', []);

app.controller('readjudicationPageController', function($scope, $http) {
	window.scope = $scope;
	
	$scope.pageTitle = "Readjudication";

	$scope.merchantFormMaster = {merchantId: "", nameOfAccount: ""};
	
	$scope.messages = {
		current: "", 
		empty: "Your search returned no results. Please change the search terms and try again.",
		readjudicationSuccessful: "A eadjudication task has been created for merchant '{0}' in the main workbasket.",
		ajaxError: "Error retrieving merchants from server. Please try again in a few minutes.",
		startReadjudicationError: "Error starting readjudication for merchantId '{0}'. Please contact support.",
		isError: false,
		clear: function() {
			$scope.messages.current = "";
			$scope.messages.isError = false;
		}
	};
	
	$scope.merchantForm = angular.copy($scope.merchantFormMaster);
	
	$scope.viewControlVariables = { showLoading: false, allowMessage: false };
	
	$scope.disableReset = function() {
		return ($scope.merchantForm.merchantId == null || $scope.merchantForm.merchantId == undefined || $scope.merchantForm.merchantId == "")&& 
			   ($scope.merchantForm.nameOfAccount == null || $scope.merchantForm.nameOfAccount == undefined || $scope.merchantForm.nameOfAccount == "");
	};
	
	$scope.resetAction = function() {
		$scope.merchantForm = angular.copy($scope.merchantFormMaster);	
		$scope.merchants = [];
		$scope.viewControlVariables.allowMessage = false;
		$scope.messages.clear();
	};
	
	$scope.submitSearchAction = function() {
		
		$scope.merchants = [];
		$scope.messages.clear();
		$scope.viewControlVariables.showLoading = true;
		$scope.viewControlVariables.allowMessage = true;
		
		$http.get("http://localhost:3000/merchantlist")
			.then(function(response) {			
				for(i in response.data){			
					var allowed = true;
					
					var lowercaseTerm1 = angular.lowercase(response.data[i].merchantId);
					var lowercaseTerm2 = angular.lowercase($scope.merchantForm.merchantId);
					
					if($scope.merchantForm.merchantId && $scope.merchantForm.merchantId != ""
						&& lowercaseTerm1.indexOf(lowercaseTerm2) < 0) {
						allowed = false;
					} 
					
					var lowercaseTerm1 = angular.lowercase(response.data[i].nameOfAccount);
					var lowercaseTerm2 = angular.lowercase($scope.merchantForm.nameOfAccount);
					
					if($scope.merchantForm.nameOfAccount && $scope.merchantForm.nameOfAccount != ""
						&&lowercaseTerm1.indexOf(lowercaseTerm2) < 0) {
						allowed = false;
					}
					
					if(allowed) {
						$scope.merchants.push(response.data[i]);
					}
				}
				
				$scope.viewControlVariables.showLoading = false;
				
				if($scope.merchants && $scope.merchants.length == 0) {
					$scope.messages.current = scope.messages.empty;
				}
				
			}, function(response) {
				$scope.messages.current = scope.messages.ajaxError;
				$scope.messages.isError = true;
				$scope.viewControlVariables.showLoading = false;
			}
		);
	};
	
	$scope.startReadjudicationAction = function(mId) {
		
		$scope.messages.clear();
		$scope.viewControlVariables.showLoading = false;
		$scope.viewControlVariables.allowMessage = true;
		
		$http.post("http://localhost:8080/OMS/rest/readjudication/start", { merchantId: mId, message: "" })
			.then(function(response) {	
				$scope.messages.current = scope.messages.readjudicationSuccessful.replace('{0}', mId);
				$scope.messages.isError = false;
				$scope.viewControlVariables.showLoading = false;
			}, function(response) {
				$scope.messages.current = scope.messages.startReadjudicationError.replace('{0}', mId);
				$scope.messages.isError = true;
				$scope.viewControlVariables.showLoading = false;
			}
		);
	};
	
})
.directive('merchantIdInput', function () {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs, ngModel) {
            if (!ngModel) return;
            ngModel.$parsers.unshift(function (inputValue) {
                var digits = inputValue.split('').filter(function (s) { return (!isNaN(s) && s != ' '); }).join('');
				digits = digits.length > 12 ? digits.substr(0, 12) : digits;
                ngModel.$viewValue = digits;
                ngModel.$render();
                return digits;
            });
        }
    };
});