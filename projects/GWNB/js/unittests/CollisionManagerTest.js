js.include('lev.collision.2d.CollisionManager');

function CollisionManagerTest(pixi) {
	var display = new PIXI.Graphics();
	pixi.stage.addChild(display);

	var ox = 100;
	var oy = 100;

	console.log('___________________________________< CollisionManagerTest >__________________________________');

	var collision = new LEV.managers.CollisionManager();

	console.log('> create player entity');
	var player = {};
	LEV.components.delete.call(player);
	LEV.components.name.call(player, 'player');	
	LEV.components.collision.call(player, {
		shape:[0,0,100,100],
		type: 'player',
		mask: ['enemy']
	});
	player.collision.collObj.event.on(LEV.event.COLLIDE, onCollision);
	console.log(player);	
	drawShape(player.collision.shape, 0x00aa00);

	console.log('> create enemy entity');
	var enemy = {};
	LEV.components.delete.call(enemy);
	LEV.components.name.call(enemy, 'enemy');	
	LEV.components.collision.call(enemy, {
		shape: LEV.shapes.Shape.fromArray([-5,-5,10,10]),
		type: 'enemy',
		mask: ['player']
	});
	enemy.collision.collObj.event.on(LEV.event.COLLIDE, onCollision);
	console.log(enemy);	
	drawShape(enemy.collision.shape, 0xaa0000);
		
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
			display.drawRect(ox + shape.x + rect.x, oy + shape.y + rect.y, rect.width, rect.height);		
		}		
	}
}
