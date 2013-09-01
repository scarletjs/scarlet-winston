var should = require('should');
var Scarlet = require('scarlet');

var scarlet = new Scarlet("../lib/scarlet-winston");
var scarletWinston = scarlet.plugins.winston;

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
		var mockWinston = new MockWinston();
		scarletWinston.logger(mockWinston);
	});

	describe('When logging a Prototype function',function(){
		var LogPrototypeFunction = scarletWinston.bindTo(PrototypeFunction);

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
	
		var LogPrototypeFunction = scarletWinston.bindTo(LogObjectLiteral);

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

		var LogNamedFunction = scarletWinston.bindTo(NamedFunction);

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

		var LogUnnamedFunction = scarletWinston.bindTo(UnnamedFunction);

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