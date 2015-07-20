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
	this.debug = true;

	this.requestManager = new RequestManager(); //TODO
	var self = this;
	
	//TODO: time limits, debug mode
}

Searcher.prototype.getListing = function(productName){
	var self = this;
	var queryURL = productName + '/render/?query=&start=0&count=10';
	var requestObj = new RequestObject('GET', queryURL);
	requestObj.error = function(err){
		console.info(err);
	}
	requestObj.success = function(data){
		self.parser.parseListing(productName, data);
	}
	this.requestManager.makeRequest(requestObj);
}

Searcher.prototype.search = function(pageNumber){
	var self = this;
	this.searching = true;
	var start = 0;
	if (pageNumber) {
		start = pageNumber * this.searchParams.pageSize;
	} else {
		//new search
	}
	var queryURL = this.searchURL + '?count=' + this.searchParams.pageSize + '&start=' + start + '&query=' + encodeURIComponent(this.searchValue);

	debugger;
	var requestObj = new RequestObject('GET', queryURL);
	requestObj.searcher = self;
	requestObj.parser = self.parser; //TODO:
	requestObj.success = function(data){
		data = JSON.parse(data);
		if (start == 0){
			var pages = (data.total_count / this.searcher.searchParams.pageSize);
			if (self.debug)
				pages=1;
			for (var i = 1; i <= pages; i++){
				this.searcher.search(i);
			}
		}	
		this.searcher.searching = false;
		var listingURLs = this.parser.parseHtmlResultPage(data.results_html);
		$(listingURLs).each(function(listingURL){
			self.getListing(listingURL);
		});
	};
	requestObj.error = function(err){
		console.info(err);
		this.searcher.searching = false;

	};
	debugger;
	if (self.debug){
		var data = $('#searchData').text();
		requestObj.success(data);
	}else{
		this.requestManager.makeRequest(requestObj);
	}
}


