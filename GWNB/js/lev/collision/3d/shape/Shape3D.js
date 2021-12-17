LEV.shapes = LEV.shapes || {};

LEV.shapes.Shape3D = function Shape3D(rects=[], x=0, y=0, z=0) {
	this.rects = rects;
	this.x = x;
	this.y = y;	
	this.z = z;	

	this.isIntersect = function(shape) {
		for (var i = 0; i < shape.rects.length; i++) {	
			var rect = shape.rects[i];			
			if (this.isIntersect(rect.x+shape.x, rect.y+shape.y, rect.z+shape.z, rect.width, rect.height, rect.altitude)) return true;
		}
		return false;
	}

	this.collision = function(shape,resolveObj) {	
		var flag = false;	
		for (var i = 0; i < shape.rects.length; i++) {	
			var rect = shape.rects[i];			
			if (this.collisionXYZ(rect.x+shape.x, rect.y+shape.y, rect.z+shape.z, rect.width, rect.height, rect.altitude, resolveObj)) flag = true;
		}
		return flag;
	}

	this.collisionXYZ = function(x,y,z,width,height,altitude,resolveObj) {	
		var flag = false;		
		for (var i = 0; i < this.rects.length; i++) {			
			if (this.rects[i].collision(x-this.x, y-this.y, z-this.z, width, height, altitude, resolveObj)) flag = true;
		}
		return flag;
	}	

	this.isIntersectXYZ = function(x,y,z,width,height,altitude) {
		for (var i = 0; i < this.rects.length; i++) {			
			if (this.rects[i].isIntersect(x-this.x, y-this.y, z-this.z, width, height, altitude)) return true;
		}
		return false;
	}		

	this.isIntersectRect = function(rect) {	
		for (var i = 0; i < this.rects.length; i++) {
			if (this.rects[i].isIntersect(rect.x-this.x, rect.y-this.y, rect.z-this.z, rect.width, rect.height, rect.altitude)) return true;
		}
		return false;		
	}

	this.containsXY = function(x,y) {
		for (var i = 0; i < rects.length; i++) {
			if (rects[i].containsXY(x-this.x, y-this.y)) return true;
		}
		return false;		
	}
};

LEV.shapes.Shape3D.fromArray = function(arr) {
	if (arr.length%6 != 0) console.error('Массив должен быть кртаным 6');	

	var rects = [];
	for (var i = 0; i < arr.length; i += 6) {
		var rect = new LEV.shapes.Box(arr[i+0], arr[i+1], arr[i+2], arr[i+3], arr[i+4], arr[i+5]);
		rects.push(rect);
	}
	return new LEV.shapes.Shape3D(rects);
}

LEV.shapes.Box = function Box(x, y, z, width, height, altitude) {
	if ( x === void 0 ) { x = 0; }
	if ( y === void 0 ) { y = 0; }
	if ( z === void 0 ) { z = 0; }
	if ( width === void 0 ) { width = 0; }
	if ( height === void 0 ) { height = 0; }
	if ( altitude === void 0 ) { altitude = 0; }

	this.x = Number(x);
	this.y = Number(y);	   
	this.z = Number(z);	   
	this.width = Number(width);
	this.height = Number(height);
	this.altitude = Number(altitude);
	
	this.collision = function(x,y,z,width,height,altitude,resolveObj) {	
		var dx = resolveObj.dx + x - this.x;			
		if (dx > 0 && dx >= this.width) return false;		
		if (dx < 0 && -dx >= width) return false;

		var dy = resolveObj.dy + y - this.y;			
		if (dy > 0 && dy >= this.height) return false;		
		if (dy < 0 && -dy >= height) return false;	

		var dz = resolveObj.dz + z - this.z;
		if (dz > 0 && dz >= this.altitude) return false;
		if (dz < 0 && -dz >= altitude) return false;
		
		resolveObj.solve(dx, dy, dz, this.width, this.height, this.altitude, width, height, altitude);
		return true;
	}		

	this.isIntersect = function(x,y,z,width,height,altitude) {		
		var dx = x - this.x;			
		if (dx > 0 && dx >= this.width) return false;
		if (dx < 0 && -dx >= width) return false;

		var dy = y - this.y;			
		if (dy > 0 && dy >= this.height) return false;
		if (dy < 0 && -dy >= height) return false;

		var dz = z - this.z;
		if (dz > 0 && dz >= this.altitude) return false;
		if (dz < 0 && -dz >= altitude) return false;	

		return true;
	}		

	this.isIntersectRect = function(rect) {			
		return this.isIntersect(rect.x, rect.y, rect.z, rect.width, rect.height, rect.altitude);
	}

	this.containsXY = function(x,y) {
		return (x > this.x && x < this.right && y > this.y && y < this.bottom);
	}

	this.clone = function() {
		return new Box(this.x, this.y, this.z, this.width, this.height, this.altitude);
	}
};