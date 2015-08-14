var PageTitle = React.createClass({
    render: function() {
		return (<h1 className="container-fluid page-header">{this.props.pageTitle}</h1>);
    }
});

var MerchantSearchForm = React.createClass({
	handleChange: function() {
		console.log(this.props);
		this.props.onUserInput(
			this.refs.merchantIdInput.getDOMNode().value,
			this.refs.nameOfAccountInput.getDOMNode().value
		);
	},
	render: function() {
		return (
			<div className="container" id="container">
				<form className="panel panel-primary" role="form">
				
					<div className="panel-heading">
						<h4>Merchant Search Filter</h4>
					</div>
					
					<div className="panel-body">
						<div className="col-sm-3">
							<label>Merchant ID</label>
							<input type="text" className="form-control" value={this.props.merchantInput.merchantId} ref="merchantIdInput" onChange={this.handleChange}/>
						</div>
						<div className="col-sm-6">
							<label>Name Of Account</label>
							<input type="text" className="form-control" value={this.props.merchantInput.nameOfAccount} ref="nameOfAccountInput" onChange={this.handleChange}/>
						</div>
						
						<div className="col-sm-12">
							<br/>
							<input type="submit" value="search" className="btn btn-primary"/>
							<input type="submit" value="reset" className="btn btn-primary"/>
						</div>
					</div>
				</form>
			</div>
		);
	}
});

var MerchantSearchResults = React.createClass({
	render: function() {
		var rows = [];
		
		for(i in this.props.merchants){
			var allowed = true;
			
			if(this.props.merchantInput.merchantId && this.props.merchantInput.merchantId != ""
				&& this.props.merchants[i].merchantId.indexOf(this.props.merchantInput.merchantId) < 0) {
				allowed = false;
			} 
			if(this.props.merchantInput.nameOfAccount && this.props.merchantInput.nameOfAccount != ""
				&& this.props.merchants[i].nameOfAccount.indexOf(this.props.merchantInput.nameOfAccount) < 0) {
				allowed = false;
			}

			if(allowed) {
				rows.push(<MerchantSearchResultsRow merchant={this.props.merchants[i]} />);
			}
		}
		
		return (
			<div className="container-fluid">
				<table className="table table-striped table-hover">
					<th>Readjudication</th>
					<th>Merchant ID</th>
					<th>Name Of Account</th>
					<tbody>{rows}</tbody>
				</table>
			</div>
		);
	}
});

var MerchantSearchResultsRow = React.createClass({
	render: function() {
		return (
			<tr>
				<td><StartReadjudicationButton merchantId={this.props.merchant.merchantId} /></td>
				<td>{this.props.merchant.merchantId}</td>
				<td>{this.props.merchant.nameOfAccount}</td>
			</tr>
		);
	
	}
});

var StartReadjudicationButton = React.createClass({
	render: function() {
		return (
			<div>
				<input type="hidden" value={this.props.merchantId} />
				<input type="submit" value="start" className="btn btn-primary btn-sm" />
			</div>
		);
	}
});

var ReadjudicationPage = React.createClass({
	getInitialState: function(){
		return {
			merchantInput: { merchantId: "", nameOfAccount: "" },
			merchants: this.props.merchants
		};
	},
	handleUserInput: function(merchantIdValue, nameOfAccountValue) {
        this.setState({
            merchantInput: { merchantId: merchantIdValue, nameOfAccount: nameOfAccountValue }
        });
    },
	render: function() {
		return(
			<div id="pageContainer">
				<PageTitle 
					pageTitle="Readjudication" 
				/>
				<MerchantSearchForm 
					merchantInput={this.state.merchantInput} 
					onUserInput={this.handleUserInput}
				/>
				<MerchantSearchResults 
					merchants={this.state.merchants} 
					merchantInput={this.state.merchantInput} 
				/>
			</div>
		);
	}
});

var merchantsFromServer = [
	{merchantId: "295375177884", nameOfAccount: "Test 6 July 17" },
	{merchantId: "295375179880", nameOfAccount: "Test 2 July 18" },
	{merchantId: "295375178882", nameOfAccount: "JMeter Test 2014-06-16" }
];

React.render(
	<ReadjudicationPage merchants={merchantsFromServer}/>, 
	document.getElementById('reactTarget')
);