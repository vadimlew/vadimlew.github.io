js.include('game.Player');
js.include('game.Enemy');

function Factory() {
	var factory = this;
	var entityManager = new LEV.managers.EntityManager();
	this.entityManager = entityManager;

	factory.layer = null;

	factory.player = {};
	factory.enemy = {};
	factory.construct = {};
	factory.interior = {};
	factory.particle = {};
	factory.helper = {};

	var physFlag = 0;
	var hitFlag = 0;
	var origFlag = 0;
	var sortFlag = 0;
	var debug = {sort:sortFlag, origin:origFlag, hitBox:hitFlag, phys:physFlag}

	var gravity = .5;

	// Players
	factory.player.designer = function(x,y) {
		var player = entityManager.create({
			name: 'player',	
			position: {x, y},		
			display: {layer:factory.layer, shadow:[-10,-5,20,10], sort:{y:0, h:25}},
			animation: {
				list: [
					{name:'frontWalk', src:'player_walk_front', frames:6, speed:0.2, px:20, py:35, goto:2},
					{name:'backWalk', src:'player_walk_back', frames:6, speed:0.2, px:20, py:35, goto:2},
					{name:'frontJump', src:'player_jump_front', loop:false, frames:9, speed:0.2, px:20, py:35},
					{name:'backJump', src:'player_jump_back', loop:false, frames:9, speed:0.2, px:20, py:35},
					{name:'backSideJump', src:'player_jump_back_side', loop:false, frames:9, speed:0.2, px:20, py:35},
					{name:'frontSideJump', src:'player_jump_front_side', loop:false, frames:9, speed:0., px:20, py:35}
				],
				autoplay: false
			},
			phys: {shape:[-10,-5,20,5], friction:0.85, mass:60, gravity:gravity, type:'player', masks:['wall', 'interior', 'enemy', 'equipment']},
			shooter: {gun:'pistol'},
			hitBox: {shape:[-10,-15,20,10], type:'player'},
			life: 200,	
			destructible: true,
			player: true,
			//dropShadow:[-10,-5,20,10],			
			//carrier: {},
			debug: {hitBox:0, phys:0}
		});		

		return player;
	}

	// Constructions
	factory.construct.floor = function(x,y,w,h,color) {
		var display;

		if (typeof color == 'string') {
			var texture = PIXI.Texture.from(color);	
			display = new PIXI.TilingSprite(texture,w,h);
		} else {
			display = new PIXI.Graphics();
			display.beginFill(color);		
			display.drawRect(0, 0, w, h);	
		}
			
		return entityManager.create({
			display: {x:x, y:y, image:display, layer:factory.layer, cacheAsBitmap:true}
		})
	}

	factory.construct.wall = function(x,y,direction,length) {
		var color_top = 0x0f3044;
		var color_side = 0xeed1a0;
		var wall_height = 20;
		var wall_thick = 10;
		var w = 0;
		var h = 0;

		if (direction == 'h') {
			w = length;			
		} else {			
			h = length;			
		}		

		if (w > h) h += wall_thick;
		if (w < h) w += wall_thick;		

		var shape = new PIXI.Graphics();
		shape.beginFill(color_top);
		shape.drawRect(0, 0, w, h);
		shape.beginFill(color_side);
		shape.drawRect(0, h, w, wall_height);

		var sort_y = h + wall_height - wall_thick;

		return entityManager.create({
			name: 'wall',
			position: {x:x, y:y},
			display: {image:shape, layer:factory.layer, sort:{y:sort_y, h:30}},
			phys: {shape:[0,0,w,h+wall_height], isStatic:true, type:'wall'},
			//phys: {shape:[0,wall_height,w,h], isStatic:true, type:'wall'},
			hitBox: {shape:[0,0,w,h+wall_height/2], type:'obstacle'},
			debug: {hitBox:0, phys:0}
		});		
	}

	// INTERIORS
	factory.interior.table = {};
	factory.interior.table.office_brown_horizontal = function(x,y) {
		return entityManager.create({
			name: 'office_brown_horizontal_table',
			position: {x:x, y:y},
			display: {image:'office_brown_horizontal_table.png', layer:factory.layer, shadow:[0,20,60,15], sort:{y:25, h:15}},
			phys: {shape:[0,10,60,20], mass:30, friction:0.65, type:'interior', masks:['wall', 'interior', 'equipment']},
			table: {altitude:10},
			//draggable: {},
			debug: {origin:0, hitBox:0, phys:0}
		});
	}

	factory.interior.table.dining_white_horizontal = function(x,y) {
		return entityManager.create({
			name: 'dining_white_horizontal_table',
			position: {x:x, y:y},
			display: {image:'dining_white_horizontal_table.png', layer:factory.layer, shadow:[0,20,60,15], sort:{y:25, h:15}},
			phys: {shape:[0,10,60,20], mass:30, friction:0.65, type:'interior', masks:['wall', 'interior', 'equipment']},	
			table: {altitude:10},		
			debug: {origin:0, hitBox:0, phys:0}
		});
	}

	factory.interior.table.dining_white_vertical = function(x,y) {
		return entityManager.create({
			name: 'dining_white_vertical_table',
			position: {x:x, y:y},
			display: {image:'dining_white_vertical_table.png', layer:factory.layer, shadow:[0,15,30,40], sort:{y:25, h:15}},
			phys: {shape:[0,10,30,40], mass:30, friction:0.65, type:'interior', masks:['wall', 'interior', 'equipment']},
			table: {altitude:10},
			debug: {origin:0, hitBox:0, phys:0}
		});
	}

	factory.interior.table.small_brown = function(x,y) {
		return entityManager.create({
			name: 'small_brown_table',
			position: {x:x, y:y},
			display: {image:'small_brown_table.png', layer:factory.layer, shadow:[0,15,30,20], sort:{y:30, h:10}},
			phys: {shape:[0,5,30,20], mass:10, friction:0.8, type:'interior', masks:['wall', 'interior', 'equipment']},	
			table: {altitude:10},		
			debug: {origin:0, phys:0}
		});
	}

	// Plants
	factory.interior.plants = {};
	factory.interior.plants.cactus = function(x,y,type='0') {
		switch(type) {
			case '0': return entityManager.create({	
				name: 'plants_cactus_1',
				position: {x:x, y:y},
				display: {ax:0.5, ay:1, image:'cactus.png', layer:factory.layer, sort:{y:0, h:20}},
				phys: {shape:[-7.5,-10,15,10], mass:8, friction:0.8, gravity:gravity, type:'interior', masks:['wall', 'interior']},
				hitBox: {shape:[-7.5,-40,15,40], type:'object'},
				life: 50,
				destructible: true,
				debug: {hitBox:0, phys:0}
			});	
			case '1': return entityManager.create({	
				name: 'plants_cactus_2',	
				position: {x:x, y:y}, 			
				display: {ax:0.5, ay:1, image:'cactus2.png', layer:factory.layer, sort:{y:0, h:20}},
				phys: {shape:[-7.5,-10,15,10], mass:8, friction:0.8, gravity:gravity, type:'interior', masks:['wall', 'interior']},
				hitBox: {shape:[-7.5,-40,15,40], type:'object'},
				life: 50,
				destructible: true,
				debug: {hitBox:0, phys:0}
			});	
		}		
	}	

	factory.interior.plants.flower = function(x,y,type='0') {
		switch(type) {
			case '0': return entityManager.create({	
				name: 'plants_flower',	
				position: {x:x, y:y},	
				display: {ax:0.5, ay:1, image:'flower.png', layer:factory.layer, sort:{y:0, h:20} },
				phys: {shape:[-7.5,-10,15,10], mass:5, friction:0.85, gravity:gravity, type:'interior', masks:['wall', 'interior']},
				hitBox: {shape:[-7.5,-15,15,15], type:'object'},				
				life: 50,
				destructible: true,
				debug: {origin:0, hitBox:0, phys:0}
			});	
		}		
	}

	// Seats
	factory.interior.seat = {};
	factory.interior.seat.chair = {};
	factory.interior.seat.stool = {};
	factory.interior.seat.chair.swivel_office_blue = function(x,y) {
		return entityManager.create({ 	
			name: 'swivel_office_blue_chair',			
			position: {x:x, y:y},
			display: {layer:factory.layer, shadow:[-10,10,15,15], sort:{y:20, h:25}}, 
			animation: { 
				list: [ 
					{name:'spin', src:'chair_dark_spin', frames:4, speed:0.16, ax:0.5, ay:0.5, goto:0} 
				], 
				autoplay: false 
			}, 
			phys: {shape:[-10,5,16,15], mass:12, friction:0.97, type:'interior', masks:['wall', 'interior', 'equipment']},
			hitBox: {shape:[-10,-15,16,24], type:'object'},				
			life: 200, 
			animateOnHit: {slowDown:true}, 
			destructible: true,			
			debug: {origin:0, hitBox:0, phys:0}
		}); 
	}

	factory.interior.seat.chair.big_red = function(x,y,type='front') {
		switch(type) { 
			case 'front': return entityManager.create({ 
				name: 'chair_red_front',
				position: {x:x, y:y},
				display: {image:'chair_red_front.png', layer:factory.layer, shadow:[0,20,40,25], sort:{y:35, h:25}}, 
				phys: {x:x, y:y, shape:[0,20,40,15], mass:30, friction:0.5, type:'interior', masks:['wall', 'interior']}, 
				hitBox: {shape:[0,15,40,20, 5,0,30,15], type:'object'},				
				debug: {origin:0, hitBox:0, phys:0}
			});		

			case 'right': return entityManager.create({	
				name: 'chair_red_right',
				position: {x:x, y:y},			
				display: {image:'chair_red_right.png', layer:factory.layer, shadow:[0,30,30,20], sort:{y:35, h:25}}, 
				phys: {x:x, y:y, shape:[0,25,30,15], mass:30, friction:0.5, type:'interior', masks:['wall', 'interior']}, 
				hitBox: {shape:[0,15,30,25, 0,0,10,15], type:'object'},			
				debug: {hitBox:0, phys:0} 
			});		

			case 'left': return entityManager.create({ 	
				name: 'chair_red_left',
				position: {x:x, y:y},	
				display: {image:'chair_red_left.png', layer:factory.layer, shadow:[0,30,30,20], sort:{y:35, h:25}}, 
				phys: {x:x, y:y, shape:[0,25,30,15], mass:30, friction:0.5, type:'interior', masks:['wall', 'interior']}, 
				hitBox: {shape:[0,15,30,25, 20,0,10,15], type:'object'},				
				debug: {hitBox:0, phys:0} 
			});			
		} 
	}

	factory.interior.seat.couch = function(x,y,type='0') {
		switch(type) {
			case '0': return entityManager.create({		
				name: 'couch_red_front',
				position: {x:x, y:y},
				display: {image:'couch.png', layer:factory.layer, shadow:[0,25,60,20], sort:{y:35, h:25}},
				phys: {shape:[0,20,60,15], mass:80, friction:0.4, type:'interior', masks:['wall', 'interior']},	
				hitBox: {shape:[0,15,60,20, 5,0,50,15], type:'object'},
				debug: {hitBox:0, phys:0}
			});			
		}		
	}


	factory.interior.seat.stool.dining = function(x,y,color,id=1) {
		var hitBoxShape;
		switch(id) {
			case 1:
				hitBoxShape = [0,0,15,25];
				break;
			case 2:
				hitBoxShape = [0,15,15,10, 0,0,5,15];
				break;
			case 3:
				hitBoxShape = [0,0,15,25];
				break;
			case 4:
				hitBoxShape = [0,15,15,10, 10,0,5,15];
				break;
		}

		return entityManager.create({
			name: 'dining_stool_'+color+id,
			position: {x:x, y:y},
			display: {image:'dining_stool_'+color+id+'.png', layer:factory.layer, shadow:[0,20,15,15], sort:{y:30, h:20}},			
			phys: {shape:[0,20,15,5], mass:12, friction:0.9, type:'interior', masks:['wall', 'interior', 'equipment']},
			hitBox: {shape:hitBoxShape, type:'object'},
			life: 200,			
			destructible: true,
			debug: {origin:0, hitBox:0, phys:0}
		}); 
	}

	// Equipments
	factory.interior.equipment = {};
	factory.interior.equipment.pc = function(x,y) {
		return entityManager.create({
			name: 'pc',	
			position: {x:x, y:y},			
			display: {image:'comp.png', layer:factory.layer, sort:{y:30, h:15}},
			phys: {shape:[0,15,10,15], mass:5, friction:0.89, gravity:gravity, type:'equipment', masks:['wall', 'equipment']},
			hitBox: {shape:[0,0,10,30], type:'object'},
			life: 100,
			destructible: [0,0,20,20],
			debug: debug
		});	
	}

	factory.interior.equipment.monitor = function(x,y) {
		return entityManager.create({	
			name: 'monitor',	
			position: {x:x, y:y},				
			display: {layer:factory.layer, sort:{y:25, h:25}},
			animation: {
				list: [
					{name:'blink', src:'monitor_blink', frames:2, speed:0.02, goto:0}
				],
				autoplay: true					
			},
			phys: {shape:[0,20,35,5], mass:5, friction:0.89, gravity:gravity, type:'equipment', masks:['wall', 'equipment']},
			hitBox: {shape:[0,0,36,20], type:'object'},
			life: 100,
			destructible: true,
			debug: debug
		});	
	}

	factory.interior.equipment.keyboard = function(x,y) {
		var keyboard =  entityManager.create({
			name: 'keyboard',	
			position: {x:x, y:y},
			display: {image:'keyboard.png', layer:factory.layer, sort:{y:10, h:10}},
			phys: {shape:[0,0,24,10], mass:.5, friction:0.89, gravity:gravity, type:'slim', masks:['wall', 'equipment', 'interior']},
			debug: debug
		});
		return keyboard;
	}

	// Guns
	factory.guns = {};
	factory.guns.pistol = function(shooter) {
		return entityManager.create({
			name: 'pistol',
			display: {x:7.5, y:-7.5, px:2.5, py:7, image:'pistol.png', shadow:[0,10,15,5], layer:shooter.display},
			handgun: {shooter:shooter, bullet_type: 'player_bullet'}
		});
	}

	factory.guns.yoyo = function(shooter) {
		var gun = entityManager.create({
			name: 'yoyo',
			position: {x:shooter.position.x, y:shooter.position.y, z:5},
			display: {px:5, py:5, image:'yoyo.png', layer:'game', sort:{y:10, h:10}},
			castShadow: {shape:[-5,-5,10,10], layer:'game'},			
			hitBox: {shape:[0,0,10,10], type:'player_bullet', masks:['object']},
			damage: {value:50, kick:0.25},
			debug: {origin:0, hitBox:1, phys:0}
		});		

		var globalPos = new PIXI.Point();

		var isFire = false;		
		var kick = 0.25;		
		var active = true;
		var damage = 50;
		var cos, sin, path=0, speed = 0;		

		function fire() {
			if (!active || isFire) return;
			reloadTime = 0;			
			
			cos = Math.cos(gun.display.rotation);
			sin = Math.sin(gun.display.rotation);
			speed = 3;
			isFire = true;
		}		

		function update() {			

			if (isFire) {
				path += speed;
				gun.position.x = shooter.position.x + 7.5 + path*cos;
				gun.position.y = shooter.position.y + path*sin;
				speed -= .1;
				if (path <= 0) {
					path = 0;
					isFire = false;
				}				
			} else {
				gun.position.x = shooter.position.x+7.5;
				gun.position.y = shooter.position.y;	

				gun.display.getGlobalPosition(globalPos);
				var dx = game.input.mouse.x - globalPos.x;
				var dy = game.input.mouse.y - globalPos.y;
				gun.display.rotation = Math.atan2(dy,dx);
			}		
					
			if (game.input.mouse.left) {
				fire();
			}
		}
		game.pixi.ticker.add(update);

		function activate() {
			gun.display.visible = true;
			active = true;
		}	

		function deactivate() {
			gun.display.visible = false;
			active = false;
		}	
		
		gun.activate = activate;
		gun.deactivate = deactivate;		

		gun.delete.add(function() {
			game.pixi.ticker.remove(update);			
			delete gun.activate;
			delete gun.deactivate;
		}.bind(gun));

		return gun;
	}



	factory.bullet = function(props/*, x,y,vx=0,vy=0,damage=0,kick=0,type='bullet',w=5*/) {
		var x = props.x || 0;
		var y = props.y || 0;
		var vx = props.vx || 0;
		var vy = props.vy || 0;
		var damage = props.damage || 0;
		var kick = props.kick || 0;
		var type = props.bullet_type || 'bullet';
		var masks = props.bullet_mask || [];
		var size = props.size || 5;

		var shape = new PIXI.Graphics();		
		shape.beginFill(0xfff74f);
		shape.lineStyle(1.5, 0xff1a1a);
		shape.drawRect(-size/2, -size/2, size, size);
		shape.cacheAsBitmap = true;

		var entity = entityManager.create({
			name:'bullet',
			position: {x:x, y:y+20, z:20},
			display: {image:shape, layer:'game', sort:{y:0, h:0}},	
			phys: {shape:[-size/2, -size/2, size, size], velocity:[vx, vy], mass:1, friction:1, type:type},		
			hitBox: {shape:[-size/2, -size/2, size, size], type:type, masks:masks},
			damage: {value:damage, kick:kick},
			deleteOnHit: true,
			debug: {hitBox:0}
		})		
		return entity;
	}

	factory.particle = function(x,y,z, texture, pw, ph, lifetime) {
		var entity = entityManager.create({
			position: {x:x, y:y, z:z},
			display: {image:texture, layer:'game', sort:{y:ph, h:ph}},
			phys: {shape:[0,0,pw,ph], friction:0.95, mass:.1, gravity:gravity, type:'trash', masks:['wall']},
			lifeTime: {time: lifetime},
			garbage: true,
			debug: {phys:0}
		});
		return entity;
	}
	
	// ENEMY
	factory.enemy.crab = function(x,y) {
		return entityManager.create({
			name: 'enemy_crab',	
			position: {x:x, y:y},		
			display: {layer:factory.layer, shadow:[-12,2,25,10], sort:{y:5, h:20}},
			animation: {
				list: [
					{name:'walk', src:'enemy_crab_walk', frames:6, speed:0.2, px:22.5, py:20, goto:0}
				],
				autoplay: false
			},			
			phys: {shape:[-10,-5,20,10], friction:0.7, mass:30, type:'enemy', masks:['wall', 'interior', 'enemy']},
			hitBox: {shape:[-10,-5,20,16], type:'object', masks:['player']},
			life: 150,	
			damage: {value:50, kick:5},		
			//destructible: {parts:[0,0,20,20, 20,0,20,20, 0,20,20,20, 20,20,20,20]},
			destructible: true,
			enemy: {ai:Enemy.CrabAI, target:'player'},
			debug: {origin:0, hitBox:0, phys:0}
		});
	}

	factory.enemy.mimic = {};
	factory.enemy.mimic_chair = function(x,y) {
		var entity = entityManager.create({
			name: 'mimic_crab',	
			position: {x:x, y:y},	
			display: {layer:factory.layer, shadow:[-15,10,30,15], sort:{y:10, h:30}},			
			animation: {
				list: [
					{name:'show', src:'enemy_robot_chair_show', frames:8, speed:0.1, ax:0.5, ay:0.75, loop:false},
					{name:'hide', src:'enemy_robot_chair_show', frames:8, speed:0.075, ax:0.5, ay:0.75, loop:false, reverse:true},
					{name:'walk', src:'enemy_robot_chair_walk', frames:8, speed:0.05, ax:0.5, ay:0.75}
				],
				autoplay: false
			},			
			phys: {shape:[-10,5,20,15], friction:0.6, mass:200, type:'enemy', masks:['wall', 'interior', 'enemy', 'equipment']},
			hitBox: {shape:[-15,-20,30,20], type:'enemy'},			
			life: 600,			
			destructible: true,
			enemy: {ai:Enemy.MimicСhairAI, target:'player'},
			debug: {origin:0, hitBox:0, phys:0}
		});

		return entity;
	}	

	/*factory.interior.door = function(x,y,type) {
		var animation, body, hitArea, sensorArea, newBodyShapes, newHitArea;

		switch(type) {
			case 'sliding_hor':
				animation = {list: [
						{name:'open', src:'door_sliding_horizontal', frames:4, speed:0.3, loop:false},
						{name:'close', src:'door_sliding_horizontal', frames:4, speed:0.3, loop:false, reverse:true}
					],	
					autoplay: false
				};
				body = {x:x, y:y, aabb:[0,0,55,25], isStatic:true, type:'wall'};				
				hitArea = {aabb:[0,0,55,25]};
				newBodyShapes = LEV.physics.AABB.fromArray([0,0,5,25, 50,0,5,25]);
				newHitArea = [0,0,5,25, 50,0,5,25];
				sensorArea = [x-20,y-30,100,85];
				break;
				
			case 'sliding_ver':
				animation = {list: [
						{name:'open', src:'door_sliding_vertical', frames:4, speed:0.3, loop:false},
						{name:'close', src:'door_sliding_vertical', frames:4, speed:0.3, loop:false, reverse:true}
					], 
					autoplay: false
				};
				body = {x:x, y:y, aabb:[0,0,5,55], isStatic:true, type:'wall'};
				hitArea = {aabb:[0,0,5,55]};
				newBodyShapes = LEV.physics.AABB.fromArray([0,0,5,5, 0,50,5,5]);
				newHitArea = [0,0,5,15, 0,50,5,5];
				sensorArea = [x-40,y-20,85,95];
				break;

			case 'hinged_hor':
				animation = {list: [{name:'open', src:'door_hinged_horizontal', frames:7, speed:0.6, loop:false}], autoplay: false};
				body = {x:x, y:y, aabb:[0,0,55,25], isStatic:true, type:'wall'};				
				hitArea = {aabb:[0,0,55,25]};
				newBodyShapes = LEV.physics.AABB.fromArray([0,0,5,40, 50,0,5,40]);
				newHitArea = [0,0,5,40, 50,0,5,40];
				sensorArea = [x-20,y-30,100,85];
				break;
				
			case 'hinged_ver':
				animation = {list: [{name:'open', src:'door_hinged_vertical', frames:7, speed:0.6, loop:false}], autoplay: false};
				body = {x:x, y:y, aabb:[0,0,5,50], isStatic:true, type:'wall'};
				hitArea = {aabb:[0,0,25,55]};
				newBodyShapes = LEV.physics.AABB.fromArray([5,0,20,5, 5,55,20,5]);
				newHitArea = [0,0,0,0];
				sensorArea = [x-40,y-20,85,95];
				break;
		}

		var door = entityManager.create({ 
			display: {x:x, y:y, layer:factory.layer, sorter:true}, 
			animation: animation, 
			body: body,
			hitArea: hitArea,			
			life: 500,			
			destructible: true,
			sensor: {area:sensorArea},
			debug: {hitArea:0, body:0, sensor:0}
		})

		if (type == 'hinged_hor' || type == 'hinged_ver') door.on('bullet_hit', onBulletHit);

		door.sensor.on('in', onSensorIn);		

		function onBulletHit(bullet) {			
			door.off('bullet_hit', onBulletHit);
			door.sensor.off('in', onSensorIn);
			openDoor();
		}

		function onSensorIn(obj) {			
			//door.off('bullet_hit', onBulletHit);
			door.sensor.off('in', onSensorIn);

			if (type == 'sliding_hor' || type == 'sliding_ver')
				door.sensor.on('out', onSensorOut);

			openDoor();
		}

		function onSensorOut(obj) {	
			door.sensor.on('in', onSensorIn);
			door.sensor.off('out', onSensorOut);
			closeDoor();
		}

		function openDoor() {
			door.play('open');
			door.body.shapes = newBodyShapes;
			door.hitArea = newHitArea;
			if (door.debug) {
				door.debug.destroy();
				LEV.components.debug.call(door, {body:0, hitArea:0, sensor:0});
			}
		}

		function closeDoor() {
			door.play('close');
			door.body.shapes = LEV.physics.AABB.fromArray(body.aabb);
			door.hitArea = hitArea.aabb;
			if (door.debug) {
				door.debug.destroy();
				LEV.components.debug.call(door, {body:0, hitArea:0, sensor:0});
			}
		}

		return door;
	}
	
	

	

	
	
	

	
	

	*/
}