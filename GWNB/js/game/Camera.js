function Camera(display, x=0, y=0, w=0, h=0) {
	var camera = this;	
	var bounds = display.getLocalBounds();
	bounds.width -= w - bounds.x;
	bounds.height -= h - bounds.y;
	
	var target;

	Object.defineProperty(this, 'x', {
		configurable: true,
		get: function() {							
			return x;
		},
		set: function(value) {				
			x = value;			
			if (x < bounds.x) x = bounds.x;
			if (x > bounds.width) x = bounds.width;

			display.x = -x;	
		}
	})	

	Object.defineProperty(this, 'y', {
		configurable: true,
		get: function() {							
			return y;
		},
		set: function(value) {				
			y = value;			
			if (y < bounds.y) y = bounds.y;
			if (y > bounds.height) y = bounds.height;

			display.y = -y;
		}
	})	

	this.x = x;
	this.y = y;

	this.followTo = function(value) {
		target = value;
		game.pixi.ticker.add(update);
	}

	function update() {		
		camera.x = target.x - w/2;
		camera.y = target.y - h/2;
	}
}