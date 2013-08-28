scarlet-winston
===============

A Winston Logger Using Method And Property Event Intercetion


[![Build Status](https://travis-ci.org/scarletjs/scarlet-winston.png?branch=master)](https://travis-ci.org/scarletjs/scarlet-winston)

##Install

`npm install scarlet-winston`

##Start logging

```javascript
var scarletWinston = require('scarlet-winston');

//Define a function to log
function FunctionToLog(){
  this.logMe = function(){ scarletWinston.info("In logMe"); }
};
var functionToLogInstance = new FunctionToLog();

//Attach Logger to object
scarletWinston.bindTo(functionToLogInstance);

//Now use intercepted object with logging!
functionToLogInstance.logMe();
//->info: [Tue Aug 27 2013 23:51:16 GMT+0100 (BST)]calling - FunctionToLog::logMe()
//->info: In logMe
//->info: [Tue Aug 27 2013 23:51:16 GMT+0100 (BST)]FunctionToLog::logMe() - returned:undefined - execution time(0:0:0.1)
```

## Motvation

Scarlet-Winston was created to allow applications to get the benefits of event based interception using [scarlet](https://github.com/scarletjs/scarlet) and robust full featured logging using [winston](https://github.com/flatiron/winston).

The project uses Scarlets event based interception, this allows the interception to be asynchronous and not to effect the application.  Scarlet emits an event *before* a method is called and *after* a method is called.  Scarlet-Winston listens for these events and uses winston to log the events.

## How do I Configure Winston?

You can easily override the default winston implementation by passing the custom configured winston logger to scarlet-winston as follows:

```javascript
scarletWinston.logger(myCustomWinstonLogger).bindTo(functionToLog);
```

Also, scarletWinston extends winston so has all its methods, in addition you can access winston as follows:

```javascript
scarletWinston.winston
```

For more information on how to configure winston please go [here](https://github.com/flatiron/winston).

## Custom messages during the before and after events.

If you want to custom the before and after event logs do the following:

```javascript
scarletWinston.beforeMethodCall = function(invocation){
  scarletWinston.log('info', "Before Method Call");
};

scarletWinston.afterMethodCall = function(invocation){
  scarletWinston.log('info', "After Method Call");
};
```

## Examples


### Start logging for an instance

```javascript
var scarletWinston = require('scarlet-winston');

//Define a function to log
function FunctionToLog(){
  this.logMe = function(){ scarletWinston.info("In logMe"); }
};
var functionToLogInstance = new FunctionToLog();

//Attach Logger to object
scarletWinston.bindTo(functionToLogInstance);

//Now use intercepted object with logging!
functionToLogInstance.logMe();
//->info: [Tue Aug 27 2013 23:51:16 GMT+0100 (BST)]calling - FunctionToLog::logMe()
//->info: In logMe
//->info: [Tue Aug 27 2013 23:51:16 GMT+0100 (BST)]FunctionToLog::logMe() - returned:undefined - execution time(0:0:0.1)
```

### Start logging for an instance with custom winston configuration

```javascript
var winston = require('winston');
var scarletWinston = require('scarlet-winston');

//Define a function to log
function FunctionToLog(){
  this.logMe = function(){ scarletWinston.info("In logMe"); }
};
var functionToLogInstance = new FunctionToLog();

//Create a custom winston configuration
var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: 'somefile.log' })
    ]
  });

//Attach Logger to object
scarletWinston.logger(logger).bindTo(functionToLogInstance);

//Now use intercepted object with logging!
functionToLogInstance.logMe();
//->info: [Tue Aug 27 2013 23:51:16 GMT+0100 (BST)]calling - FunctionToLog::logMe()
//->info: In logMe
//->info: [Tue Aug 27 2013 23:51:16 GMT+0100 (BST)]FunctionToLog::logMe() - returned:undefined - execution time(0:0:0.1)
```

### Start logging an instances member

```javascript
var scarletWinston = require('scarlet-winston');

//Define a function to log
function FunctionToLog(){
  this.logMe = function(){ scarletWinston.info("In logMe"); }
  this.dontLogMe = function(){ scarletWinston.info("In Don't logMe"); }
};
var functionToLogInstance = new FunctionToLog();

//Attach Logger to object
scarletWinston.bindTo(functionToLogInstance,'logMe');

//Call a non intercepted method
functionToLogInstance.dontLogMe();
//-> no output

//Now use intercepted object with logging!
functionToLogInstance.logMe();
//->info: [Tue Aug 27 2013 23:51:16 GMT+0100 (BST)]calling - FunctionToLog::logMe()
//->info: In logMe
//->info: [Tue Aug 27 2013 23:51:16 GMT+0100 (BST)]FunctionToLog::logMe() - returned:undefined - execution time(0:0:0.1)
```

###Start logging all instances of a function

 ```javascript
var scarletWinston = require('scarlet-winston');

function FunctionToLog(){
  this.logMe = function(){ scarletWinston.info("In logMe"); }
};

//Attach Logger to object
FunctionToLog = scarletWinston.bindTo(FunctionToLog);

//Now use intercepted object with logging!
var functionToLogInstance = new FunctionToLog();
//-> Outputs the following to the console:
//->info: [Tue Aug 27 2013 09:39:55 GMT+0100 (BST)] - calling - FunctionToLog::FunctionToLog()
//->info: [Tue Aug 27 2013 09:39:55 GMT+0100 (BST)] - FunctionToLog::FunctionToLog() - returned:undefined - execution time(0:0:0.0)

functionToLogInstance.logMe();
//-> Outputs the following to the console:
//->[Tue Aug 27 2013 09:39:55 GMT+0100 (BST)] - Debug - calling - FunctionToLog::logMe()
//->info: In logMe
//->[Tue Aug 27 2013 09:39:55 GMT+0100 (BST)] - Debug - FunctionToLog::logMe() - returned:undefined - execution time(0:0:0.0)
```

###Start logging all instances of a prototype function

 ```javascript
var scarletWinston = require('scarlet-winston');
 
//Define a prototype object to log
var ObjectToLog = function (){};
ObjectToLog.prototype.someMethod = function(){ scarletWinston.info("In logMe"); };
  
//Attach Logger to object
ObjectToLog = scarletWinston.bindTo(ObjectToLog);
  
//Now use intercepted object 
var objectToLog = new ObjectToLog();
//-> Outputs the following to the console:
//->[Tue Aug 27 2013 09:50:23 GMT+0100 (BST)] - Debug - calling - FunctionToLog::FunctionToLog()
//-?[Tue Aug 27 2013 09:50:23 GMT+0100 (BST)] - Debug - FunctionToLog::FunctionToLog() - returned:undefined - execution time(0:0:0.1)

//When called will now get logged
var result = objectToLog.someMethod();
//-> Outputs the following to the console:
//->[Tue Aug 27 2013 09:50:23 GMT+0100 (BST)] - Debug - calling - FunctionToLog::logMe()
//->info: In logMe
//->[Tue Aug 27 2013 09:50:23 GMT+0100 (BST)] - Debug - FunctionToLog::logMe() - returned:undefined - execution time(0:0:0.0)
```
