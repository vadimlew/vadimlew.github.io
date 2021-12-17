function Enemy() {};

Enemy.states = {};

Enemy.states.IdleState = function IdleState() {
	LEV.state.State.call(this);
}

Enemy.states.SeekState = function SeekState(owner, target, radius, gotoState) {	
	LEV.state.State.call(this);

	var rad2 = radius*radius;
	var thisState = this;

	this.enter = function() {
		owner.animation.gotoAndStop(0);		
		owner.hitBox.collObj.event.on(LEV.event.START_COLLIDE, onBulletHit);				
	}

	function onBulletHit(collObjB) {
		if (collObjB.type != 'player_bullet') return;
		thisState.sm.set(gotoState);
	}

	this.handle = function() {	
		if (!target.position) return;

		var dx = target.position.x - owner.position.x;
		var dy = target.position.y - owner.position.y;
		var dd2 = dx*dx + dy*dy;
		if (dd2 < rad2) {			
			this.sm.set(gotoState);
		}
	}	

	this.exit = function() {
		owner.hitBox.collObj.event.off(LEV.event.START_COLLIDE, onBulletHit);
	}
}

Enemy.states.FollowState = function FollowState(owner, target, speed) {
	LEV.state.State.call(this);	

	this.enter = function() {
		owner.animation.play();
	}

	this.handle = function() {	
		if (!target || !target.position) return;	

		var dx = target.position.x - owner.position.x;
		var dy = target.position.y - owner.position.y;
		var dd2 = dx*dx + dy*dy;
		var dd = Math.sqrt(dd2);
		var nx = dx/dd;
		var ny = dy/dd;
		owner.position.x += nx * speed;
		owner.position.y += ny * speed;
	}	
}

Enemy.AI = function() {
	this.sm = new LEV.state.StateManager();
}

Enemy.CrabAI = function(props) {	
	Enemy.AI.call(this);

	var seekRadius = 100;
	var followSpeed = .3;
	var sm = this.sm;
	var entity = this.entity;
	var target = game.factory.entityManager.getEntityByName(props.target)[0];	
	
	sm.add(new Enemy.states.SeekState(entity, target, seekRadius, 'FollowState'));
	sm.add(new Enemy.states.FollowState(entity, target, followSpeed));
	sm.set('SeekState');	
}

Enemy.MimicСhairAI = function(props) {
	Enemy.AI.call(this);

	var seekRadius = 150;
	var sm = this.sm;
	var entity = this.entity;
	var target = game.factory.entityManager.getEntityByName(props.target)[0];
	

	function AtackState(owner, target) {
		LEV.state.State.call(this);

		var thisState = this;
		var followSpeed = .03;
		var reloadTime  = 0;
		var reloadTimeMax = 30;		
		var bulletSpeed = 7;
		//var bulletDamage = 50;
		//var bulletKick = 2;
		var minDistance = 30;
		var globalMuzzle = new PIXI.Point();
		var ready = false;

		var bulletProps = {
			x:0, 
			y:0, 
			vx:0, 
			vy:0, 
			damage:50,
			kick: 1,
			bullet_type: 'enemy_bullet',
			bullet_mask: ['object', 'obstacle', 'player'],
			size: 6
		};

		var head = PIXI.AnimatedSprite.fromImages([
			'enemy_robot_chair_head_front.png',
			'enemy_robot_chair_head_right.png',
			'enemy_robot_chair_head_left.png'
		]);
		head.anchor.set(0.5,0.75);

		var arm_left = PIXI.Sprite.from('enemy_robot_chair_arm_left.png');
		arm_left.pivot.set(5,0);
		arm_left.position.set(-15,-5);		
		arm_left.rotation = Math.PI/2;
		arm_left.muzzle = new PIXI.Point(20,2);	

		var arm_right = PIXI.Sprite.from('enemy_robot_chair_arm_right.png');
		arm_right.pivot.set(5,10);
		arm_right.position.set(15,-5);		
		arm_right.rotation = Math.PI/2;
		arm_right.muzzle = new PIXI.Point(20,7);				

		this.enter = function() {
			target.life.event.on(LEV.event.LIFE_OVER, target_life_over);

			function target_life_over() {
				ready = false;
				owner.display.removeChild(head);
				owner.display.removeChild(arm_left);
				owner.display.removeChild(arm_right);
				owner.animation = 'hide';
				owner.animation.play();
				owner.animation.onComplete = function() {					
					thisState.sm.set('IdleState');
				}
			}

			owner.animation.onComplete = function() {	
				owner.animation = 'walk';
				owner.animation.play();
				
				owner.display.addChild(head);
				owner.display.addChild(arm_left);
				owner.display.addChild(arm_right);

				//owner.hitArea = [-10,-5,20,15];
				ready = true;
			}
			owner.animation.play();
		}

		this.handle = function() {	
			if (!ready) return;

			var dx = target.position.x - owner.position.x;
			var dy = target.position.y - owner.position.y;
			var dd2 = dx*dx + dy*dy;	

			//head
			head.gotoAndStop(0);
			if (dx > 50) head.gotoAndStop(1);		
			if (dx < -50) head.gotoAndStop(2);	

			//move
			var dd = Math.sqrt(dd2);			

			if (dd > minDistance) {
				var nx = dx/dd;
				var ny = dy/dd;
				owner.position.x += nx * followSpeed;
				owner.position.y += ny * followSpeed;	
				owner.animation.play();
			} else {
				owner.animation.stop();
			}	

			//fire			
			arm_right.rotation = Math.atan2(dy,dx);
			arm_left.rotation = Math.atan2(dy,dx);			

			/*if (dy > 0) {
				arm_left.position.set(-15,-5);		
				arm_right.position.set(15,-5);
				owner.sprite.setChildIndex(arm_left, 6);
				owner.sprite.setChildIndex(arm_right, 7);
			} else {
				arm_left.position.set(15,-5);		
				arm_right.position.set(-15,-5);
				owner.sprite.setChildIndex(arm_left, 0);
				owner.sprite.setChildIndex(arm_right, 1);
			}*/

			reloadTime++;
			if (reloadTime >= reloadTimeMax) {
				fire(arm_right);
				fire(arm_left);
				reloadTime = 0;
			}			
		}

		function fire(gun) {
				gun.toGlobal(gun.muzzle, globalMuzzle);
				var cos = Math.cos(gun.rotation);
				var sin = Math.sin(gun.rotation);				
				
				bulletProps.x = globalMuzzle.x;
				bulletProps.y = globalMuzzle.y;
				bulletProps.vx = bulletSpeed*cos;
				bulletProps.vy = bulletSpeed*sin;				

				var bullet = game.factory.bullet(bulletProps);			
		}

		this.exit = function() {
			owner.animation = 'show';
			owner.animation.gotoAndStop(0);
		}
	}	

	sm.add(new Enemy.states.SeekState(entity, target, seekRadius, 'AtackState'));
	sm.add(new AtackState(entity, target));
	sm.add(new Enemy.states.IdleState());
	sm.set('SeekState');
}

LEV.components.enemy = function(props) {
	var enemy = this;
	var actor = {
		entity: enemy
	};	

	props.ai.call(actor, props);
	game.pixi.ticker.add(actor.sm.handle);

	this.actor = actor;
	this.delete.add(function() {
		delete this.actor;			
		game.pixi.ticker.remove(actor.sm.handle);
	}.bind(this));
}