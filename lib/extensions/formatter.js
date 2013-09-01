module.exports = {
	formatArgs : function(args){
		var formattedArgs = "";

		var argsArray = Array.prototype.slice.call(args);
		for (var i = 0; i < argsArray.length; i++) {
			if(i > 0)
				formattedArgs += ",";

			formattedArgs += argsArray[i];
		}

		return formattedArgs;
	},
	getFormatedTimeSpan : function(fromDateTime,toDateTime){
		var milliSecondDifference = Math.abs(fromDateTime-toDateTime);
		var secondsDifference = Math.round(milliSecondDifference/1000);
		var minutesDifference = Math.round(secondsDifference/60);
		var hourDifference = Math.round(minutesDifference/60);

		return hourDifference+":"+minutesDifference+":"+secondsDifference+"."+milliSecondDifference;
	}
};