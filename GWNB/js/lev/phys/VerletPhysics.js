js.include('lev.collision.2d.CollisionManager');

LEV.physics.VerletPhysics = function VerletPhysics() {
	var bodies = [];
	var collision = new LEV.managers.CollisionManager();	

	//Public
	this.Body = Body;	
	this.update = update;
	this.add = add;
	this.remove = remove;	
	this.collision = collision;	

	function add(body) {
		if (bodies.indexOf(body) != -1) return;
		bodies.push(body);
	}

	function remove(body) {
		var idx = bodies.indexOf(body);
		if (idx == -1) return;
		bodies.splice(idx, 1);
	}

	function Body(position={x:0,y:0}, mass=1, friction=.9, bounce=1, isStatic=false, gravity=0) {			
		this.vx = 0;
		this.vy = 0;
		this.vz = 0;
		this.position = position;
		this.friction = friction;
		this.bounce = bounce;
		this.isStatic = isStatic;				
		this.floor = 0;
		if (mass <= 0) mass = 0.00000000000001;
		this.mass = mass || 1;		
		this.ignore = [];

		var prevX = position.x;
		var prevY = position.y;	
		var prevZ = position.z;				

		this.iteration = function () {
			if (isStatic) return;
			this.vx = this.position.x - prevX;
			this.vy = this.position.y - prevY;			

			if (parseInt(this.vx*10000) == 0) this.vx = 0;
			if (parseInt(this.vy*10000) == 0) this.vy = 0;

			//sif (this.vx == 0 && this.vy == 0 && ) return;

			this.vx *= this.friction;
			this.vy *= this.friction;
			prevX = this.position.x;
			prevY = this.position.y;			

			if (this.vx) this.position.x += this.vx;
			if (this.vy) this.position.y += this.vy;
			
			if (gravity && this.position.z > this.floor) {
				this.position.z -= gravity;				
				this.vz = this.position.z - prevZ;
				prevZ = this.position.z;				
				if (parseInt(this.vz*10000) == 0) this.vz = 0;				
				if (this.vz) this.position.z += this.vz;				
				if (this.position.z < this.floor) this.position.z = this.floor;
			}			
		}

		this.setXY = function(x, y) {
			this.position.x = x;
			this.position.y = y;
			prevX = x;
			prevY = y;
		}		

		this.reset = function() {			
			prevX = this.position.x;
			prevY = this.position.y;
			this.vx = 0;
			this.vy = 0;
		}	

		this.resetZ = function() {			
			prevZ = this.position.z;			
			this.vz = 0;
		}	
	}	

	collision.onCollide = function(collObjA, collObjB, resolveObj) {
		var bodyA = collObjA.entity.phys.body;
		var bodyB = collObjB.entity.phys.body;	

		if (bodyA.ignore.length > 0 && bodyA.ignore.indexOf(bodyB) != -1) return;		
		if (bodyB.ignore.length > 0 && bodyB.ignore.indexOf(bodyA) != -1) return;		

		//trace('collision.onCollide', collObjA.entity.name, collObjB.entity.name);

		if (bodyA.isStatic && bodyB.isStatic) return;
		resolveHit(bodyA, bodyB, resolveObj)
	}

	function resolveHit(bodyA, bodyB, resolveObj, bounce = 1.05) {
		var dx = resolveObj.dx;
		var dy = resolveObj.dy;

		var summ = bodyA.mass + bodyB.mass;
		var ratio1 = bodyA.mass/summ;
		var ratio2 = bodyB.mass/summ;
		
		dx *= bounce;
		dy *= bounce;					

		if (bodyA.isStatic) {
			bodyB.position.x += dx;
			bodyB.position.y += dy;		
			return true;
		}

		if (bodyB.isStatic) {
			bodyA.position.x -= dx;						
			bodyA.position.y -= dy;						
			return true;
		}		
				
		bodyA.position.x -= dx*ratio2;				
		bodyB.position.x += dx*ratio1;				
		bodyA.position.y -= dy*ratio2;
		bodyB.position.y += dy*ratio1;
	}

	function update() {		
		//for (var i=0; i < 3; i++) collision.test();
		collision.test();

		for (var i=0; i < bodies.length; i++) {
			bodies[i].iteration();		
		}
	}	

	LEV.components.phys = function(props) {	
		var entity = this;
		var shape = props.shape instanceof LEV.shapes.Shape? props.shape : LEV.shapes.Shape.fromArray(props.shape);
		if (props.mask && !Array.isArray(props.mask)) throw new Error('Propety "mask" had to be a Array type');	

		if (this.position) {
			var body = new Body(this.position, props.mass, props.friction, props.bounce, props.isStatic, props.gravity);	
			this.position.bind(onPositionUpdate);

			function onPositionUpdate(p) {
				shape.x = p.x;
				shape.y = p.y;
			}
		} else {
			var position = {x:(props.x || 0), y:(props.y || 0)};			
			var body = new Body(position, props.mass, props.friction, props.bounce, props.isStatic, props.gravity);	
		}			
		var collObj = collision.add(this, shape, props.type, props.masks);			
		
		add(body);		

		if (props.velocity) {
			body.position.x += props.velocity[0];
			body.position.y += props.velocity[1];
		}		

		this.phys = {
			body: body,
			collObj: collObj,		
			shape: shape
		};		
		this.delete.add(function() {			
			collObj.event.clear();		
			collision.remove(collObj);
			remove(body);			
			delete entity.phys;
		}.bind(this));
	} 	
}