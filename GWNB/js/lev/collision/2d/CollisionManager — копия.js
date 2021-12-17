js.include('lev.collision.2d.shape.Shape');

LEV.event.START_COLLIDE = 'start_collide';
LEV.event.COLLIDE = 'collide';
LEV.event.END_COLLIDE = 'end_collide';

LEV.managers.CollisionManager = function CollisionManager() {
	var pairs = [];
	var shapes = {};
	var links = {};
	var resolveObj = new ResolveObject();
	var collisionManager = this;	

	this.pairs = pairs;
	this.shapes = shapes;

	Object.defineProperty(this, 'pairs', {
		get: function() {
			return pairs;
		}
	})

	Object.defineProperty(this, 'shapes', {
		get: function() {
			return shapes;
		}
	})

	this.add = function(entity, shape, type='common', masks=[]) {
		var collObjA = new CollisionObj(entity, shape, type);
		
		this.addLink(type, masks);		

		links[type].forEach(function(mask) {
			var collObjects = shapes[mask];			
			if (!collObjects) return;
			for (var i = 0; i < collObjects.length; i++) {
				pairs.push(collObjA, collObjects[i]);	
			}
		})		

		if (!shapes[type]) shapes[type] = [];
		shapes[type].push(collObjA);		
		return collObjA;		
	}	

	this.addLink = function (type, masks) {
		if (links[type]) {
			for (var i = 0; i < masks.length; i++) 				
				if (links[type].indexOf(masks[i]) == -1) links[type].push(masks[i]);
		} else {
			links[type] = [].concat(masks);
		}

		for (var i = 0; i < masks.length; i++) {			
			var mask = masks[i];			
			if (links[mask]) {				
				if (links[mask].indexOf(type) == -1) links[mask].push(type);
			} else {
				links[mask] = [].concat(type);				
			}
		}
	}	 

	this.remove = function(collObj) {
		if (!(collObj instanceof CollisionObj)) {
			console.error('collObj must be CollisionObj instance');
		} 

		var ix = pairs.indexOf(collObj);
		while(ix != -1) {
			pairs.splice(ix, 2);
			ix = pairs.indexOf(collObj);
		}
		
		/*for (type in shapes) {
			var collObjects = shapes[type];
			for (var i = 0; i < collObjects.length; i++) {
				var collObj = collObjects[i];
				if (collObj.entity == entity) {			
					collObjects.splice(ix, 1);
					var ix = pairs.indexOf(collObj);
					while(ix != -1) {
						pairs.splice(ix, 2);
						ix = pairs.indexOf(collObj);
					}
					i--;					
				}
			}				
		}*/		
	}

	this.test = function() {		
		for (var i = 0; i < pairs.length; i+=2) {
			testCollide(pairs[i], pairs[i+1]);
		}		
	}	

	this.onCollide = function() {};

	function CollisionObj(entity, shape, type) {
		this.entity = entity;
		this.shape = shape;
		this.type = type;
		this.touching = [];
		LEV.components.event.call(this);

		//todo: узнать в гугле нужно ли вынести функцию delete 
		/*this.delete = function() {			
			var ix = shapes[this.type].indexOf(this);			
			if (ix != -1) shapes[this.type].splice(ix, 1);			
			for (var i = 0; i < pairs.length; i++) {	
				var pair = pairs[i];
				if (pair.isIn(this)) {	
					ix = 					
					ix = pairs.indexOf(pair);
					if (ix != -1) {
						pairs.splice(ix, 1);
						i--;
					}
				}					
			}
			delete this.entity;
			delete this.shape;
			delete this.type;			
			delete this.event;
			delete this.touching;
		}*/
	}

	function ResolveObject() {
		this.dx = 0;
		this.dy = 0;		

		this.reset = function() {
			this.dx = 0;
			this.dy = 0;			
		}

		this.solve = function(dx, dy, widthA, heightA, widthB, heightB) {
			var dx1 = widthA - dx;
			var dx2 = widthB + dx;
			var dy1 = heightA - dy;
			var dy2 = heightB + dy;			
			dx = dx1 < dx2? dx1 : -dx2;
			dy = dy1 < dy2? dy1 : -dy2;			

			if (Math.abs(dx) < Math.abs(dy)) {
				this.dx += dx;
			} else {
				this.dy += dy;
			}
		}
	}

	function testCollide(collObjA, collObjB) {
		var shapeA = collObjA.shape;
		var shapeB = collObjB.shape;		

		var isCollide = shapeA.collision(shapeB, resolveObj);
		if (isCollide) {
			if (collObjA.touching.indexOf(collObjB) == -1) {
				collObjA.event.dispatch(LEV.event.START_COLLIDE, collObjB, collObjA);
				collObjA.touching.push(collObjB);
			}

			if (collObjB.touching.indexOf(collObjA) == -1) {
				collObjB.event.dispatch(LEV.event.START_COLLIDE, collObjA, collObjB);
				collObjB.touching.push(collObjA);
			}

			collObjA.event.dispatch(LEV.event.COLLIDE, collObjB, collObjA);
			collObjB.event.dispatch(LEV.event.COLLIDE, collObjA, collObjB);

			collisionManager.onCollide(collObjA, collObjB, resolveObj);
			resolveObj.reset();
		} else {
			if (collObjA.touching.length > 0) {
				var ix = collObjA.touching.indexOf(collObjB);
				if (ix != -1) {
					collObjA.event.dispatch(LEV.event.END_COLLIDE, collObjB, collObjA);
					collObjA.touching.splice(ix, 1);
				}					
			}

			if (collObjB.touching.length > 0) {
				var ix = collObjB.touching.indexOf(collObjA);
				if (ix != -1) {
					collObjB.event.dispatch(LEV.event.END_COLLIDE, collObjA, collObjB);
					collObjB.touching.splice(ix, 1);
				}
			}
		}
	}	

	LEV.components.collision = function(props) {
		var shape = props.shape instanceof LEV.shapes.Shape? props.shape : LEV.shapes.Shape.fromArray(props.shape);
		if (props.masks && !Array.isArray(props.masks)) throw new Error('Propety "masks" had to be a Array type');
		var manager = props.manager || collisionManager;
		var collObj = manager.add(this, shape, props.type, props.masks);

		this.collision = {
			shape: shape,
			collObj: collObj
		};

		if (this.position) {
			this.position.bind(onPositionUpdate);
		}

		function onPositionUpdate(p) {
			shape.x = p.x;
			shape.y = p.y;			
		}
		
		this.delete.add(function() {
			collisionManager.remove(this);
			delete this.collision;
		}.bind(this));
	}
}
