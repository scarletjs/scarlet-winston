var assert = require("assert");
var winston = require('winston');
var formatter = require("./extensions/formatter");

var ScarletWinston = module.exports = exports = function(scarlet){
	var self = this;
	
	self.winston = winston;
	winston.extend(self);

	self.initialize = function(){

		scarlet.plugins.winston = self;
		return self;
	};

	self.logger = function(logger){

		assert(logger, "ScarletWinston::logger === null");

		self.winston = logger;
		return self;
	};

	self.bindTo = function(objectToLog, memberToLog){

		assert(objectToLog, "Object to bind must be defined");

		var interceptor = null;
		if(memberToLog)
			interceptor = scarlet.intercept(objectToLog, memberToLog);
		else
			interceptor = scarlet.intercept(objectToLog);

		return interceptor
						.on("before", function(invocation){self.beforeMethodCall(invocation);})
						.on("after", function(invocation){self.afterMethodCall(invocation);})
						.on("error", function(error){self.errorMethodCall(error);})
						.resolve();
	};

	self.errorMethodCall = function(error){

		var time = new Date();
		var stack = new Error().stack;
		var message = "["+time+"] "+"error:"+error.message+" "+stack;
		self.winston.log("error",message);
	};

	self.beforeMethodCall = function(invocation){

		var time = new Date();
		var message = "["+time+"] "+"calling - "+invocation.objectName+"::"+invocation.methodName+"("+formatter.formatArgs(invocation.args)+")";
		self.winston.log("info",message);
	};

	self.afterMethodCall = function(invocation){

		var time = new Date();
		var message = "["+time+"] "+invocation.objectName+"::"+invocation.methodName+"("+formatter.formatArgs(invocation.args)+") - returned:"+JSON.stringify(invocation.result)+" - execution time("+formatter.getFormatedTimeSpan(invocation.executionStartDate,invocation.executionEndDate)+")";
		self.winston.log("info",message);
	};

};