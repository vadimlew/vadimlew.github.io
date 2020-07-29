function trace() {
	console.log(...arguments);
}

Array.prototype.remove = function(element) {
	if (Array.isArray(element)) {
		for (var e of element) {
			this.remove(e);
		}
		return;
	}
	var ix = this.indexOf(element);
	while (ix != -1) {
		this.splice(ix, 1);
		ix = this.indexOf(element);
	}            
}

Array.prototype.rand = function() {
	if (this.length == 0) return false;
	return this[parseInt(this.length*Math.random())];
}

Array.prototype.generate = function(Class, num) {
	for (var i=0; i < num; i++) {
		this.push(new Class());
	}
}

Array.prototype.next = function(id) {
	if (this.current == void 0) this.current = 0;
	if (id < 0) id = 0;
	if (id >= this.length) id = this.length-1;
	if (id != void 0) this.current = id;	
	if (this.current >= this.length) return false;	
	return this[this.current++];
}

Array.prototype.shuffle = function(num=100) {
	if (this.length == 0) return false;
	while(num > 0) {
		var idx1 = parseInt(this.length*Math.random());
		var idx2 = parseInt(this.length*Math.random());
		var buffer = this[idx1];
		this[idx1] = this[idx2];
		this[idx2] = buffer;
		num--;
	}
}

Array.prototype.swap = function(id1, id2) {
	var buffer = this[id1];
	this[id1] = this[id2];
	this[id2] = buffer;
}

/*function JSF(seed) {
		function jsf() {
			var e = s[0] - (s[1]<<27 | s[1]>>>5);
			s[0] = s[1] ^ (s[2]<<17 | s[2]>>>15),
			s[1] = s[2] + s[3],
			s[2] = s[3] + e, s[3] = s[0] + e;
		    return (s[3] >>> 0) / 4294967296; // 2^32
		}
		seed >>>= 0;
		var s = [0xf1ea5eed, seed, seed, seed];
		for(var i=0;i<20;i++) jsf();
		return jsf();
	}

	for (var i = 0; i < 10; i++) {
		trace(JSF(100*Math.random()));
	}	*/