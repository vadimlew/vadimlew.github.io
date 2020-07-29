Factory.module.Construct = function(factory, entityManager) {

	factory.construct = {};
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
			display: {image:shape, layer:factory.layer, sort:{y:sort_y}},
			phys: {shape:[0,0,w,h+wall_height], isStatic:true, type:'wall'},
			//phys: {shape:[0,wall_height,w,h], isStatic:true, type:'wall'},
			hitBox: {shape:[0,0,w,h+wall_height/2], type:'obstacle'},
			debug: {hitBox:0, phys:0}
		});		
	}

	/*factory.construct.door = function(x,y,type) {
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
	}*/

}