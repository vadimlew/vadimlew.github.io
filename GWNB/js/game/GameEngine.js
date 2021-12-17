//js.include('game.Enemy');
//js.include('game.Player');

LEV.event.LIFE_OVER = 'life_over';

LEV.game.Engine = function GameEngine(pixi) {
	var hitBoxManager = new LEV.managers.CollisionManager();
	var garbageTexture = PIXI.RenderTexture.create(800, 600);
	var destructPool = {};

	this.init = function() {
		var garbage = game.display.layer.get('garbage');		
		var garbageSprite = PIXI.Sprite.from(garbageTexture);
		//garbageSprite.filters = [game.display.filters.vintage];
		garbage.addChild(garbageSprite);
	}
		
	LEV.components.position = function(props) {		
		if (props.x === void 0) props.x = 0;
	    if (props.y === void 0) props.y = 0; 	   
	    if (props.z === void 0) props.z = 0; 	   
	   	   
		var x = Number(props.x); 
		var y = Number(props.y);
		var z = Number(props.z);
		var position = {};
		var bindes = [];	
		var entity = this;	

		Object.defineProperty(position, 'x', {
			set: function(value) {
				x = value;
				updateBindes();		
			},
			get: function() {				
				return x;
			}
		});

		Object.defineProperty(position, 'y', {
			set: function(value) {
				y = value;
				updateBindes();
			},
			get: function() {				
				return y;
			}
		});

		Object.defineProperty(position, 'z', {
			set: function(value) {
				z = value;				
				updateBindes();
			},
			get: function() {				
				return z;
			}
		});		

		position.bind = function(func) {			
			func(position, entity);
			bindes.push(func);
		}

		function updateBindes() {			
			bindes.forEach((func)=>{func(position, entity)});
		}

		position.unbind = function(func) {
			var ix = bindes.indexOf(func);
			if (ix != -1) bindes.splice(ix,1);
		}		

		this.position = position;
		this.delete.add(function() {
			delete this.position;			
			bindes.length = 0;
		}.bind(this));
	}		

	LEV.components.position3D = function(props) {		
		if (props.x === void 0) props.x = 0;
	    if (props.y === void 0) props.y = 0; 	   
	    if (props.z === void 0) props.z = 0; 	   
		var x = Number(props.x); 
		var y = Number(props.y);
		var z = Number(props.z);
		var position3D = {};
		var bindes = [];		

		Object.defineProperty(position3D, 'x', {
			set: function(value) {
				x = value;
				bindes.forEach((func)=>{func(position3D)});				
			},
			get: function() {				
				return x;
			}
		});

		Object.defineProperty(position3D, 'y', {
			set: function(value) {
				y = value;
				bindes.forEach((func)=>{func(position3D)});
			},
			get: function() {				
				return y;
			}
		});

		Object.defineProperty(position3D, 'z', {
			set: function(value) {
				z = value;
				bindes.forEach((func)=>{func(position3D)});
			},
			get: function() {				
				return z;
			}
		});

		position3D.bind = function(func) {	
			func(position3D);		
			bindes.push(func);
		}

		position3D.unbind = function(func) {
			var ix = bindes.indexOf(func);
			if (ix != -1) bindes.splice(ix,1);
		}		

		this.position3D = position3D;
		this.delete.add(function() {
			delete this.position3D;
			position3D = null;			
			bindes = null;
		}.bind(this));
	}	

	LEV.components.surface = function(props) {
		var entity = this;
		var objects = [];
		var surface = {};		
		var oldX = entity.position.x;
		var oldY = entity.position.y;
		var friction = 0.99;
		var altitude = props.altitude || 0;
		var surfaces = [];		
		
		surface.put = function(...args) {	
			for (var i = 0; i < args.length; i++) {
				var obj = args[i];	
				if (objects.includes(obj)) continue;				
				obj.position.z = altitude;
				obj.phys.body.floor = altitude;
				obj.phys.body.resetZ();
				entity.phys.body.mass += obj.phys.body.mass;
				entity.phys.body.ignore.push(obj.phys.body);
				objects.push(obj);
			}				
		}

		entity.phys.collObj.event.on(LEV.event.START_COLLIDE, onStartCollide);
		entity.phys.collObj.event.on(LEV.event.END_COLLIDE, onEndCollide);
		if (entity.position) entity.position.bind(onChangePosition);

		function onChangePosition(pos) {
			var dx = (pos.x - oldX)*friction;
			var dy = (pos.y - oldY)*friction;							
			for (var i = 0; i < objects.length; i++) {
				var obj = objects[i];
				if (obj.position) {						
					obj.position.x += dx*(1-obj.phys.body.friction);
					obj.position.y += dy*(1-obj.phys.body.friction);
				}				
			}			
			oldX = pos.x;
			oldY = pos.y;
		}

		function onStartCollide(collObjB) {	
			if (collObjB.entity.position.z >= altitude) {
				surface.put(collObjB.entity);
			}
		}

		function onEndCollide(collObjB) {			
			var entityB = collObjB.entity;	
			
			if (!objects.includes(entityB)) return;

			var surfaceFlag = false;

			collObjB.touching.forEach(function(collObj) {						
				if (collObj.entity != entity && collObj.entity.surface) {
					surfaceFlag = true;
					return;
				}
			});

			if (!surfaceFlag && entityB.position) {				
				entityB.phys.body.floor = 0;	
				entityB.phys.body.resetZ();
			}

			entity.phys.body.mass -= entityB.phys.body.mass;
			entity.phys.body.ignore.remove(entityB.phys.body);
			objects.remove(entityB);
		}		
		
		this.surface = surface;
		this.delete.add(function() {			
			entity.phys.collObj.event.off(LEV.event.END_COLLIDE, onEndCollide);
			objects.length = 0;
			entity.phys.body.ignore.length = 0;
			delete this.surface;
		}.bind(this));
	}

	LEV.components.table = function(props) {
		LEV.components.surface.call(this, props);		
		var entity = this;
		var player = null;

		entity.phys.collObj.event.on(LEV.event.START_COLLIDE, onStartCollide);
		entity.phys.collObj.event.on(LEV.event.END_COLLIDE, onEndCollide);

		function onStartCollide(collObjB) {	
			if (collObjB.entity.name == 'player') {						
				player = collObjB.entity;
				player.actor.sm.event.on(LEV.event.state.CHANGE, onStateChange);
				onStateChange(player.actor.sm.currState);
			}
		}

		function onStateChange(state) {				
			if (state.name == 'JumpState') {
				entity.surface.put(player);
				player.actor.sm.event.off(LEV.event.state.CHANGE, onStateChange);
			} 
		}	

		function onEndCollide(collObjB) {
			if (collObjB.entity == player) {				
				player.actor.sm.event.off(LEV.event.state.CHANGE, onStateChange);
				player = null;
			}	
		}

		this.delete.add(function() {
			if (player) player.actor.sm.event.off(LEV.event.state.CHANGE, onStateChange);
			entity.phys.collObj.event.off(LEV.event.START_COLLIDE, onStartCollide);
			entity.phys.collObj.event.off(LEV.event.END_COLLIDE, onEndCollide);
		}.bind(this));
	}

	LEV.components.castShadow = function(props) {
		var shape = new PIXI.Graphics();
		var shadow = new PIXI.Container();	
		shape.beginFill(0x000000, 0.25);			
		shape.drawRect(props.shape[0], props.shape[1], props.shape[2], props.shape[3]);
		shadow.addChild(shape);
		shadow.cacheAsBitmap = true;

		if (this.position) {
			this.position.bind(shadowUpdate);
		}		

		function shadowUpdate(p) {				
			shadow.x = p.x;
			shadow.y = p.y;
		}		
			
		if (props.layer) {
			if (typeof props.layer == 'string') {
				props.layer = game.display.layer.get(props.layer);
			}	
			props.layer.addChild(shadow);	
		}

		this.castShadow = {
			display: shadow
		};

		this.delete.add(function() {
			if (this.position) this.position.unbind(shadowUpdate);
			//if (this.position3D) this.position3D.unbind(shadowUpdate);	
			shadow.destroy();			
			delete this.castShadow;
		}.bind(this));		
	}

	LEV.components.hitBox = function(props) {
		var entity = this;
		
		var shape = new LEV.shapes.Shape.fromArray(props.shape);
		var collObj = hitBoxManager.add(this, shape, props.type, props.masks);

		if (this.position) this.position.bind(onPositionUpdate);

		function onPositionUpdate(p) {
			shape.x = p.x;
			shape.y = p.y - p.z;
			collObj.test();
		}		

		this.hitBox = {
			shape: shape,
			collObj: collObj,
			event: collObj.event
		}

		this.delete.add(function() {			
			collObj.event.clear();
			hitBoxManager.remove(collObj);
			delete this.hitBox;
		}.bind(this));
	}
	
	LEV.components.shooter = function(props) {
		var entity = this;
		var gun = game.factory.guns[props.gun](entity);		
		//this.display.addChild(gun.display);	

		this.shooter = {
			gun: gun
		}

		this.delete.add(function() {
			gun.delete();					
			delete this.shooter;
		}.bind(this));
	}

	LEV.components.handgun = function(props) {
		var gun = this;
		var shooter = props.shooter;

		var localMuzzle = new PIXI.Point(10,3);
		var muzzle = new PIXI.Point();
		var globalPos = new PIXI.Point();

		var reloadTimeMax = 30;
		var reloadTime = 30;
		var kick = 0.25;
		var kickback = 0;
		var bulletSpeed = 5;
		var active = true;
		var damage = 50;

		var bulletProps = {
			x:0, 
			y:0, 
			vx:0, 
			vy:0, 
			damage:50,
			kick: 0.25,
			bullet_type:  props.bullet_type,
			bullet_mask: ['object', 'obstacle', 'enemy'],
			size: 5
		};

		function fire() {
			if (!active || reloadTime < reloadTimeMax) return;
			reloadTime = 0;

			game.display.root.toLocal(localMuzzle, gun.display, muzzle);
			var cos = Math.cos(gun.display.rotation*gun.display.scale.x);
			var sin = Math.sin(gun.display.rotation*gun.display.scale.x);

			bulletProps.x = muzzle.x;
			bulletProps.y = muzzle.y;
			bulletProps.vx = bulletSpeed*cos;
			bulletProps.vy = bulletSpeed*sin;
			
			var bullet = game.factory.bullet(bulletProps);
			
			shooter.position.x -= kickback * cos;
			shooter.position.y -= kickback * sin;
		}		

		function update() {
			reloadTime++;

			//var sx = gun.display.parent.scale.x;											

			gun.display.getGlobalPosition(globalPos);
			var dx = game.input.mouse.x - globalPos.x;
			var dy = game.input.mouse.y - globalPos.y;

			var sx = dx > 0? 1 : -1;			

			var dd = Math.sqrt(dx*dx + dy*dy);
			var dd2 = 4.2426;
			var cos = dd2/dd;
			
			var acos = Math.acos(cos);
			var a = Math.PI/2 - acos;

			gun.display.rotation = Math.atan2(dy,dx) + a;
			//gun.display.getChildAt(1).scale.set(1,sx);			
			if (dy > 0) gun.display.scale.y = sx;	
			else gun.display.scale.y = 1;
					
			if (game.input.mouse.left) {
				fire();
			}
		}
		pixi.ticker.add(update);

		function activate() {
			gun.display.visible = true;
			active = true;
		}	

		function deactivate() {
			gun.display.visible = false;
			active = false;
		}	

		//this.fire = fire;
		this.activate = activate;
		this.deactivate = deactivate;		

		this.delete.add(function() {
			pixi.ticker.remove(update);
			//delete this.fire;
			delete this.activate;
			delete this.deactivate;
		}.bind(this));
	}

	LEV.components.damage = function(props) {
		if (!this.hitBox) {
			console.warn('Для работы компонента damage требуется компонент hitBox');
			return;
		}

		var entity = this;
		var value = props.value || 0;		
		var kick = props.kick || 0;		

		entity.hitBox.event.on(LEV.event.COLLIDE, onCollide);
		function onCollide(collObjB, collObjA) {
			var entityB = collObjB.entity;			

			if (collObjB.type != 'obstacle' && entityB.position) {		
				//ша ()		
				//entityB.position.x += entity.phys.body.vx * kick//entityB.phys.body.mass;
				//entityB.position.y += entity.phys.body.vy * kick//entityB.phys.body.mass;
			}

			if (entityB && entityB.life) {
				entityB.life.value -= props.value;
			}
		}
	}

	LEV.components.life = function (value=100) {
		var life = {};	
		var entity = this;
		LEV.components.event.call(life);		

		Object.defineProperty(life, 'value', {
			set: function(life_value) {
				value = life_value;				
				if (value <= 0) {					
					life.event.dispatch(LEV.event.LIFE_OVER, entity);
					entity.delete();
				}		
			},
			get: function() {				
				return value;
			}
		});	

		this.life = life;
		this.delete.add(function() {
			this.life.event.clear();
			delete this.life;
		}.bind(this));
	}

	LEV.components.animateOnHit = function(props) {
		var entity = this;
		var loop_count = 0;
		var loop_max = 0;
		var a_speed = entity.animation.animationSpeed;

		entity.hitBox.event.on(LEV.event.START_COLLIDE, onBullet);

		function onBullet() {			
			loop_count = 0;	
			loop_max = 5 + parseInt(10*Math.random());	

			if (entity.animation) {
				entity.animation.play();
				entity.animation.animationSpeed = a_speed;			
			}
		}

		if (entity.animation.loop) {
			entity.animation.onFrameChange = function() {
				if (props.slowDown) this.animationSpeed -= 0.01;

				loop_count++;				
				if (loop_count >= loop_max) {					
					this.stop();
				}			
			}
		}		
	}

	LEV.components.deleteOnHit = function(props) {
		var entity = this;
		entity.hitBox.event.on(LEV.event.COLLIDE, onBulletCollide);

		function onBulletCollide(collObjB, collObjA) {			
			collObjA.event.off(LEV.event.COLLIDE, onBulletCollide);
			collObjA.entity.delete();
		}
	}

	
	LEV.components.destructible = function(props) {
		if (!this.life) {
			console.warn('Для работы компонента destructible требуется компонент life');
			return;
		}		

		var entity = this;
		
		entity.life.event.on(LEV.event.LIFE_OVER, lifeOver);
		
		var rw = 10;
		var rh = 10;
		var parts = props.parts || destructPool[this.name];

		if (!parts) {
			if (!destructPool['e_base64']) {
				var canvas = document.createElement("canvas");
				canvas.width = rw;
				canvas.height = rh;
				var e_base64 = canvas.toDataURL("image/png");
				destructPool['e_base64'] = e_base64;
			} else {
				var e_base64 = destructPool['e_base64'];
			}

			if (entity.display.shadow) entity.display.shadow.visible = false;
			generateParts();
			if (entity.display.shadow) entity.display.shadow.visible = true;
		}

		function lifeOver() {
			if (entity.display.shadow) entity.display.shadow.destroy();			
			destructPixels();
		}

		function generateParts() {
			parts = [];
			var region = entity.display.getBounds();
			var x = region.x;
			var y = region.y;
			var h = region.height;			

			var partsW = Math.ceil(region.width/rw);
			var partsH = Math.ceil(region.height/rh);			
			
			region.width = rw;
			region.height = rh;			

			for (var i=0; i<partsW*partsH; i++) {
				var dx = rw * (i%partsW);
				var dy = rh * parseInt(i/partsW);
				region.x = x + dx;
				region.y = y + dy;
				var texture = pixi.renderer.generateTexture(entity.display, 1, 1, region);
				var base64  = pixi.renderer.plugins.extract.base64(texture);				
				if (e_base64 == base64) continue;
				parts.push(dx, dy, rw, rh);
				//rectShape(region.x-entity.position.x, region.y-entity.position.y, region.width, region.height, 0xff0000);
			}			
		}

		function rectShape(x,y,w,h, lineColor, alpha=1) {				
			var debugShape = new PIXI.Graphics();
			if (lineColor != void 0) debugShape.lineStyle(1, lineColor);			
			debugShape.drawRect(x, y, w, h);
			debugShape.alpha = alpha;
			debugShape.endFill();
			//entity.display.addChild(debugShape);
			return debugShape;
		}		

		function destructPixels() {				
			var bounds = entity.display.getBounds();
			var part = new PIXI.Rectangle();			

			entity.phys.body.iteration();			
			var vx = entity.phys.body.vx;
			var vy = entity.phys.body.vy;
			var bottom = bounds.y + parts[parts.length-3] + parts[parts.length-1];			

			for (var i=0; i<parts.length; i+=4) {				
				part.x = bounds.x + parts[i];
				part.y = bounds.y + parts[i+1];
				part.width = parts[i+2];
				part.height = parts[i+3];
				var texture = pixi.renderer.generateTexture(entity.display, 1, 1, part);
				var z = entity.position.z + bottom - part.y-part.height;				
				var p = game.factory.particle(part.x, bottom-part.height+entity.position.z, z, texture, part.width, part.height, 150);
				p.position.x += vx*Math.random();
				p.position.y += vy*Math.random();
			}
		}		
	}

	LEV.components.lifeTime = function(props) {
		var time = props.time;
		var entity = this;
		pixi.ticker.add(update);
		function update() {
			time--;
			if (time <= 0) {				
				entity.delete();
			}
		}

		this.delete.add(function() {			
			pixi.ticker.remove(update);
		}.bind(this));		
	}

	LEV.components.garbage = function(props) {
		var entity = this;
		entity.delete.event.on(LEV.event.DELETE, onDelete);

		function onDelete() {
			entity.display.filters = [game.display.filters.vintage];			
			pixi.renderer.render(entity.display, garbageTexture, false);
		}		
	}

	/*
	LEV.components.draggable = function(props) {
		this.draggable = true;	
		var display = this.animation ? this.animation : this.display;
		var count = 0;

		this.highlightOn = function() {	
			count = 0		
			display.filters = [LEV.display.filters.outline];
		}

		this.highlightOff = function() {	
			count++;
			if (count > 10) display.filters = [];
		}

		LEV.utils.timeManager.add(this.highlightOff);
	}*/
	
}