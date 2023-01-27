js.include('lev.collision.3d.CollisionManager3D');

function CollisionManager3DTest(pixi) {
	var display = new PIXI.Graphics();
	pixi.stage.addChild(display);

	var ox = 100;
	var oy = 100;

	console.log('___________________________________< CollisionManager3DTest >__________________________________');

	var collision = new LEV.managers.CollisionManager3D();

	console.log('> create player entity');
	var player = {};
	LEV.components.delete.call(player);
	LEV.components.name.call(player, 'player');	
	LEV.components.collision3D.call(player, {
		shape:[0,0,0,10,10,50],
		type: 'player',
		masks: ['enemy']
	});
	player.collision3D.collObj.event.on(LEV.event.COLLIDE, onCollision);
	console.log(player);
	drawShape(player.collision3D.shape, 0x00aa00);

	console.log('> create enemy entity');
	var enemy = {};
	LEV.components.delete.call(enemy);
	LEV.components.name.call(enemy, 'enemy');	
	LEV.components.collision3D.call(enemy, {
		shape: LEV.shapes.Shape3d.fromArray([0,0,30,10,10,10]),
		type: 'enemy',
		masks: ['player']
	});
	enemy.collision3D.collObj.event.on(LEV.event.COLLIDE, onCollision);
	console.log(enemy);	
	drawShape(enemy.collision3D.shape, 0xaa0000);
		
	function onCollision(wrap) {
		trace('intersect with ' + wrap.entity.name);
	}		

	//collision.add(player, player.shape, 'player', ['enemy']);
	//collision.add(enemy, enemy.shape, 'enemy', ['player']);
	console.log('> collision test');
	collision.test();

	console.log('> remove player from collision');
	console.log('before: ', collision.pairs, collision.shapes);
	collision.remove(player);
	console.log('after: ', collision.pairs, collision.shapes);

	console.log('> enemy.delete()');
	console.log('before: ', collision.pairs, collision.shapes);
	enemy.delete();
	console.log('after: ', collision.pairs, collision.shapes);
	console.log('enemy: ', enemy);

	console.log('_____________________________________________________________________________________________');

	function drawShape(shape, color=0x000000) {	
		//origin
		display.lineStyle(1, 0xff0000);
		display.drawRect(ox-1,oy-1,2,2);
		pixi.stage.addChild(display);

		//shape
		display.lineStyle(1, color);		
		for (var i = 0; i < shape.rects.length; i++) {				
			var rect = shape.rects[i];
			display.drawRect(ox + shape.x + rect.x, oy + shape.y + rect.y - shape.z - rect.z, rect.width, rect.height);			
			display.drawRect(ox + shape.x + rect.x, oy + shape.y + rect.y - shape.z - rect.z - rect.altitude + rect.height, rect.width, rect.altitude);
			display.drawRect(ox + shape.x + rect.x, oy + shape.y + rect.y - shape.z - rect.z - rect.altitude, rect.width, rect.height);
		}		
	}
}
