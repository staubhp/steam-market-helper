Parser = function(){
};

Parser.prototype.parseHtmlResultPage= function(htmlResultPage){
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
