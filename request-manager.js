RequestManager = function(){

	//TODO: input queue
}


RequestManager.prototype.makeRequest = function(requestObject){
	$.ajax(requestObject);
}

RequestObject = function(httpVerb, url, payload){
	this.url = url;
	if (payload)
		this.data = payload;
	this.type = httpVerb;
	this.mimeType = 'application/x-www-form-urlencoded; charset=UTF-8';
	this.crossDomain = 'true';
	this.xhrFields = {
		withCredentials:false//true
	};
	this.success = function(){
		alert('Ajax success');
	};
	this.error = function(){
		alert('Ajax error');
	}
}

SellPayload = function(appid, contextid, price, assetid){
	this.sessionid = getCookie('sessionid'); //TODO:
	this.currency = walletInfo['wallet_currency']; //TODO:
	this.appid = appid;
	this.contextid = contextid;
	this.amount = 1;
	this.price = price;
	this.assetid = assetid; 
}

BuyPayload = function(subtotal, fee, total){
	this.sessionid = getCookie('sessionid'); //TODO:
	this.currency = walletInfo['wallet_currency']; //TODO:
	this.subtotal = subtotal;
	this.fee = fee;
	this.total = total;
}

function getCookie(c_name) {
	var c_value = document.cookie;
	var c_start = c_value.indexOf(" " + c_name + "=");
	if (c_start == -1) {
		c_start = c_value.indexOf(c_name + "=");
	}
	if (c_start == -1) {
		c_value = null;
	} else {
		c_start = c_value.indexOf("=", c_start) + 1;
		var c_end = c_value.indexOf(";", c_start);
		if (c_end == -1) {
			c_end = c_value.length;
		}
		c_value = unescape(c_value.substring(c_start, c_end));
	}
	return c_value;
}

