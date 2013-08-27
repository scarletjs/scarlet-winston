var should = require('should');
var winston = require('winston');
var ScarletWinston = require("../lib/scarlet-winston");

var ObjectLiteral = require("./dummies/object-literal");
var NamedFunction = require("./dummies/named-function");
var UnnamedFunction = require("./dummies/unnamed-function");
var PrototypeFunction = require("./dummies/prototype-function");

describe('Given using a Scarlet Winston Logger',function(){

	var didAppend = false;
	var appendMessage = "";

	var MockWinston = function(){};
	MockWinston.prototype.log = function(type,message){
		didAppend = true; 
		appendMessage = message;
	};

	beforeEach(function() {
		didAppend = false;
		appendMessage = "";
	});

	describe('When logging a Prototype function',function(){
		var scarletWinston = new ScarletWinston();
		var mockWinston = new MockWinston();
		var LogPrototypeFunction = scarletWinston.logger(mockWinston).bindTo(PrototypeFunction);

		it("should return method results without modification",function(){
						
			var loggedInstance = new LogPrototypeFunction();
			var result = loggedInstance.methodWithReturn();
			result.should.be.eql("any");
		});
		it("should append to the logger",function(){
			var loggedInstance = new LogPrototypeFunction();
			var result = loggedInstance.methodWithReturn();
			didAppend.should.be.eql(true);
		});
	});

	describe('When logging a object literal',function(){

		var LogObjectLiteral = Object.create(ObjectLiteral);

		var scarletWinston = new ScarletWinston();
		var mockWinston = new MockWinston();		
		var LogPrototypeFunction = scarletWinston.logger(mockWinston).bindTo(LogObjectLiteral);

		it("should return method results without modification",function(){
						
			var result = LogObjectLiteral.methodWithReturn();
			result.should.be.eql("any");
		});
		it("should append to the logger",function(){
						
			var result = LogObjectLiteral.methodWithReturn();
			didAppend.should.be.eql(true);
		});
	});

	describe('When logging a named function',function(){
		var scarletWinston = new ScarletWinston();
		var mockWinston = new MockWinston();		
		var LogNamedFunction = scarletWinston.logger(mockWinston).bindTo(NamedFunction);

		it("should return method results without modification",function(){
			var loggedInstance = new LogNamedFunction();
			var result = loggedInstance.methodWithReturn();
			result.should.be.eql("any");
		});

		it("should append to the logger",function(){
			var loggedInstance = new LogNamedFunction();
			var result = loggedInstance.methodWithReturn();
			didAppend.should.be.eql(true);
		});
	});

	describe('When logging a named function',function(){
		var scarletWinston = new ScarletWinston();
		var mockWinston = new MockWinston();
		var LogUnnamedFunction = scarletWinston.logger(mockWinston)
												.bindTo(UnnamedFunction);

		it("should return method results without modification",function(){
			var loggedInstance = new LogUnnamedFunction();
			var result = loggedInstance.methodWithReturn();
			result.should.be.eql("any");
		});
		
		it("should append to the logger",function(){
			var loggedInstance = new LogUnnamedFunction();
			var result = loggedInstance.methodWithReturn();
			didAppend.should.be.eql(true);
		});
	});

});