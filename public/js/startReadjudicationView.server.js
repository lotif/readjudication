var PageTitle = React.createClass({
    
	propTypes: {
		pageTitle: React.PropTypes.string
	},
	
	render: function() {
		return (<h1 className="container-fluid page-header">{this.props.pageTitle}</h1>);
    }
});

var MerchantSearchForm = React.createClass({
	
	propTypes: {
		onSubmit: React.PropTypes.func,
		onReset: React.PropTypes.func
	},
	
	handleSubmit: function(e) {
		e.preventDefault();
		this.props.onSubmit(
			this.refs.merchantIdInput.getDOMNode().value,
			this.refs.nameOfAccountInput.getDOMNode().value
		);
		
	},
	
	handleReset: function(e) {
		e.preventDefault();
		this.props.onReset(this.refs.merchantIdInput, this.refs.nameOfAccountInput);
	},
	
	render: function() {
	
		var searchBtnStyle = { marginRight: '10px' };
		
		return (
			<div className="container" id="container">
				<form className="panel panel-primary" role="form" onSubmit={this.handleSubmit}>
				
					<div className="panel-heading">
						<h4>Merchant Search Filter</h4>
					</div>
					
					<div className="panel-body">
						<div className="col-sm-3">
							<label>Merchant ID</label>
							<input type="text" className="form-control" ref="merchantIdInput" />
						</div>
						<div className="col-sm-6">
							<label>Name Of Account</label>
							<input type="text" className="form-control" ref="nameOfAccountInput" />
						</div>
						
						<div className="col-sm-12">
							<br/>
							<input type="submit" value="search" className="btn btn-primary" style={searchBtnStyle}/>
							<input type="submit" value="reset" className="btn btn-primary" onClick={this.handleReset} />
						</div>
					</div>
				</form>
			</div>
		);
	}
});

var merchantSearchResultsProps;

var MerchantSearchResults = React.createClass({
	
	propTypes: {
		merchants: React.PropTypes.array,
		hideTable: React.PropTypes.bool,
		onStartReadjudication: React.PropTypes.func
	},
	
	render: function() {
		
		merchantSearchResultsProps = this.props;
		
		this.props.merchants = this.props.merchants ? this.props.merchants : [];
		
		var isEmpty = this.props.merchants.length == 0;
		var hide = this.props.hideTable || isEmpty;
		
		var cx = React.addons.classSet;
		var classesTable = cx({
			"show": !hide,
			"hide": hide,
			"container-fluid": true
		});
		
		return (
			<div className={classesTable}>
				<table className="table table-striped table-hover">
					<th>Readjudication</th>
					<th>Merchant ID</th>
					<th>Name Of Account</th>
					<tbody>
						{this.props.merchants.map(function(merchant, i){
							return(
								<MerchantSearchResultsRow 
									merchant={merchant} 
									onStartReadjudication={merchantSearchResultsProps.onStartReadjudication} 
								/>
							);
						})}
					</tbody>
				</table>
			</div>
		);
	}
});

var MerchantSearchResultsMessage = React.createClass({
	
	propTypes: {
		resultSize: React.PropTypes.number,
		errorMessage: React.PropTypes.string,
		emptyMessage: React.PropTypes.string,
		allowMessage: React.PropTypes.bool
	},
	
	render: function() {
		
		var isEmpty = this.props.resultSize == 0;
		var isError = this.props.errorMessage != null && this.props.errorMessage != undefined && this.props.errorMessage != "";
		
		var message;
		var messageStyle;
		if(isError) {
			message = this.props.errorMessage;
			messageStyle = { color: 'red' };
		} else if(isEmpty) {
			message = this.props.emptyMessage;
		}
		
		var showMessage = (isError || isEmpty) && this.props.allowMessage
		
		var cx = React.addons.classSet;
		var classes = cx({
			"show": showMessage,
			"hide": !showMessage,
			"text-center": true
		});
		
		return(
			<h3 className={classes}  style={messageStyle}>{message}</h3>
		);
	}
});

var MerchantSearchResultsLoading = React.createClass({
	
	propTypes: {
		showLoading: React.PropTypes.bool
	},
	
	render: function() {
		var cx = React.addons.classSet;
		var classes = cx({
			"show": this.props.showLoading,
			"hide": !this.props.showLoading,
			"center-block": true
		});
		return(
			<img className={classes} src="images/loading.gif" />
		);
	}
});

var MerchantSearchResultsRow = React.createClass({
	
	propTypes: {
		merchantId: React.PropTypes.string,
		nameOfAccount: React.PropTypes.string,
		onStartReadjudication: React.PropTypes.func
	},
	
	render: function() {
		return (
			<tr>
				<td>
					<StartReadjudicationButton 
						merchantId={this.props.merchant.merchantId} 
						onStartReadjudication={this.props.onStartReadjudication}
					/>
				</td>
				<td>{this.props.merchant.merchantId}</td>
				<td>{this.props.merchant.nameOfAccount}</td>
			</tr>
		);
	
	}
});

var StartReadjudicationButton = React.createClass({
	
	propTypes: {
		merchantId: React.PropTypes.string,
		onStartReadjudication: React.PropTypes.func
	},
	
	handleStartReadjudication: function(e) {
		e.preventDefault();
		this.props.onStartReadjudication(
			this.refs.merchantIdHidden.getDOMNode().value
		);
	},
	
	render: function() {
		return (
			<div>
				<input type="hidden" value={this.props.merchantId} ref="merchantIdHidden" />
				<input type="submit" value="start" className="btn btn-primary btn-sm" onClick={this.handleStartReadjudication}/>
			</div>
		);
	}
});

//stateful component
var ReadjudicationPage = React.createClass({	

	getInitialState: function(){
		return { 
			merchants: [],
			showLoading: false,
			allowMessage: false,
			emptyMessage: "Your search returned no results. Please change the search terms and try again.",
			errorMessage: ""
		};
	},
	
	handleSubmit: function(merchantId, nameOfAccount) {
		this.setState({ 
			showLoading: true,
			allowMessage: false
		});
		merchantSearchController.doSearch(merchantId, nameOfAccount, this.submitCallback);	
	},
	
	submitCallback: function(merchants, errorMessage) {	
		this.setState({
            merchants: merchants,
			allowMessage: true,
			showLoading: false,
			errorMessage: errorMessage
		});
	},
	
	handleReset: function(merchantIdInputRef, nameOfAccountInputRef) {
		merchantIdInputRef.getDOMNode().value = "";
		nameOfAccountInputRef.getDOMNode().value = "";
		this.setState({
            merchants: [],
			allowMessage: false
		});
	},
	
	handleStartReadjudication: function(merchantId) {
		readjudicationController.startReadjudication(merchantId, this.startReadjudicationCallback);
	},
	
	startReadjudicationCallback: function(data, errorMessage) {
		if(!errorMessage) {
			alert(data);
		} else {			
			this.setState({
				allowMessage: true,
				showLoading: false,
				errorMessage: errorMessage
			});
		}
	},
	
	render: function() {
		return(
			<div id="pageContainer">
				<PageTitle 
					pageTitle="Readjudication" 
				/>
				<MerchantSearchForm 
					onSubmit={this.handleSubmit} 
					onReset={this.handleReset}
				/>
				<MerchantSearchResultsMessage 
					allowMessage={this.state.allowMessage} 
					resultSize={this.state.merchants ? this.state.merchants.length : 0} 
					emptyMessage={this.state.emptyMessage} 
					errorMessage={this.state.errorMessage} 
				/>
				<MerchantSearchResults 
					merchants={this.state.merchants}
					hideTable={this.state.showLoading}
					onStartReadjudication={this.handleStartReadjudication}
				/>
				<MerchantSearchResultsLoading 
					showLoading={this.state.showLoading}
				/>
			</div>
		);
	}
});

React.render(
	<ReadjudicationPage />, 
	document.getElementById('reactTarget')
);