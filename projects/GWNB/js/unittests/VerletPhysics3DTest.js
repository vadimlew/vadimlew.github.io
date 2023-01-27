js.include('lev.GameEngine');
js.include('lev.phys.VerletPhysics3D');
js.include('lev.display.DisplayManager');

function VerletPhysics3DTest(pixi) {
	var time = new LEV.managers.TimeManager(pixi);
	var verlet = new LEV.physics.VerletPhysics3D();	
	var input = new LEV.managers.InputManager(pixi);
	var display = new LEV.managers.DisplayManager(pixi);
	var floor = display.layer.create('floor');
	var floor = display.layer.create('game');

	var obstacleCount = 1;
	var ox = 300;
	var oy = 200;

	console.log('___________________________________< VerletPhysics3DTest >_____________________________________');
	console.log('> create player entity');
	var player = {};
	LEV.components.delete.call(player);
	LEV.components.name.call(player, 'player');	
	LEV.components.position3D.call(player, {x:ox+30, y:oy+30, z:100});	
	LEV.components.phys3D.call(player, {
		shape: [-5,-5,0,10,10,10/*, 15,-5,0,10,10,10, 5,-15,0,10,10,10/*, 15,-5,10,10*/],
		friction:0.85,
		mass:2,
		type: 'player',
		masks: ['enemy', 'obstacle']
	});
	LEV.components.display.call(player, {image: drawShape(player.phys3D.shape, 0x00aa00), layer:'game', sortY:5});	
	LEV.components.castShadow.call(player, {shape:[-5,-5,10,10], layer:'floor'});
	//LEV.components.castShadow.call(player, {shape:[15,-5,10,10], layer:'floor'});
	//LEV.components.castShadow.call(player, {shape:[5,-15,10,10], layer:'floor'});

	console.log('> create enemy entity');
	var enemy = {};
	LEV.components.delete.call(enemy);
	LEV.components.name.call(enemy, 'enemy');
	LEV.components.event.call(enemy);
	LEV.components.position3D.call(enemy, {x:ox+40, y:oy+30, z:10});
	LEV.components.phys3D.call(enemy, {
		shape:[-5,-5,0,10,10,10],		
		friction:0.95, 
		mass:2,
		type: 'enemy',
		masks: ['player', 'obstacle']
	});	
	LEV.components.display.call(enemy, {image: drawShape(enemy.phys3D.shape, 0xaa0000), layer:'game', sortY:5});
	console.log(enemy);	

	createObstacle(0,0,0,100,10,10);
	createObstacle(0,10,0,10,80,10);
	createObstacle(0,90,0,45,10,10);
	createObstacle(55,90,0,45,10,10);
	createObstacle(100,0,0,100,100,10);
	createObstacle(110,20,10,80,70,10);
	createObstacle(120,40,20,60,40,10);
	
	var count = 0;
	function update() {
		if (input.keys.left) player.position3D.x += -.15;
		if (input.keys.up) player.position3D.y += -.15;
		if (input.keys.right) player.position3D.x += .15;
		if (input.keys.down) player.position3D.y += .15;

		if (count <= 0 && input.mouse.right) {
			player.position3D.z += 5;
			count = 30;
		} else {
			count--;
		}				
	}	

	time.add(verlet.update);
	time.add(display.update);
	time.add(update);

	console.log('_____________________________________________________________________________________________');

	function drawShape(shape, color=0x000000) {	
		var graphic = new PIXI.Graphics();			

		//shape
		graphic.lineStyle(1, color);		
		for (var i = 0; i < shape.rects.length; i++) {				
			var rect = shape.rects[i];
			graphic.beginFill(0xffffff);
			graphic.drawRect(rect.x, rect.y - rect.z, rect.width, rect.height);			
			graphic.drawRect(rect.x, rect.y - rect.z - rect.altitude + rect.height, rect.width, rect.altitude);
			graphic.drawRect(rect.x, rect.y - rect.z - rect.altitude, rect.width, rect.height);
			graphic.endFill();
		}	

		//graphic.lineStyle(1, 0xff0000);
		//graphic.drawRect(-1,-1,2,2);		

		return graphic;		
	}
	
	function createObstacle(x,y,z,w,h,a, color=0x000000) {
		console.log('> create obstacle entity');	
		var obstacle = {};
		LEV.components.delete.call(obstacle);
		LEV.components.name.call(obstacle, 'obstacle' + obstacleCount);		
		LEV.components.position3D.call(obstacle, {x:ox+x, y:oy+y, z:z});
		LEV.components.phys3D.call(obstacle, {
			shape: [0,0,0,w,h,a],
			isStatic: true,
			type: 'obstacle'			
		});	
		LEV.components.display.call(obstacle, {image: drawShape(obstacle.phys3D.shape), layer:'game', sortY:1});
		console.log(obstacle);	
		obstacleCount++;	
	}
}