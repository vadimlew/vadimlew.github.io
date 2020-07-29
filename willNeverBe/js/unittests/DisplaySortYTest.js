function DisplaySortYTest(pixi) {	
	var display = new PIXI.Container();
	var input = new InputManager(pixi);
	pixi.stage.addChild(display);	

	var player = getSprite(100,100,15,0xaa0000);
	getSprite(20,10,0,0x00aa00);
	getSprite(25,20,0,0x00aa00);
	getSprite(30,30,0,0x00aa00);
	getSprite(40,50,0,0x00aa00);
	getSprite(150,150,0,0x00aa00);
	getSprite(160,180,0,0xaaaa00);
	getSprite(180,185,0,0x00aa00);
	getSprite(170,220,0,0xaa00aa);
	getSprite(250,150,15,0x0000aa);//1
	getSprite(260,160,15,0xaaaa00);//2
	getSprite(270,190,0,0xaa00aa);

	var table = getTable(220,150,0,100,50,20);

	pixi.ticker.add(update);
	function update() {
		if (input.keys.left) player.x += -1;
		if (input.keys.up) player.y += -1;
		if (input.keys.right) player.x += 1;
		if (input.keys.down) player.y += 1;
		display.children.sort(sortY);		
	}

	function sortY(d1, d2) {
		if (d1.y+d1.z > d2.y+d2.z) return 1;
		if (d1.y+d1.z < d2.y+d2.z) return -1;
		return 0;
	}

	function getSprite(x,y,z,color,w=30,h=50) {
		var shape = new PIXI.Graphics();
		shape.beginFill(color);
		shape.drawRect(0, 0, w, -h);
		shape.beginFill(0x00ff00);
		shape.drawCircle(0,0,2);
		shape.position.set(x,y);
		shape.z = z;			
		display.addChild(shape);
		return shape;
	}

	function getTable(x,y,z,w=30,h=50,alt=0) {
		var container = new PIXI.Container();
		var shape = new PIXI.Graphics();
		shape.beginFill(0x999999);
		shape.drawRect(0, 0, w, h-alt);
		shape.beginFill(0x777777);
		shape.drawRect(0, h-alt, w, alt);
		shape.y = -alt;
		var circ = new PIXI.Graphics();
		circ.beginFill(0x00ff00);
		circ.drawCircle(0,0,2);		
		container.position.set(x,y);
		container.z = z;
		container.addChild(shape);		
		container.addChild(circ);		
		display.addChild(container);		
		return container;
	}
}

function InputManager(pixi) {
	var keys = {
		left: false,
		up: false,
		right: false,
		down: false		
	}
	var mouse = new PIXI.Point(0,0);
	mouse.left = false;
	mouse.right = false;

	addEventListener('keydown', keyDownHandler);
	function keyDownHandler(e) {
		//console.log(e.code);		
		switch(e.code) {
			case 'KeyA':
			case 'ArrowLeft':
				e.preventDefault(); 
				keys.left = true;
				keys.pressed = true;
				break;
			case 'KeyW':
			case 'ArrowUp':
				e.preventDefault(); 
				keys.up = true;
				keys.pressed = true;
				break;
			case 'KeyD':
			case 'ArrowRight':
				e.preventDefault(); 
				keys.right = true;
				keys.pressed = true;
				break;
			case 'KeyS':
			case 'ArrowDown':
				e.preventDefault(); 
				keys.down = true;
				keys.pressed = true;
				break;
		}		
	}

	addEventListener('keyup', keyUpHandler);
	function keyUpHandler(e) {
		switch(e.code) {
			case 'KeyA':
			case 'ArrowLeft':
				keys.left = false;
				keys.pressed = false;
				break;
			case 'KeyW':
			case 'ArrowUp':
				keys.up = false;
				keys.pressed = false;
				break;
			case 'KeyD':
			case 'ArrowRight':
				keys.right = false;
				keys.pressed = false;
				break;
			case 'KeyS':
			case 'ArrowDown':
				keys.down = false;
				keys.pressed = false;
				break;
		}
	}

	pixi.view.addEventListener('mousedown', function(e) {
		if (e.which == 1) mouse.left = true;
		if (e.which == 3) mouse.right = true;
	});

	pixi.view.addEventListener('mouseup', function(e) {
		if (e.which == 1) mouse.left = false;
		if (e.which == 3) mouse.right = false;
	});

	pixi.view.addEventListener('contextmenu', function(e) {
		e.preventDefault(); 	  
		return false;
	}, false);

	pixi.stage.interactive = true; 
	pixi.stage.on('mousemove', function(e) {
		mouse.x =  e.data.global.x;
		mouse.y =  e.data.global.y;
	});

	Object.defineProperty(this, 'anyKeyPress', {
		get: function() {
			for(var prop in keys) {
				if (keys[prop]) return true;
			}
			return false;				
		}
	});

	this.keys = keys;
	this.mouse = mouse;
}