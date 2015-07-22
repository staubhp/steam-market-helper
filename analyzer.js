Analyzer = function(){
	this.broker = new Broker();

}

Analyzer.prototype.analyze = function(product){
	var passedPercentageThreshold = product.result <= this.threshold;
	var passedProfitThreshold = product.diffPriceWithoutFee >= this.minDiff;

	//var balance = g_rgWalletInfo['wallet_balance'];
	//var hasMoney = balance >= product.minPrice;
	var hasMoney = true;

	var buy = passedPercentageThreshold && passedProfitThreshold && hasMoney;
	if (buy)
		broker.buy(product);

	return buy;
}

