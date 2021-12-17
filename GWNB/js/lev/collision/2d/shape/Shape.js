LEV.shapes = LEV.shapes || {};

LEV.shapes.Shape = function Shape(rects=[], x=0, y=0) {
	this.rects = rects;
	this.x = x;
	this.y = y;	

	this.isIntersect = function(shape) {
		for (var i = 0; i < shape.rects.length; i++) {	
			var rect = shape.rects[i];			
			if (this.isIntersectXYWH(rect.x+shape.x, rect.y+shape.y, rect.width, rect.height)) return true;
		}
		return false;
	}

	this.collision = function(shape,resolveObj) {	
		var flag = false;	
		for (var i = 0; i < shape.rects.length; i++) {	
			var rect = shape.rects[i];			
			if (this.collisionXYWH(rect.x+shape.x, rect.y+shape.y, rect.width, rect.height, resolveObj)) flag = true;
		}
		return flag;
	}

	this.collisionXYWH = function(x,y,width,height,resolveObj) {	
		var flag = false;		
		for (var i = 0; i < this.rects.length; i++) {			
			if (this.rects[i].collisionXYWH(x-this.x, y-this.y, width, height, resolveObj)) flag = true;
		}
		return flag;
	}		

	this.isIntersectXYWH = function(x, y, width, height) {
		for (var i = 0; i < this.rects.length; i++) {			
			if (this.rects[i].isIntersectXYWH(x-this.x, y-this.y, width, height)) return true;
		}
		return false;
	}		

	this.isIntersectRect = function(rect) {	
		for (var i = 0; i < this.rects.length; i++) {
			if (this.rects[i].isIntersectXYWH(rect.x-this.x, rect.y-this.y, rect.width, rect.height)) return true;
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

LEV.shapes.Shape.fromArray = function(arr) {
	if (arr.length%4 != 0) console.error('Массив должен быть кратным 4');	

	var rects = [];
	for (var i = 0; i < arr.length; i += 4) {
		var rect = new LEV.shapes.Rectangle(arr[i+0], arr[i+1], arr[i+2], arr[i+3]);
		rects.push(rect);
	}
	return new LEV.shapes.Shape(rects);
}

LEV.shapes.Rectangle = function Rectangle(x, y, width, height)
{
	if ( x === void 0 ) { x = 0; }
	if ( y === void 0 ) { y = 0; }
	if ( width === void 0 ) { width = 0; }
	if ( height === void 0 ) { height = 0; }

	this.x = Number(x);
	this.y = Number(y);	   
	this.width = Number(width);
	this.height = Number(height);

	this.collisionXYWH = function(x,y,width,height,resolveObj) {		
		var dx = resolveObj.dx + x - this.x;			
		if (dx > 0 && dx >= this.width) return false;		
		if (dx < 0 && -dx >= width) return false;

		var dy = resolveObj.dy + y - this.y;			
		if (dy > 0 && dy >= this.height) return false;		
		if (dy < 0 && -dy >= height) return false;	
		
		resolveObj.solve(dx, dy, this.width, this.height, width, height);
		return true;
	}		

	this.isIntersectXYWH = function(x,y,width,height) {		
		var dx = x - this.x;			
		if (dx > 0 && dx >= this.width) return false;
		if (dx < 0 && -dx >= width) return false;

		var dy = y - this.y;			
		if (dy > 0 && dy >= this.height) return false;
		if (dy < 0 && -dy >= height) return false;

		return true;
	}		

	this.isIntersectRect = function(rect) {			
		return this.isIntersectXYWH(rect.x, rect.y, rect.width, rect.height);
	}

	this.containsXY = function(x,y) {
		return (x > this.x && x < this.right && y > this.y && y < this.bottom);
	}

	this.clone = function() {
		return new Rectangle(this.x, this.y, this.width, this.height);
	}
};

LEV.shapes.Rectangle.fromArray = function(arr) {
	if (arr.length != 4) console.error('Массив должен быть кратным 4');
	return LEV.shapes.Rectangle(arr[0], arr[1], arr[2], arr[3]);
}

LEV.shapes.Rectangle3d = function Rectangle3d(x, y, z, width, height, altitude) {
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

	this.collisionXYWH = function(x,y,width,height,resolveObj) {		
		var dx = resolveObj.dx + x - this.x;			
		if (dx > 0 && dx >= this.width) return false;		
		if (dx < 0 && -dx >= width) return false;

		var dy = resolveObj.dy + y - this.y;			
		if (dy > 0 && dy >= this.height) return false;		
		if (dy < 0 && -dy >= height) return false;			
		
		resolveObj.solve(dx, dy, this.width, this.height, width, height);
		return true;
	}		

	this.collisionXYZWHA = function(x,y,z,width,height,altitude,resolveObj) {		
		var dx = resolveObj.dx + x - this.x;			
		if (dx > 0 && dx >= this.width) return false;		
		if (dx < 0 && -dx >= width) return false;

		var dy = resolveObj.dy + y - this.y;			
		if (dy > 0 && dy >= this.height) return false;		
		if (dy < 0 && -dy >= height) return false;	

		var dz = z - this.z;		
		if (dz > 0 && dz >= this.altitude) return false;
		if (dz < 0 && -dz >= height) return false;	
		
		resolveObj.solve(dx, dy, this.width, this.height, width, height);
		return true;
	}		

	this.isIntersectXYWH = function(x,y,width,height) {		
		var dx = x - this.x;			
		if (dx > 0 && dx >= this.width) return false;
		if (dx < 0 && -dx >= width) return false;

		var dy = y - this.y;			
		if (dy > 0 && dy >= this.height) return false;
		if (dy < 0 && -dy >= height) return false;

		return true;
	}		

	this.isIntersectRect = function(rect) {			
		return this.isIntersectXYWH(rect.x, rect.y, rect.width, rect.height);
	}

	this.containsXY = function(x,y) {
		return (x > this.x && x < this.right && y > this.y && y < this.bottom);
	}

	this.clone = function() {
		return new Rectangle(this.x, this.y, this.width, this.height);
	}
};