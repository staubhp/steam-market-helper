Parser = function(){
	this.analyzer = new Analyzer();
	this.logger = new Logger();
	this.logger.name = "parserLog";
};

Parser.prototype.parseHtmlResultPage= function(htmlResultPage){
	this.logger.log("Parsing HTML search result page");
	htmlResultPage = htmlResultPage.replace(/src/g, "_src");
	var all = $(htmlResultPage);
	var links = all.find('div.market_listing_row');
	var listingURLs = [];
	$(links).each(function(index){
		var link = $(this).parent().attr('href');
		link = link.replace(/\?.*$/, '');
		listingURLs.push(link);
	});
	return listingURLs;
}

function decodeHTML(html){
	var txt = document.createElement("textarea");
	txt.innerHTML = html;
	return txt.value;
}

Parser.prototype.parseProduct = function(htmlProductPage, productURL, productName){
	this.logger.log("Parsing product '" + productName +"'");
	htmlProductPage = decodeHTML(htmlProductPage);
	htmlProductPage = htmlProductPage.replace(/src/g, "_src");
	var elements = $(htmlProductPage);
	var all = $('<div />');
	all.append(elements);	

	debugger;
	var listingSpans = $(all).find('.market_listing_row');
	var prices =[];
	var listings = [];
	listingSpans.each(function(index){
		var listing = createListing($(this));
		listings.push(listing);
		prices.push(listing.total_price);
	});

	var avgs = average(prices);
	var avg = avgs.mean;
	var myProduct = new Product();
	myProduct.listings = listings;
	myProduct.url = productURL;
	myProduct.avgPrice = Number(avg.toFixed(2));
	myProduct.minPrice = prices[0];
	myProduct.name = productName;
	myProduct.diffPrice = Number((avg - prices[0]).toFixed(2));
	myProduct.diffPriceWithoutFee = Number((this.diffPrice - (avg * 0.15)).toFixed(2));
	var result = this.minPrice / this.avgPrice;
	myProduct.result = Number(result.toFixed(2));
	myProduct.averages = avgs;

	console.log(myProduct);
	this.analyzer.analyze(myProduct);

	return myProduct;

	
	function createListing(listingSpan){
		var listing = {};
		listing.id = listingSpan.attr('id').replace(/listing_(.*)/, "$1");
		listing.assetid = listingSpan.find('a.item_market_action_button').attr('href').replace(/^.*'([^,]+)'\)$/, "$1");
		listing.total_price = extractValue($(listingSpan).find('.market_listing_price_with_fee'));
		listing.subtotal_price = extractValue($(listingSpan).find('.market_listing_price_without_fee'));
		listing.fee = Number((listing.total_price - listing.subtotal_price).toFixed(2));
		return listing;
	}

	function extractValue(span){
		var value = $(span).text();
		value = value.replace(/\s*.*(\d+[,\.]\d+)[^\d]*/m, "$1");
		value = value.replace(/,/, ".");
		return parseFloat(value);
	}

}
