LEV.managers.InputManager = function InputManager(pixi) {
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