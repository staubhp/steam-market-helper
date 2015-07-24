Queue = function (name){
	this.q = [];
	this.intervalInSeconds = 3;
	this.name = name || "DefaultQueue"; 
	this.logger = new Logger();
	this.logger.name = this.name + 'Logger';
}

Queue.prototype.start = function(){
	var self = this;
	this.logger.log("Started queue '" + this.name + "'");
	this.timer = setInterval(function(){
		self.dequeue();
	}, this.intervalInSeconds*1000);
}

Queue.prototype.enqueue = function(fn, args, minRateLimit, maxRateLimit){
	this.q.push({fn:fn, args:args, min:minRateLimit, max:maxRateLimit});
	this.logger.log("Enqueued " + fn +". Min RL = " + minRateLimit + " Max RL = " + maxRateLimit);
}

Queue.prototype.dequeue = function(){
	this.logger.log("Deq");
	if (this.q.length == 0)
		return;

	var obj = this.q.shift();

	obj.min = obj.min || 0;
	obj.max = obj.max || 0;
	var wait = Math.floor(Math.random() * (obj.max - obj.min +1)) + obj.min;
	this.logger.log("Dequeued " + obj.fn +". Waiting " + wait + " seconds to execute");
	setTimeout(function(){obj.fn.apply(this, obj.args)}, wait*1000);
}



