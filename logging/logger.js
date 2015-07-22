Logger = function(){
	this.name = "Default";
}

Logger.prototype.log = function(message){
	var date = new Date();
	var timeStamp = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
	var fullMessage = timeStamp + ' (' + this.name + ') - ' + message;
	var partialMessage = timeStamp + ' ' + message;
	console.log(fullMessage);


	var ul = $("#" + this.name );
	if (ul){
		var li = $("<li>" + partialMessage + "</li>");
		ul.prepend(li);
		ul.fadeIn(100).fadeOut(100).fadeIn(100);
	}
	
}
