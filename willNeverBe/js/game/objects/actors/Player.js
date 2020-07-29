Factory.module.Player = function(factory, entityManager) {

	factory.player = {};
	factory.player.designer = function(x,y) {
		var player = entityManager.create({
			name: 'player',	
			position: {x:x, y:y},		
			display: {layer:factory.layer, shadow:[-10,-5,20,10], sort:{y:0}},
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
			phys: {shape:[-10,-5,20,10], friction:0.85, mass:60, gravity:factory.gravity, type:'player', masks:['wall', 'interior', 'enemy', 'equipment']},
			shooter: {gun:'pistol'},
			hitBox: {shape:[-10,-15,20,10], type:'player'},
			life: 200,	
			//destructible: true,
			player: true,
			//dropShadow:[-10,-5,20,10],			
			//carrier: {},
			debug: /*debug/*/{origin:0, hitBox:0, phys:0, sort:0}//*/
		});		

		return player;
	}

	function WalkState(player, input) {
		LEV.state.State.call(this);	
		var speed = 0.4;	
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
				player.animation.gotoAndStop(2);
			}	

			if (input.mouse.right) {
				this.sm.set('JumpState');
			}		
		}
	}

	function JumpState(player, input) {
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
		sm.add(new WalkState(player, input), true);
		sm.add(new JumpState(player, input));
		game.pixi.ticker.add(sm.handle);

		player.actor = {
			sm: sm
		}
		this.delete.add(function() {
			delete this.actor;			
			game.pixi.ticker.remove(sm.handle);
		}.bind(this));
	}
}