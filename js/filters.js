var Canvas = function(id){
	this.canvas = document.querySelector(id);
	this.gtx;
	this.width;
	this.height;
	that = this;
};
Canvas.prototype = {
	setup : function(){
		this.width = this.canvas.width = window.innerWidth;
		this.height = this.canvas.height = window.innerHeight;
		this.gtx = this.canvas.getContext("2d");
		this.gtx.setTransform(1, 0, 0, 1, window.innerWidth/2, window.innerHeight/2);
	},
	changeImgData : function (data){
		this.gtx.putImageData(data, 0, 0);
	},
	getPixels : function(img){
		this.drawCenterImage(img);
		return this.gtx.getImageData(0,0,this.width,this.height);
	},
	drawCenterImage : function(img){
		var ow = this.width;
		var oh = (ow * img.height) / img.width;

		if(oh < this.height){
			oh = this.height;
			ow = (oh * img.width) / img.height;
		}

		var posx = Math.abs((this.width - ow)/2);
		var posy = Math.abs((this.height - oh)/2);

		//console.log(img, ow, oh,this.width, this.height, posx, posy);
		this.gtx.clearRect(0, 0, this.width, this.height);
		this.gtx.drawImage(img, posx, posy, img.width, img.height, - canvas.width / 2, - canvas.height / 2, ow, oh);
	},
	grayscale : function(image, ratio) {
		var pixels = this.getPixels(image);
		var d = pixels.data;
		for (var i=0; i<d.length; i+=4) {
			var r = d[i];
			var g = d[i+1];
			var b = d[i+2];
			var v = 0.2126*r + 0.7152*g + 0.0722*b;
			d[i] = r + ((v-r)*ratio);
			d[i+1] =  g + ((v-g)*ratio);
			d[i+2] = b + ((v-b)*ratio);
		}
		return pixels;
	}
};
