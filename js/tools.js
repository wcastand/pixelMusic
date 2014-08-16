/*************************
TOOLS
*************************/

function radToDeg(angle){
	return ((180 * (angle)) / Math.PI);
}

function degToRad(angle){
	return ((Math.PI * (angle)) / 180);
}

function RandomRange(min,max){
	return Math.floor((Math.random()*max)+min);
}

Math.average = function() {
	var values = 0;
	var average;
	var length = arguments.length;
	for (var i = 0; i < length; i++)
		values += arguments[i];
	average = values / length;
	return average;
}
