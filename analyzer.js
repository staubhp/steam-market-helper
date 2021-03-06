Analyzer = function(){
	this.broker = new Broker();
	this.logger = new Logger();
	this.logger.name = "analyzerLog";
	this.threshold = 0.66;
	this.minDiff = 0.1;
}

var buySignals = 0;
var analyzedCount = 0;

Analyzer.prototype.analyze = function(product){
	debugger;
	var passedPercentageThreshold = product.result <= this.threshold;
	var passedProfitThreshold = product.diffPriceWithoutFee >= this.minDiff;

	this.logger.log("Analyzing '" + product.name + "', AvgP: " + product.avgPrice +", DiffP: " + product.diffPrice + ", Result: " + product.result); 

	//var balance = g_rgWalletInfo['wallet_balance'];
	//var hasMoney = balance >= product.minPrice;
	var hasMoney = true;

	var buy = passedPercentageThreshold && passedProfitThreshold && hasMoney;
	if (buy){
		buySignals += 1;
		this.logger.log("Buy signal on product '" + product.name +"'");
		this.broker.buy(product);
	}else{
		this.logger.log("Passing on product '" + product.name +"'");
	}

	analyzedCount += 1;
	$('#buySignals').text(buySignals);
	$('#analyzedCount').text(analyzedCount);

	return buy;
}

