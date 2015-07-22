Searcher = function(searchValue){
	//Searcher will iterate through pages of search results,
	//getting the HTML listing for each result and passing it to Parser
	var self = this;
	this.searchParams ={
		pageSize : 100
	}
	this.parser = new Parser();
	this.searchValue = searchValue || 'trading card';
	this.searching = false;
	this.searchURL = 'http://steamcommunity.com/market/search/render';

	this.requestManager = new RequestManager(); //TODO
	this.requestManager.minRateLimit = 1;
	this.requestManager.maxRateLimit = 5;

	this.logger = new Logger();
	this.logger.name = "searchLog";

	this.debug = true;
}


Searcher.prototype.search = function(pageNumber){
	var self = this;
	this.logger.log("Searching. Debug = " + this.debug);
	this.searching = true;
	var start = 0;
	if (pageNumber) {
		start = pageNumber * this.searchParams.pageSize;
	} else {
		//new search
	}
	var queryURL = this.searchURL + '?count=' + this.searchParams.pageSize + '&start=' + start + '&query=' + encodeURIComponent(this.searchValue);

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
				requestObj.searcher.logger.log("Getting page " + i + " of " + pages);
				this.searcher.search(i);
			}
		}	
		this.searcher.searching = false;
		var productURLs = this.parser.parseHtmlResultPage(data.results_html);
		$(productURLs).each(function(index,productURL){
			self.getProduct(productURL);
		});
	};
	requestObj.error = function(err){
		console.info(err);
		this.searcher.searching = false;

	};

	if (self.debug){
		var data = $('#searchData').text();
		requestObj.success(data);
	}else{
		this.requestManager.makeRequest(requestObj);
	}
}

Searcher.prototype.getProduct = function(productURL){
	var self = this;
	var queryURL = productURL + '?cc=us'; //+ '/render/?query=&start=0&count=10';
	var requestObj = new RequestObject('GET', queryURL);
	requestObj.error = function(err){
		console.info(err);
	}
	requestObj.success = function(data){
		var name = decodeURIComponent(productURL.substring(productURL.lastIndexOf('/') + 1)); 
		self.logger.log('Getting product <a href="' + productURL + '">' + name + '</a>');
		self.parser.parseProduct(data, productURL, name);
		//All done at this point. Parser will hand it over to analyzer
	}

	if(self.debug){
		var data = $('#productData').text();
		requestObj.success(data);
	}
	else{
		this.requestManager.makeRequest(requestObj);
	}
}

