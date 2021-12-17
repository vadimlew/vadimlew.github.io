js.include('lev.collision.3d.CollisionManager3D');

LEV.physics.VerletPhysics3D = function VerletPhysics3D() {
	var bodies = [];
	var collision = new LEV.managers.CollisionManager3D();	
	var gravityZ = .5;

	//Public
	this.Body3D = Body3D;	
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

	function Body3D(position={x:0,y:0,z:0}, mass=1, friction=.9, bounce=1, isStatic=false) {			
		this.vx = 0;
		this.vy = 0;
		this.vz = 0;
		this.position = position;
		this.friction = friction;
		this.bounce = bounce;
		this.isStatic = isStatic;				
		if (mass <= 0) mass = 0.00000000000001;
		this.mass = mass || 1;		
		this.isTransition = false;
		var prevX = position.x;
		var prevY = position.y;	
		var prevZ = position.z;					

		this.iteration = function () {
			if (isStatic) return;
			this.vx = position.x - prevX;
			this.vy = position.y - prevY;			
			this.vz = position.z - prevZ;

			this.vx *= friction;
			this.vy *= friction;
			//this.vz *= friction;

			prevX = position.x;
			prevY = position.y;	
			prevZ = position.z;	

			position.x += this.vx;
			position.y += this.vy;
			position.z += this.vz - gravityZ;	

			if (position.z < 0) position.z = 0;		
		}

		this.setXYZ = function(x, y, z) {
			position.x = x;
			position.y = y;
			position.z = z;
			prevX = x;
			prevY = y;
			prevZ = z;
		}		

		this.reset = function() {			
			prevX = position.x;
			prevY = position.y;
			prevZ = position.y;
			this.vx = 0;
			this.vy = 0;
			this.vz = 0;
		}	
	}	

	collision.onCollide = function(collObjA, collObjB, resolveObj) {
		var bodyA = collObjA.entity.phys3D.body;
		var bodyB = collObjB.entity.phys3D.body;		

		//trace('collision.onCollide', collObjA.entity.name, collObjB.entity.name);	

		if (bodyA.isStatic && bodyB.isStatic) return;
		resolveHit(bodyA, bodyB, resolveObj)
	}

	function resolveHit(bodyA, bodyB, resolveObj, bounce = 1.05) {
		var dx = resolveObj.dx;
		var dy = resolveObj.dy;
		var dz = resolveObj.dz;

		var summ = bodyA.mass + bodyB.mass;
		var ratio1 = bodyA.mass/summ;
		var ratio2 = bodyB.mass/summ;
		
		dx *= bounce;
		dy *= bounce;					
		dz *= bounce;					

		if (bodyA.isStatic) {
			bodyB.position.x += dx;
			bodyB.position.y += dy;		
			bodyB.position.z += dz;		
			return true;
		}

		if (bodyB.isStatic) {
			bodyA.position.x -= dx;						
			bodyA.position.y -= dy;						
			bodyA.position.z -= dz;						
			return true;
		}		
				
		bodyA.position.x -= dx*ratio2;				
		bodyB.position.x += dx*ratio1;				
		bodyA.position.y -= dy*ratio2;
		bodyB.position.y += dy*ratio1;
		bodyA.position.z -= dz*ratio2;
		bodyB.position.z += dz*ratio1;
	}

	function update() {	
		/*for (var i=0; i < bodies.length; i++) {
			if (bodies[i].isStatic) continue;
			bodies[i].position.z -= gravityZ;
		}*/
	
		collision.test();
		
		for (var i=0; i < bodies.length; i++) {
			bodies[i].iteration();		
		}
	}	

	LEV.components.phys3D = function(props) {	
		var entity = this;

		var shape = props.shape instanceof LEV.shapes.Shape3D? props.shape : LEV.shapes.Shape3D.fromArray(props.shape);
		if (props.mask && !Array.isArray(props.mask)) throw new Error('Propety "mask" had to be a Array type');	

		if (this.position3D) {
			var body = new Body3D(this.position3D, props.mass, props.friction, props.bounce, props.isStatic, props.type, props.masks);	
			this.position3D.bind(onPositionUpdate);
		} else {
			var position3D = {x:(props.x || 0), y:(props.y || 0), z:(props.z || 0)};
			var body = new Body3D(position3D, props.mass, props.friction, props.bounce, props.isStatic, props.type, props.masks);	
		}			
		var collObj = collision.add(this, shape, props.type, props.masks);	

		function onPositionUpdate(p) {
			shape.x = p.x;
			shape.y = p.y;
			shape.z = p.z;
		}
		
		add(body);		

		this.phys3D = {
			body: body,
			collObj: collObj,
			shape: shape
		};		
		this.delete.add(function() {			
			collision.remove(entity);
			remove(body);			
			delete entity.phys3D;
		}.bind(this));
	} 	
}