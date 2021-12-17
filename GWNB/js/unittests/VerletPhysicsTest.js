js.include('lev.GameEngine');
js.include('lev.phys.VerletPhysics');

function VerletPhysicsTest(pixi) {	
	var display = new PIXI.Graphics();
	pixi.stage.addChild(display);

	var time = new LEV.managers.TimeManager(pixi);
	var verlet = new LEV.physics.VerletPhysics();	
	var input = new LEV.managers.InputManager(pixi);

	var ox = 100;
	var oy = 100;

	console.log('___________________________________< VerletPhysicsTest >_____________________________________');
	console.log('> create player entity');
	var player = {};
	LEV.components.delete.call(player);
	LEV.components.name.call(player, 'player');
	LEV.components.event.call(player);
	LEV.components.position.call(player, {x:10, y:15});
	LEV.components.phys.call(player, {
		shape: LEV.shapes.Shape.fromArray([-5,-5,10,10, 5,5,10,10, 5,-15,10,10/*, 15,-5,10,10*/]),
		friction:0.85,
		mass:2,
		type: 'player',
		masks: ['enemy', 'obstacle']
	});
	console.log(player);
	drawShape(player.phys.shape);

	console.log('> create enemy entity');
	var enemy = {};
	LEV.components.delete.call(enemy);
	LEV.components.name.call(enemy, 'enemy');
	LEV.components.event.call(enemy);
	LEV.components.position.call(enemy, {x:20, y:15});
	LEV.components.phys.call(enemy, {
		shape:[-5,-5,10,10],		
		friction:0.95, 
		mass:2,
		type: 'enemy',
		masks: ['player', 'obstacle']
	});	
	console.log(enemy);	
	drawShape(enemy.phys.shape);	

	console.log('> create obstacle entity');
	var obstacle = {};
	LEV.components.delete.call(obstacle);
	LEV.components.name.call(obstacle, 'obstacle');
	LEV.components.event.call(obstacle);
	LEV.components.position.call(obstacle, {x:0, y:0});
	LEV.components.phys.call(obstacle, {
		shape: LEV.shapes.Shape.fromArray([-10,-10,100,10, -10,50,90,10, -10,-10,10,30, -10,30,10,30, 100,-10,10,30, 100,30,10,30]),
		isStatic: true,
		type: 'obstacle',
		masks: ['player', 'enemy']
	});	
	console.log(obstacle);	
	drawShape(obstacle.phys.shape);	

	console.log('> create obstacle entity');
	var obstacle2 = {};
	LEV.components.delete.call(obstacle2);
	LEV.components.name.call(obstacle2, 'obstacle2');
	LEV.components.event.call(obstacle2);
	LEV.components.position.call(obstacle2, {x:0, y:0});
	LEV.components.phys.call(obstacle2, {
		shape: LEV.shapes.Shape.fromArray([80,50,20,10]),
		isStatic: true,
		type: 'obstacle'		
	});	
	console.log(obstacle2);	
	drawShape(obstacle2.phys.shape);

	function update() {
		verlet.update();
		display.clear();
		drawShape(enemy.phys.shape, 0xaa0000);
		drawShape(player.phys.shape, 0x00aa00);
		drawShape(obstacle.phys.shape);
		drawShape(obstacle2.phys.shape, 0x0000aa);

		if (input.keys.left) player.position.x += -.15;
		if (input.keys.up) player.position.y += -.15;
		if (input.keys.right) player.position.x += .15;
		if (input.keys.down) player.position.y += .15;			
	}	

	time.add(update);

	console.log('_____________________________________________________________________________________________');

	function drawShape(shape, color=0x000000) {	
		//origin
		display.lineStyle(1, 0xff0000);
		display.drawRect(ox-1,oy-1,2,2);		

		//shape
		display.lineStyle(1, color);		
		for (var i = 0; i < shape.rects.length; i++) {				
			var rect = shape.rects[i];
			display.drawRect(ox + shape.x + rect.x, oy + shape.y + rect.y, rect.width, rect.height);
		}		
	}
}