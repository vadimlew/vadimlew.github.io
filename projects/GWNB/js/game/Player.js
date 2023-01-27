LEV.state.player = {};

LEV.state.player.WalkState = function WalkState(player, input) {
	LEV.state.State.call(this);	
	var speed = 0.2;	
	var globalPos = new PIXI.Point();

	this.enter = function() {
		player.animation = 'frontWalk';
	}

	this.handle = function() {
		var nx = 0;
		var ny = 0;

		player.display.getGlobalPosition(globalPos);
		//var sx = input.mouse.x < globalPos.x? -1 : 1;	
		//player.display.scale.set(sx,1);
			
		if (input.keys.left) nx = -1;
		if (input.keys.up) ny = -1;
		if (input.keys.right) nx = 1;
		if (input.keys.down) ny = 1;

		if (nx != 0) player.position.x += speed * nx / (ny != 0? 1.414 : 1);
		if (ny != 0) player.position.y += speed * ny / (nx != 0? 1.414 : 1);

		var dy = input.mouse.y - globalPos.y + 10;
		if (player.animation.name != 'backWalk' && dy < 0) {
			player.animation = 'backWalk';
			//if (player.shooter) 
				//player.display.setChildIndex(player.shooter.gun.display, 1);
		}
		if (player.animation.name != 'frontWalk' && dy > 0) {
			player.animation = 'frontWalk';
			//if (player.shooter) 
				//player.display.setChildIndex(player.shooter.gun.display, 2);
		}
		if (input.anyKeyPress) {
			player.animation.play();
		} else {
			player.animation.gotoAndStop(0);
		}	

		if (input.mouse.right) {
			this.sm.set('JumpState');
		}		
	}
}

LEV.state.player.JumpState = function JumpState(player, input) {
	LEV.state.State.call(this);
	var thisState = this;	
	var speed, nx, ny;
	var globalPos = new PIXI.Point();

	this.enter = function() {
		speed = 1.5;
		dx=0, dy=0;		

		if (input.anyKeyPress) {
			if (input.keys.left) dx = -1;
			if (input.keys.up) dy = -1;
			if (input.keys.right) dx = 1;
			if (input.keys.down) dy = 1;
		} else {
			player.display.getGlobalPosition(globalPos);
			var dx = input.mouse.x - globalPos.x;
			var dy = input.mouse.y - globalPos.y;
		}	

		var dd = Math.sqrt(dx*dx + dy*dy);
		nx = dx/dd;
		ny = dy/dd;	

		player.display.scale.x = nx > 0? 1 : -1;
		
		if (Math.abs(nx) >= 0.95) 
			player.animation = ny > 0? 'frontSideJump' : 'backSideJump';
		else
			player.animation = ny > 0? 'frontJump' : 'backJump';

		player.animation.gotoAndPlay(0);
		player.animation.onComplete = function() {
			thisState.sm.set('WalkState');
		};
		if (player.shooter)
			player.shooter.gun.deactivate(); 
	}

	this.handle = function() {
		speed *= 0.905;
		player.position.x += speed * nx;
		player.position.y += speed * ny;
	}	

	this.exit = function() {	
		player.display.scale.x = 1;	
		player.animation.onComplete = null;
		if (player.shooter)
			player.shooter.gun.activate();
	}	
}

LEV.components.player = function(props) {
	var player = this;
	var input = game.input;	

	var sm = new LEV.state.StateManager();
	sm.add(new LEV.state.player.WalkState(player, input), true);
	sm.add(new LEV.state.player.JumpState(player, input));
	game.pixi.ticker.add(sm.handle);

	player.actor = {
		sm: sm
	}
	
	player.delete.add(function() {
		delete player.actor;			
		game.pixi.ticker.remove(sm.handle);
	}.bind(player));
}