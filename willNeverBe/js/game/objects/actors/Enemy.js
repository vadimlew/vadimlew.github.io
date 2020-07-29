Factory.module.Enemy = function (factory, entityManager) {

	factory.enemy = {};
	factory.enemy.crab = function(x,y) {
		return entityManager.create({
			name: 'enemy_crab',	
			position: {x:x, y:y},		
			display: {layer:factory.layer, shadow:[-12,2,25,10], sort:{y:5, h:20}},
			animation: {
				list: [
					{name:'walk', src:'enemy_crab_walk', frames:6, speed:0.2, px:22.5, py:20, goto:0}
				],
				autoplay: false
			},			
			phys: {shape:[-10,-5,20,10], friction:0.7, mass:30, type:'enemy', masks:['wall', 'interior', 'enemy']},
			hitBox: {shape:[-10,-5,20,16], type:'object', masks:['player']},
			life: 150,	
			damage: {value:50, kick:5},		
			//destructible: {parts:[0,0,20,20, 20,0,20,20, 0,20,20,20, 20,20,20,20]},
			destructible: true,
			enemy: {AI:CrabAI, target:'player'},
			debug: {origin:0, hitBox:0, phys:0}
		});
	}

	factory.enemy.mimic = {};
	factory.enemy.mimic_chair = function(x,y) {
		var entity = entityManager.create({
			name: 'mimic_crab',	
			position: {x:x, y:y},	
			display: {layer:factory.layer, shadow:[-15,10,30,15], sort:{y:10, h:30}},			
			animation: {
				list: [
					{name:'show', src:'enemy_robot_chair_show', frames:8, speed:0.1, ax:0.5, ay:0.75, loop:false},
					{name:'hide', src:'enemy_robot_chair_show', frames:8, speed:0.075, ax:0.5, ay:0.75, loop:false, reverse:true},
					{name:'walk', src:'enemy_robot_chair_walk', frames:8, speed:0.05, ax:0.5, ay:0.75}
				],
				autoplay: false
			},			
			phys: {shape:[-10,5,20,15], friction:0.6, mass:200, type:'enemy', masks:['wall', 'interior', 'enemy', 'equipment']},
			hitBox: {shape:[-15,-20,30,20], type:'enemy'},			
			life: 600,			
			destructible: true,
			enemy: {AI:MimicСhairAI, target:'player'},
			debug: {origin:0, hitBox:0, phys:0}
		});

		return entity;
	}	

	function IdleState() {
		LEV.state.State.call(this);
	}

	function SeekState(owner, target, radius, gotoState) {	
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

	function FollowState(owner, target, speed) {
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

	function AI() {
		this.sm = new LEV.state.StateManager();
	}

	function CrabAI(props) {	
		AI.call(this);

		var seekRadius = 100;
		var followSpeed = .3;
		var sm = this.sm;
		var entity = this.entity;
		var target = game.factory.entityManager.getEntityByName(props.target)[0];	
		
		sm.add(new SeekState(entity, target, seekRadius, 'FollowState'));
		sm.add(new FollowState(entity, target, followSpeed));
		sm.set('SeekState');	
	}

	function MimicСhairAI(props) {
		AI.call(this);

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

		sm.add(new SeekState(entity, target, seekRadius, 'AtackState'));
		sm.add(new AtackState(entity, target));
		sm.add(new IdleState());
		sm.set('SeekState');
	}

	LEV.components.enemy = function(props) {
		var enemy = this;
		var actor = {
			entity: enemy
		};

		props.AI.call(actor, props);
		game.pixi.ticker.add(actor.sm.handle);

		this.actor = actor;
		this.delete.add(function() {
			delete this.actor;			
			game.pixi.ticker.remove(actor.sm.handle);
		}.bind(this));
	}
}