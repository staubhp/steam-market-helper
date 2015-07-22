Queue = function (){
	this.q = [];
	this.intervalInSeconds = 3;
}

Queue.prototype.start = function(){
	var self = this;
	this.timer = setInterval(function(){
		self.dequeue();
	}, this.intervalInSeconds*1000);

}

Queue.prototype.enqueue = function(fn, args, minRateLimit, maxRateLimit){
	this.q.push({fn:fn, args:args, min:minRateLimit, max:maxRateLimit});
}

Queue.prototype.dequeue = function(){
	debugger;
	if (this.q.length == 0)
		return;

	var obj = this.q.shift();
	obj.min = obj.min || 0;
	obj.max = obj.max || 0;
	var wait = Math.floor(Math.random() * (obj.max - obj.min +1)) + obj.min;
	setTimeout(function(){obj.fn.apply(this, obj.args)}, wait*1000);
}



