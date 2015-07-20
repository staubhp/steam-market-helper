Searcher = function(searchValue){
	//Searcher will iterate through pages of search results,
	//getting the HTML listing for each result and passing it to Parser
	this.searchParams ={
		pageSize : 100
	}
	this.parser = new Parser();
	this.searchValue = searchValue || 'trading card';
	this.searching = false;
	this.searchURL = 'http://steamcommunity.com/market/search/render';

	this.requestManager = new RequestManager(); //TODO
	var self = this;

	this.requestManager.searchResultCallback(function(htmlResultPage){
		this.parser.parseResultPage(htmlResultPage);
	});
	
	this.requestManager.listingCallback(function(htmlListing){
		this.parser.parseListing(htmlListing);
	});

	
	//TODO: time limits, debug mode
}

Searcher.prototype.search = function(htmlResultPage){
	var self = this;
	this.searching = true;
	var start = 0;
	if (htmlResultPage) {
		start = page * this.searchParams.pageSize;
	} else {
		//new search
	}
	var queryURL = this.searchURL + '?count=' + this.searchParams.pageSize + '&start=' + start + '&query=' = encodeURIComponent(this.searchValue);

	//TODO:
	var requestObj = new RequestObject('GET');
	requestObj.success = function(){};
	requestObj.fail = function(){};
	this.requestManager.makeRequest(requestObj);
}
