function MerchantSearchController() {
	
	this.searchUrl = "http://localhost:3000/merchantlist";
	
	this.merchants = [];
	
	this.filters = {merchantId: "", nameOfAccount: ""};
	
	this.callbackFunction;
	
	this.clearList = function() {
		this.merchants = [];
	}
	
	this.doSearch = function(merchantId, nameOfAccount, callbackFunction) {
	
		this.filters.merchantId = merchantId;
		this.filters.nameOfAccount = nameOfAccount;
		this.callbackFunction = callbackFunction;
		
		$.ajax({
			url: this.searchUrl,
			success: function(data){
				merchantSearchController.processSearchResults(data);
			},
			error: function() {
				merchantSearchController.processError("Error retrieving merchants from server. Please try again in a few minutes.");
			}
		});
		
	}
	
	this.processSearchResults = function(merchantsFromServer) {
		
		this.merchants = [];
		
		for(i in merchantsFromServer){
			
			var allowed = true;
			
			if(this.filters.merchantId && this.filters.merchantId != ""
				&& merchantsFromServer[i].merchantId.indexOf(this.filters.merchantId) < 0) {
				allowed = false;
			} 
			if(this.filters.nameOfAccount && this.filters.nameOfAccount != ""
				&& merchantsFromServer[i].nameOfAccount.indexOf(this.filters.nameOfAccount) < 0) {
				allowed = false;
			}
			
			if(allowed) {
				this.merchants.push(merchantsFromServer[i]);
			}
		}
		
		this.callbackFunction(this.merchants);
	}
	
	this.processError = function(errorMessage) {
		this.callbackFunction(null, errorMessage);
	}
	
}

function ReadjudicationController() {
	
	this.startReadjudicationUrl = "http://localhost:8080/OMS/rest/readjudication/start";
	
	this.callbackFunction;
	
	this.startReadjudication = function(merchantId, callbackFunction) {
		
		this.callbackFunction = callbackFunction;
		
		$.ajax({
			url: this.startReadjudicationUrl,
			method: "POST",
			data: '[{"merchantId": "' + merchantId + '", "message"":""}]',
			contentType: "application/json",
			success: function(data){
				readjudicationController.processResults(data);
			},
			error: function() {
				readjudicationController.processError("Error starting readjudication for merchantId '" + merchantId + "'. Please contact support.");
			}
		});
	}
	
	this.processResults = function(data) {
		this.callbackFunction(data);
	}
	
	this.processError = function(errorMessage) {
		this.callbackFunction(null, errorMessage);
	}
	
}

var merchantSearchController = new MerchantSearchController();
var readjudicationController = new ReadjudicationController();