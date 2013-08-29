var assert = require("assert");
var Scarlet = require("scarlet");
var winston = require('winston');

var scarlet = new Scarlet();

var ScarletWinston = module.exports = exports = function(logInterceptor){
	var self = this;
	
	self.winston = winston;
	winston.extend(self);
	scarlet.extend(self);
};

ScarletWinston.prototype.logger = function(logger){
	var self = this;

	assert(logger, "Scarlet-Winston::logger === null");

	self.winston = logger;
	return self;
};

ScarletWinston.prototype.bindTo = function(objectToLog, memberToLog){
	var self = this;

	if(!objectToLog)
		throw new Error("Object to bind must be defined");

	var interceptor = null;
	if(memberToLog)
		interceptor = self.intercept(objectToLog, memberToLog);
	else
		interceptor = self.intercept(objectToLog);

	return interceptor
					.on("before", function(invocation){self.beforeMethodCall(invocation);})
					.on("after", function(invocation){self.afterMethodCall(invocation);})
					.on("error", function(error){self.errorMethodCall(error);})
					.resolve();
};

ScarletWinston.prototype.errorMethodCall = function(error){
	var self = this;

	var time = new Date();
	var stack = new Error().stack;
	var message = "["+time+"] "+"error:"+error.message+" "+stack;
	self.winston.log("error",message);
};

ScarletWinston.prototype.beforeMethodCall = function(invocation){
	var self = this;

	var time = new Date();
	var message = "["+time+"] "+"calling - "+invocation.objectName+"::"+invocation.methodName+"("+formatArgs(invocation.args)+")";
	self.winston.log("info",message);
};

ScarletWinston.prototype.afterMethodCall = function(invocation){
	var self = this;

	var time = new Date();
	var message = "["+time+"] "+invocation.objectName+"::"+invocation.methodName+"("+formatArgs(invocation.args)+") - returned:"+JSON.stringify(invocation.result)+" - execution time("+getFormatedTimeSpan(invocation.executionStartDate,invocation.executionEndDate)+")";
	self.winston.log("info",message);
};

var formatArgs = function(args){
	var formattedArgs = "";

	var argsArray = Array.prototype.slice.call(args);
	for (var i = 0; i < argsArray.length; i++) {
		if(i > 0)
			formattedArgs += ",";

		formattedArgs += argsArray[i];
	}

	return formattedArgs;
};

var getFormatedTimeSpan = function(fromDateTime,toDateTime){
    var milliSecondDifference = Math.abs(fromDateTime-toDateTime);
    var secondsDifference = Math.round(milliSecondDifference/1000);
    var minutesDifference = Math.round(secondsDifference/60);
    var hourDifference = Math.round(minutesDifference/60);

    return hourDifference+":"+minutesDifference+":"+secondsDifference+"."+milliSecondDifference;
};