var Audio = function(){
	this.context = new AudioContext();
	this.buffer = '';
	this.source = '';
	this.fft = '';
	this.samples = 2048;
	this.volumeNode  = '';
	this.played = false;
	this.startTime = 0;
	this.pauseTime = 0;
	that = this;
}

Audio.prototype = {
	decodeData : function(data,callback){
		this.context.decodeAudioData(data, function(buf) {
			that.buffer = buf;
			that.play();
			if(callback)
				callback();
		}, this.onError);
	},
	play : function(){
		if(this.played)
			this.stop();
		this.startTime = this.context.currentTime;

		this.source = this.context.createBufferSource();
		this.volumeNode = this.context.createGain();
		this.fft = this.context.createAnalyser();
		var compressor = this.context.createDynamicsCompressor();

		this.source.buffer = this.buffer;
		this.source.loop = true;
		this.fft.smoothingTimeConstant = 0.3;
		this.fft.fftSize = this.samples;

		this.source.connect(this.fft);
		this.fft.connect(this.context.destination);

		this.source.connect(this.volumeNode);
		this.volumeNode.connect(this.context.destination);

		this.volumeNode.gain.value = 1;

		this.played = true;
		this.source.start(0, this.pauseTime % this.buffer.duration);
	},
	pause : function(){
		if(this.played){
			this.source.stop();
			this.pauseTime = this.context.currentTime - this.startTime;
			this.played = false;
		}
	},
	stop : function(){
		if(this.played){
			this.source.stop();
			this.pauseTime = 0;
			this.played = false;
		}
	},
	onError : function(e){
		console.log(e);
	}
}
