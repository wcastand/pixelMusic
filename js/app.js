var img;
var player;
var canvas;
var setup = false;

document.addEventListener('DOMContentLoaded', function(){
	var c = document.createElement('canvas');
	document.body.appendChild(c);
	c.id = "world";
	canvas = new Canvas('#world');
	canvas.setup();
	player = new Audio();
	img = new Image();

	img.onload = function() {
		var data = canvas.grayscale(img, 0);
		canvas.changeImgData(data);
	}
	img.src = './img/lion.jpg';
	var dropZone = document.querySelector('.drop');
	dropZone.addEventListener('dragover', handleDragOver, false);
	dropZone.addEventListener('drop', handleFileSelect, false);
	player = new Audio();
});

function handleFileSelect(evt) {
	evt.stopPropagation();
	evt.preventDefault();

	var files = evt.dataTransfer.files;
	var output = [];
	var f = files[0];
	if(f.type.indexOf("audio") != -1){
		setup = false;
		var reader = new FileReader();
		reader.onload = (function(f) {
			return function(e) {
				player.decodeData(e.target.result, function(){setup = true;});
			};
		})(f);
		reader.readAsArrayBuffer(f);
	}
	else if(f.type.indexOf('img')){
		var readerImg = new FileReader();
		readerImg.onload = (function(f) {
			return function(e) {
				img.src = e.target.result;
			};
		})(f);
		readerImg.readAsDataURL(f);
	}
}

function handleDragOver(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	evt.dataTransfer.dropEffect = 'copy';
}

window.requestAnimationFrame = (function(){
	return window.requestAnimationFrame  ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame    ||
	window.oRequestAnimationFrame      ||
	window.msRequestAnimationFrame     ||
	function(callback){
		window.setTimeout(callback, 1000 / 60);
	};
})();

(function animloop(){
	requestAnimationFrame(animloop);
	render();
})();

function render(){
	if(!setup)
		return;
	canvas.gtx.save();
	canvas.gtx.clearRect(0, 0, canvas.width, canvas.height);
	canvas.gtx.restore();

	data = new Uint8Array(player.fft.frequencyBinCount);
	player.fft.getByteFrequencyData(data);
	var avg = Math.average.apply(null, data);
	if(avg > 200) avg = 200;
	var imgData = canvas.grayscale(img, 1 - avg/200);
	canvas.changeImgData(imgData);

	var angle = 0;
	for ( var i = 0; i < player.fft.frequencyBinCount; i++){
		var value = data[i];
		var percent = value / 256;
		var height = 100 * percent;

		var valueBis = data[i];
		var percentBis = valueBis / 256;
		var heightBis = 100 * percentBis;

		canvas.gtx.save();

		canvas.gtx.beginPath();
		canvas.gtx.rotate(degToRad(angle));
		canvas.gtx.fillStyle="rgba(251, 110, 30,.5)";
		canvas.gtx.fillRect(Math.sin(degToRad(angle)), Math.cos(degToRad(angle))+250, 2, height);
		canvas.gtx.fillRect(Math.sin(degToRad(angle)), Math.cos(degToRad(angle))+250, 2, -heightBis);
		canvas.gtx.closePath();

		canvas.gtx.restore();
		angle+= 360/player.fft.frequencyBinCount;
	}
}
