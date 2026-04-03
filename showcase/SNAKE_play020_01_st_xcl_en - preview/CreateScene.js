function createScene() {	
	init3dScene();	
	init2dScene();	
}

function init3dScene() {
	app.obj3d.main = new THREE.Group();
	app.scene3d.add(app.obj3d.main);
	app.template = new Template();	
	
	initVerletPhys();
	initCamera();
	initLights();
	initMaterials();
	initWorld();
	initWater();
	initHero();	
	initEnemies();
	initFood();
	initPhys();
}

function initCamera() {	
	app.camera3d = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 1000);

	app.camera3d.posTo = new THREE.Vector3(0, 20, 15);
	app.camera3d.lookTo = new THREE.Vector3(0, 0, 5);
	app.camera3d.lookNow = app.camera3d.lookTo.clone();
	app.camera3d.isPortraite = true;

	app.camera3d.position.copy(app.camera3d.posTo);
	app.camera3d.lookAt(app.camera3d.lookTo);
	app.camera3d.updateProjectionMatrix();	
}

function initLights() {
	let lightAmbient = new THREE.AmbientLight(0xffffff, 0.8);
	app.obj3d.lightAmbient = lightAmbient;
	app.obj3d.main.add(lightAmbient);

	let lightDirectional = new THREE.DirectionalLight(0xffffff, 0.8);
	lightDirectional.position.set(-5, 20, -8);
	lightDirectional.castShadow = true;
	app.obj3d.lightDirectional = lightDirectional;
	app.obj3d.main.add(lightDirectional);

	lightDirectional.shadow.camera.left = -22;
	lightDirectional.shadow.camera.right = 22;
	lightDirectional.shadow.camera.top = 22;
	lightDirectional.shadow.camera.bottom = -22;
	lightDirectional.shadow.radius = 2;

	lightDirectional.shadow.mapSize.width = 1024;
	lightDirectional.shadow.mapSize.height = 1024;
}

function initMaterials() {
	for (let textureName in assets.textures.three) {
		let texture = assets.textures.three[textureName];
		setTextureDefaultSettings(texture);
	}

	app.material.island = new THREE.MeshLambertMaterial({
		map: assets.textures.three['texture_island']		
	});

	app.material.snake1 = new THREE.MeshLambertMaterial({
		map: assets.textures.three['texture_snake1']		
	});

	app.material.snake2 = new THREE.MeshLambertMaterial({
		map: assets.textures.three['texture_snake2']		
	});

	app.material.snake3 = new THREE.MeshLambertMaterial({
		map: assets.textures.three['texture_snake3']		
	});

	app.material.snake4 = new THREE.MeshLambertMaterial({
		map: assets.textures.three['texture_snake4']		
	});

	app.material.food = new THREE.MeshLambertMaterial({
		map: assets.textures.three['happy_mill'],
		transparent: true
	});	

	app.material.outline = new THREE.MeshBasicMaterial({
        color:0xffffff,
        side: THREE.BackSide
    });

	app.material.ground = new THREE.MeshLambertMaterial({
		map: assets.textures.three['texture_ground_green']		
	});

	app.material.water = new THREE.MeshBasicMaterial({
		map: assets.textures.three['texture_water']
	});

	app.material.gem = new THREE.MeshPhongMaterial({
		map: assets.textures.three['texture_island'],
		shininess: 80,
		specular: 0xffffff,
		combine: THREE.MultiplyBlending
	});

	app.material.foam = new THREE.MeshBasicMaterial({
		map: assets.textures.three['texture_foam'],
		depthWrite: false,
		transparent: true
	});	

	app.material.shine = new THREE.SpriteMaterial({
		map: assets.textures.three['texture_shine'],
		depthWrite: false, 		
		transparent: true,
		//combine: THREE.AddOperation
		//opacity: 0.75,
		//color:0xfff000
	});
}

function setTextureDefaultSettings(texture, magFilter=THREE.NearestFilter) {
	texture.magFilter = magFilter;
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.flipY = false;
	texture.encoding = THREE.sRGBEncoding;
}

function initWorld() {
	let world = assets.models.world;
	app.obj3d.world = world;
	app.obj3d.main.add(world);

	world.traverse((obj) => {
		obj.castShadow = true;
		obj.material = app.material.island;
		
		if (obj.name == 'Water') obj.material = app.material.water;
		if (obj.name == 'Foam') obj.material = app.material.foam;
		if (obj.name == 'Ground') obj.material = app.material.ground;		
		if (obj.name == 'HappyMeal') obj.material = app.material.food;		
	});

	app.obj3d.ground = world.getObjectByName('Ground');
	app.obj3d.ground.receiveShadow = true;	
}

function initWater() {
	let world = app.obj3d.world;	

	let foam = world.getObjectByName('Foam');
	foam.scale.set(1.01, 1, 1.01);
	gsap.to(foam.scale, 1, {x:1.04, z:1.04, repeat:-1, yoyo:true, ease:'sine.inOut'});
	gsap.to(foam.rotation, 40, {y:2*Math.PI, repeat:-1, ease:'none'});

	let water = world.getObjectByName('Water');
	let maxDist = 0;

	water.vertices = [];

	for (let i = 0; i < water.geometry.attributes.position.count; i++) {
		let vertex = new THREE.Vector3();
		vertex.fromBufferAttribute(water.geometry.attributes.position, i);			

		vertex.x += 1.0 - 2.0 * Math.random();
		vertex.z += 1.0 - 2.0 * Math.random();

		vertex.homeX = vertex.x;
		vertex.homeZ = vertex.z;
		
		vertex.angle = Math.ceil(50 - 100 * Math.random() + 20 * vertex.x + 5 * vertex.z);
		vertex.dist = Math.abs(vertex.x) + Math.abs(vertex.z);

		water.vertices.push(vertex);

		if (maxDist < vertex.dist) {
			maxDist = vertex.dist;
		}
	}	

	for (let i = 0; i < water.vertices.length; i++) {	
		let vertex = water.vertices[i];	
		vertex.dist = (maxDist - vertex.dist) / maxDist;
		if (vertex.dist < 0.3) {
			vertex.dist = 0;
		}
	}

	water.update = function() {
		water.vertices.forEach((vertex, i) => {
			if (vertex.dist != 0) {
				vertex.angle += 2.0;

				if (vertex.angle >= 360) vertex.angle -= 360;							
				
				vertex.x = vertex.homeX + vertex.dist * Math.cos(vertex.angle * toRAD);
				vertex.z = vertex.homeZ - vertex.dist * Math.sin(vertex.angle * toRAD);	
			}

			water.geometry.attributes.position.array[i*3] = vertex.x; 
			water.geometry.attributes.position.array[i*3+1] = vertex.y; 
			water.geometry.attributes.position.array[i*3+2] = vertex.z; 
		});

		water.geometry.attributes.position.needsUpdate = true;		
	}	
	
	app.update.push(water.update);	
}

function initHero() {
	let hero = createSnake(1, {x:0, y:0, z:5});
	hero.name = 'player';
	hero.score = 0;	
	hero.speed = 0.25;	
	app.obj3d.hero = hero;
	app.obj3d.main.add(hero);

	let time = 0;	
	hero.demo = function () {
		if (app.stateGame == 'game' || app.stateGame == 'fail') return;

		if (app.isDemoFail) {
			let enemy = app.enemies[0];
			let dx = enemy.position.x - hero.position.x;
			let dz = enemy.position.z - hero.position.z;
			hero.rotation.y = Math.atan2(dx, dz);
			return;
		}

		time += Math.random();
		if (time > 30) {
			time = 0;
			let angle = Math.atan2(-hero.position.x, -hero.position.z);
			gsap.to(hero.rotation, 1, {y:angle});
		}		
	}

	app.update.push(hero.demo);
}

function initEnemies() {
	let enemies = [];	
	app.enemies = enemies;		

	let pos = [
		{x: -6, y:0, z: 0},
		{x: 6, y:0, z: 0},
		{x: 0, y:0, z: -6},
	]	

	let angles = [
		Math.PI / 2,
		-Math.PI / 2,
		2*Math.PI,
	]

	for (let i=2; i <= 4; i++) {
		let position = pos[i-2];
		let angle = angles[i-2];

		let enemy = createSnake(i, position, angle);
		enemy.name = 'enemy';
		enemy.toAngle = angle + Math.PI/2;		
		enemy.rotation.y = enemy.toAngle;
		enemy.speed = 0;		
		enemy.score = 0;	
		enemy.target = null;
		enemy.movement = movement;		

		app.obj3d.main.add(enemy);
		enemies.push(enemy);		
	}	
}


function createSnake(id, position, angle = Math.PI) {
	let material = app.material['snake' + id];

	let snake = new THREE.Object3D();	
	snake.frustumCulled = false;
	snake.rotation.y = angle;
	snake.material = material;
	snake.eated = 0;	
	snake.bones = [];	
	
	if (position != undefined) {
		snake.position.x = position.x;
		snake.position.y = position.y;
		snake.position.z = position.z;		
	}	
	
	let head = new THREE.Object3D();	
	head.frustumCulled = false;
	head.mesh = assets.models.snake.getObjectByName('SnakeHead').clone();
	head.mesh.frustumCulled = false;
	head.mesh.material = material;
	head.mesh.castShadow = true;
	head.mesh.visible = true;
	head.mesh.position.set(0,0,0);
	head.add(head.mesh);
	snake.head = head;

	let crown = assets.models.snake.getObjectByName('Crown').clone();
	crown.visible = false;
	crown.traverse(obj => {
		obj.material = app.material.gem;
	});	
	gsap.to(crown.rotation, 8, {y: 2*Math.PI, ease: 'none', repeat: -1});
	head.add(crown);

	let shine = new THREE.Sprite( app.material.shine );
	shine.scale.set(1.2, 1.2, 1.2);
	shine.position.y = 0.25;
	crown.add( shine );

	snake.crown = crown;

	addAnimationMixer( head.mesh, assets.models.snake.v_data.animations, THREE.LoopOnce );
	head.mesh.anim.action['eat'] = head.mesh.anim.action['snake eat.001'];
	delete head.mesh.anim.action['snake eat.001'];	

	let bodyModel = assets.models.snake.getObjectByName('SnakeBody');
	let body = THREE.SkeletonUtils.clone(bodyModel);
	body.mesh = body.getObjectByName('Body');
	body.frustumCulled = false;
	body.mesh.frustumCulled = false;
	body.mesh.material = material;
	body.mesh.castShadow = true;
	body.visible = true;
	body.mesh.visible = true;
	body.position.set(0,0,0);
	snake.body = body;
	head.add(body);	

	let tailModel = assets.models.snake.getObjectByName('SnakeTail');
	let tail = THREE.SkeletonUtils.clone(tailModel);
	tail.frustumCulled = false;
	tail.mesh = tail.getObjectByName('Tail');
	tail.mesh.frustumCulled = false;		
	tail.mesh.material = material;
	tail.mesh.castShadow = true;
	tail.visible = true;
	tail.mesh.visible = true;	
	snake.tail = tail;
	head.add(tail);		

	tail.mesh.skeleton.bones[0].rotation.set(0,0,0);
	tail.mesh.skeleton.bones[2].rotation.set(0,0,0);

	tail.mesh.skeleton.bones[0].position.y = 0.5;
	tail.mesh.skeleton.bones[2].position.y = 0.48;

	body.mesh.skeleton.bones[1].add(tail.mesh.skeleton.bones[0]);
	body.mesh.skeleton.bones[1].add(tail.mesh.skeleton.bones[2]);	

	snake.bones.push(
		body.mesh.skeleton.bones[0],
		body.mesh.skeleton.bones[1],		
		tail.mesh.skeleton.bones[0],
		tail.mesh.skeleton.bones[1],
	);	

	addPhysParts(snake);

	snake.parts[1].frustumCulled = false;
	snake.parts[1].add(head);	

	snake.destroy = function() {
		let id = app.update2.indexOf(snake.update);
		app.update2.splice(id, 1);

		snake.parts.forEach( (part, i) => {
			if (i%2 == 0) addRandomFood(part.position);
			part.phys.destroy();
			app.obj3d.main.remove(part);
		});
		snake.parts.length = 0;

		snake.sensor.phys.destroy();
		app.obj3d.main.remove(snake.sensor);

		if (snake.name == 'player') {
			failGame();
		}

		if (snake.name == 'enemy') {
			let id = app.enemies.indexOf(snake);
			if (id != -1) {
				app.enemies.splice(id, 1);
			}

			if (app.enemies.length == 0) {
				winGame();
			}			
		}

		snake.label.remove();
	}

	addSnakeBody(snake);
	
	return snake;
}


function initFood() {
	app.foods = [];
	
	app.foodModels = [
		app.obj3d.world.getObjectByName('Burger'),
		app.obj3d.world.getObjectByName('Chicken'),
		app.obj3d.world.getObjectByName('HappyMeal'),
		app.obj3d.world.getObjectByName('HotDog')
	]

	app.foodModels.forEach( food => food.visible = false );	
}

function initPhys() {	
	app.phys.restrict({type:'radius', radius: 23});

	app.obj3d.world.traverse((obj) => {
		if (obj.name.includes('Rock')) app.phys.add(obj, {shape:'circle', radius:2, isStatic:true});
		if (obj.name.includes('Palm')) app.phys.add(obj, {shape:'circle', radius:0.5, isStatic:true});		
	});		
}

function addPhysParts(obj) {
	let radius = 0.24;
	let debug = false;
	let bones = obj.bones;
	let parts = [];
	obj.parts = parts;	

	app.phys.add(obj, {shape:'circle', radius:0.5, drag:0.05, mass:10, isFollow:true, debug});	
	app.update.push(()=>stayOnGround(obj, 0.38));

	parts.push(obj);
	for (let i=1; i < bones.length+2; i++) {
		let part = new THREE.Object3D();
		part.name = 'body';
		part.snake = obj;
		part.rotation.y = obj.rotation.y;
		part.position.copy( obj.position );
		//part.position.y = 0.2;
		part.position.x -= i*radius*2 * Math.sin(obj.rotation.y);
		part.position.z -= i*radius*2 * Math.cos(obj.rotation.y);

		app.obj3d.main.add(part);
		app.phys.add(part, {shape:'circle', radius, drag:0.05, mass:0.01, debug, isSensor:true});
		parts.push(part);
		app.phys.joint(parts[i-1], part, 0.5);
	}		

	obj.sensor = new THREE.Object3D();
	app.phys.add(obj.sensor, {shape:'circle', radius:1, isSensor:true, debug:false});
	app.obj3d.main.add(obj.sensor);

	obj.update = () => {
		obj.sensor.position.copy(obj.position);
		obj.sensor.position.x += Math.sin(obj.rotation.y) * 0.5;
		obj.sensor.position.z += Math.cos(obj.rotation.y) * 0.5;

		for (let i=0; i < bones.length; i++) {
			let bone = bones[i];
			let deltaAngleY = (parts[i+2].rotation.y - parts[i+1].rotation.y);
			bone.rotation.z = deltaAngleY;

			if (i != 0) {
				let dy = parts[i+1].position.y - parts[i].position.y;				
				bone.position.z = dy;
			}
		}
	};

	app.update2.push(obj.update);

	obj.sensor.phys.onContact = function(obj2) {
		if ( (obj.name == 'player' || obj.name == 'enemy') && obj2.name == 'fruit' && obj2.isDown) {
			obj2.eat();
			gsap.to(obj2.scale, 0.5, {
				x:0.1, y:0.1, z:0.1, 
				onUpdate: ()=>{
					let x = obj.position.x + Math.sin(obj.rotation.y) * 1;
					let z = obj.position.z + Math.cos(obj.rotation.y) * 1;

					obj2.position.x += (x - obj2.position.x) / 10;
					obj2.position.y += (obj.sensor.position.y - obj2.position.y) / 10;
					obj2.position.z += (z - obj2.position.z) / 10;
				}, 
				onComplete: ()=>{
					obj2.visible = false;
					app.obj3d.main.remove(obj2);
				}
			});
			eatFruit(obj);
			while (app.foods.length < 40) addRandomFood();

			if (app.stateGame == 'game') {
				obj.eated++;
				obj.score++;				

				if (obj.score >= 30) {
					if (obj.name == 'player' ) winGame();
					if (obj.name == 'enemy' ) failGame();
				}
			}

			if (obj.eated >= 4) {
				obj.eated = 0;
				addSnakeBody(obj);
			}
		}		
	}

	obj.phys.onContact = function(obj2) {
		if (app.stateGame != 'game') return;

		if (obj.name == 'player' && obj2.snake && obj2.snake.name == 'enemy') {
			obj2.snake.destroy();
		}

		if (obj.name == 'player' && obj2.name == 'enemy') {
			obj2.destroy();
		}

		if (obj.name == 'enemy' && obj2.name == 'body') {
			let id = parts.indexOf(obj2);
			if (id != 1 && id != 2)
				obj.destroy();
		}
	}	
}

function init2dScene() {
	app.obj2d.ui = new PIXI.Container();
	app.scene2d.addChild(app.obj2d.ui);	

	app.obj2d.fsCTA = app.template.fullScreenCTA();
	app.obj2d.soundBtn = app.template.soundButton();
	app.obj2d.downloadBtn = app.template.downloadButton();	
	app.obj2d.joystick = app.template.joystick({player: app.obj3d.hero, layer:app.obj2d.clickArea, maxSpeed: app.obj3d.hero.speed});

	app.obj2d.helper = app.template.outlinedText({txt:'TAP TO START', color:0xffffff, fontSize:70, outlineColor:0x3369c9, outlineWidth:10, align:'center'});
	app.obj2d.helper.y = 100;

	app.obj2d.eatFastFood = app.template.outlinedText({txt:'EAT FAST FOOD!', color:0xffffff, fontSize:70, outlineColor:0x3369c9, outlineWidth:10, align:'center'});	
	app.obj2d.eatFastFood.y = 100;
	app.obj2d.eatFastFood.alpha = 0;

	app.obj2d.leaderBoard = createLeaderBoard();
	
	app.obj2d.failScreen = createFailScreen();
	app.obj2d.winScreen = createWinScreen();

	app.obj2d.ui.addChild(		
		app.obj2d.helper,
		app.obj2d.eatFastFood,
		app.obj2d.leaderBoard,
		app.obj2d.soundBtn,
		app.obj2d.downloadBtn,
		app.obj2d.joystick,
		app.obj2d.failScreen,
		app.obj2d.winScreen,
		app.obj2d.fsCTA
	);
}

 
function createLeaderBoard() {
	let leaderBoard = new PIXI.Container();
	leaderBoard.alpha = 0;

	let labels = [];

	let startX = 200;	
	let startY = 80;

	let names = [		
		'YOU',
		'MIKE',
		'LEO',
		'DEN'
	]

	createLabel( app.obj3d.hero, names[0], 1, 0xff00ff );	

	app.enemies.forEach( (enemy, i) => {
		createLabel( enemy, names[i+1], i+2 );
	});	

	let rating = labels.slice();

	leaderBoard.show = function() {
		gsap.to(leaderBoard, 0.5, {alpha: 1});
		
		labels.forEach( (label, i) => {
			gsap.from(label, 0.5, {x: 400, ease:'sine.out', delay: i*0.05});			
		});

		gsap.delayedCall(1.4, ()=>{
			app.update.push( update );
		});		
	}	

	leaderBoard.hide = function() {
		gsap.to(leaderBoard, 0.5, {alpha: 0});		
	}	

	function createLabel( obj, name, id, tintColor) {		
		let label = new PIXI.Container();
		label.x = startX;
		label.y = startY + (id-1) * 70;
		//label.toY = label.y;

		let full = new PIXI.Graphics();
		full.lineStyle(6, 0x3868d4);
		full.beginFill(0xffffff);
		full.drawRoundedRect(-200, -30, 400, 60, 30);
		full.x = -label.x - 100;			
		
		let fullWin = new PIXI.Graphics();
		fullWin.lineStyle(6, 0x3868d4);
		fullWin.beginFill(0xfff000);
		fullWin.drawRoundedRect(-200, -30, 400, 60, 30);	
		full.addChild(fullWin);
		fullWin.visible = false;

		let bg = new PIXI.Sprite( assets.textures.pixi.tableItemBg );
		bg.anchor.set(1, 0.5);

		if (tintColor) bg.tint = tintColor;

		let icon = new PIXI.Sprite( assets.textures.pixi['snake_icon' + id] );
		icon.anchor.set(0.5);
		icon.x = -bg.width + icon.width/2 + 5;

		let crown = new PIXI.Sprite( assets.textures.pixi.crown );
		crown.position.set(-8, -14);
		crown.anchor.set(0, 1);
		label.crown = crown;
		crown.visible = false;

		icon.addChild(crown);
		bg.addChild(icon);

		let text = PIXIText(name, {
			fontFamily: "font_baloo",
            fontSize: 40,
            color: 0xffffff,
            align: "right",
			valign: "center"
		});		
		text.x = -label.x - 10;
		label.text = text;		

		label.addChild(full, bg, text);

		label.remove = function() {			
			gsap.to(label, 0.5, {alpha: 0, x: 400, ease: 'sine.in'});
			//gsap.to(text, 0.25, { alpha: 0 });

			let id = labels.indexOf(label);
			if (id != -1) labels.splice(id, 1);

			id = rating.indexOf(label);
			if (id != -1) rating.splice(id, 1);
		}

		obj.label = label;
		label.obj = obj;		
		label.full = full;		
		
		leaderBoard.addChild(label);
		labels.push(label);
	}

	function update() {
		for (let label of labels) {
			label.x += (startX - 100 * (label.obj.score / 30) - label.x) * 0.25;
			label.text.x = -label.x - 10;
			label.full.x = -label.x - 100;
		}
		
		rating.sort( (a, b) => {
			if (a.x >= b.x) return 1
			else return -1;
		});

		rating.forEach( (label, i) => {
			//label.scale.set(0.9);
			label.full.children[0].visible = false;
			label.text.setColor(0xffffff);
			label.crown.visible = false;
			label.obj.crown.visible = false;
			label.y += (startY + i * 70 - label.y) * 0.25;
		});

		//rating[0].scale.set(1);
		rating[0].crown.visible = true;
		rating[0].obj.crown.visible = true;
		rating[0].full.children[0].visible = true;
		rating[0].text.setColor(0xffde00);
	}

	//update();

	return leaderBoard;
}


function createFailScreen() {
	let screen = new PIXI.Container();
	screen.visible = false;

	let bg = new PIXI.Graphics();
	bg.beginFill(0x012d3a);
	bg.drawRect(-1280, -1280, 2560, 2560);
	bg.alpha = 0.87;

	let youLose = new PIXI.Sprite( assets.textures.pixi.you_lose );
	youLose.anchor.set(0.5);

	let button = new PIXI.Sprite( assets.textures.pixi.try_again_btn );
	button.anchor.set(0.5);	

	button.interactive = true;
	button.on( 'pointertap', clickAd );

	let skull = new PIXI.Sprite( assets.textures.pixi.skull );	
	skull.anchor.set(0.5);	

	let skullMask = new PIXI.Graphics();
	skullMask.beginFill(0xffffff);
	skullMask.drawCircle(0, 0, 200);
	skullMask.x = -100;
	skullMask.y = 400;
	skull.addChild(skullMask);
	skull.mask = skullMask;

	let glow = new PIXI.Container();
	let glowStrip = new PIXI.Graphics();
	glowStrip.beginFill(0xffffff);
	glowStrip.drawRect(-250, -30, 500, 60);
	glowStrip.angle = 15;
	glowStrip.alpha = 0.7;	
	glowStrip.y = 300;
	glow.addChild(glowStrip);

	let glowMask = new PIXI.Sprite( assets.textures.pixi.skull );
	glowMask.anchor.set(0.5);	
	glow.addChild(glowMask);
	glow.mask = glowMask;	

	//let hand = new PIXI.Sprite( assets.textures.pixi.hand );
	//hand.anchor.set(0.5);	

	screen.addChild(bg, youLose, skull, button, glow);

	screen.show = function() {
		playSound('sLose');

		screen.visible = true;
		
		gsap.to(app.obj2d.downloadBtn, 0.25, {alpha:0});
		gsap.to(app.obj2d.fightText, 0.25, {alpha:0}); 
		
		gsap.from(bg, 0.5, {alpha:0});
		gsap.from(youLose.scale, 1.2, {delay:0.5, x:0, y:0, ease:'elastic.out'});

		gsap.from(button.scale, 0.5, {delay:1, x:0, y:0, ease:'sine.out'});
		gsap.to(button.scale, 0.5, {delay:1.5, x:0.9, y:0.9, repeat:-1, yoyo:true, ease:'quad.inOut'});	

		gsap.to(skullMask, 0.5, {delay:0.25, x:0, y:0, ease:'sine.out'});	
		gsap.to(glowStrip, 0.7, {delay:0.35, x:0, y:-300, ease:'sine.inOut'});	
	}

	screen.setPortraite = function(leftUi, rightUI, upUI, downUI) {
		youLose.x = 0;
		youLose.y = -450;

		skull.x = 0;
		skull.y = 0;
		skull.scale.set(1);
		glow.scale.set(1);

		button.x = 0;
		button.y = downUI - 200;
	}

	screen.setLandscape = function(leftUi, rightUI, upUI, downUI) {
		youLose.x = 0;
		youLose.y = upUI + 130;

		skull.x = 0;
		skull.y = -20;
		skull.scale.set(0.7);
		glow.scale.set(0.7);

		button.x = 0;
		button.y = downUI - 130;
	}

	return screen;
}


function createWinScreen() {
	let screen = new PIXI.Container();
	screen.visible = false;

	let bg = new PIXI.Graphics();
	bg.beginFill(0x012d3a);
	bg.drawRect(-1280, -1280, 2560, 2560);
	bg.alpha = 0.87;	

	let youWin = new PIXI.Sprite( assets.textures.pixi.you_win );
	youWin.anchor.set(0.5);	

	let chooseTxt = app.template.text({txt:'CHOOSE NEW SKIN', color:0xf4c404, fontSize:58});	

	let skin = new PIXI.Container();

	let shine = new PIXI.Sprite( assets.textures.pixi.glow );
	shine.anchor.set(0.5);
	skin.addChild(shine);
	gsap.to( shine, 14, {angle: 360, ease:'linear', repeat: -1} );

	let pandaSkin = new PIXI.Sprite( assets.textures.pixi.panda_skin );
	pandaSkin.anchor.set(0.5);
	skin.addChild(pandaSkin);

	let creeperSkin = new PIXI.Sprite( assets.textures.pixi.creeper_skin );
	creeperSkin.alpha = 0;	
	creeperSkin.anchor.set(0.5);
	skin.addChild(creeperSkin);

	let huggySkin = new PIXI.Sprite( assets.textures.pixi.huggy_skin );
	huggySkin.alpha = 0;	
	huggySkin.anchor.set(0.5);
	skin.addChild(huggySkin);

	let monkeySkin = new PIXI.Sprite( assets.textures.pixi.monkey_skin );
	monkeySkin.alpha = 0;	
	monkeySkin.anchor.set(0.5);
	skin.addChild(monkeySkin);

	let icons = new PIXI.Container();
	icons.interactive = true;
	icons.on('pointertap', clickAd);

	let icon1 = new PIXI.Sprite( assets.textures.pixi.orange_rect );
	let panda = new PIXI.Sprite( assets.textures.pixi.panda );
	panda.anchor.set(0.5);
	icon1.addChild(panda);
	icon1.anchor.set(0.5);
	icon1.x = -120;	
	icon1.y = -120;	
	icon1.scale.set(0.9);

	let icon2 = new PIXI.Sprite( assets.textures.pixi.orange_rect );
	let creeper = new PIXI.Sprite( assets.textures.pixi.creeper );
	creeper.anchor.set(0.5);
	icon2.addChild(creeper);
	icon2.anchor.set(0.5);
	icon2.x = 120;
	icon2.y = -120;

	let icon3 = new PIXI.Sprite( assets.textures.pixi.orange_rect );
	let huggy = new PIXI.Sprite( assets.textures.pixi.huggy );
	huggy.anchor.set(0.5);
	icon3.addChild(huggy);
	icon3.anchor.set(0.5);
	icon3.x = -120;	
	icon3.y = 120;	

	let icon4 = new PIXI.Sprite( assets.textures.pixi.orange_rect );
	let monkey = new PIXI.Sprite( assets.textures.pixi.monkey );
	monkey.anchor.set(0.5);
	icon4.addChild(monkey);
	icon4.anchor.set(0.5);
	icon4.x = 120;	
	icon4.y = 120;	

	let hand = new PIXI.Sprite( assets.textures.pixi.hand );
	hand.visible = false;
	hand.anchor.set(0.35, 0);
	hand.x = -120;
	hand.y = -120;	
	hand.angle = -25;

	icons.addChild( icon1, icon2, icon3, icon4, hand );
	screen.addChild( bg, youWin, chooseTxt, skin, icons );

	let iconsAnim = gsap.timeline({ repeat: -1, paused: true});
	iconsAnim.to(hand, 0.5, {x:120, y:-120, angle:25, ease:'quad.inOut'}, 0);
	iconsAnim.to(icon1.scale, 0.25, {x:1, y:1}, 0.25);
	iconsAnim.to(icon2.scale, 0.25, {x:0.9, y:0.9}, 0.25);
	iconsAnim.to(pandaSkin, 0.1, {alpha:0}, 0.4);
	iconsAnim.to(creeperSkin, 0.1, {alpha:1}, 0.4);	
	iconsAnim.to(hand, 0.5, {x:120, y:120, ease:'quad.inOut'}, 0.5);
	iconsAnim.to(icon2.scale, 0.25, {x:1, y:1}, 0.75);
	iconsAnim.to(icon4.scale, 0.25, {x:0.9, y:0.9}, 0.75);
	iconsAnim.to(creeperSkin, 0.1, {alpha:0}, 0.9);
	iconsAnim.to(monkeySkin, 0.1, {alpha:1}, 0.9);
	iconsAnim.to(hand, 0.5, {x:-120, y:120, angle:-25, ease:'quad.inOut'}, 1);
	iconsAnim.to(icon4.scale, 0.25, {x:1, y:1}, 1.25);
	iconsAnim.to(icon3.scale, 0.25, {x:0.9, y:0.9}, 1.25);
	iconsAnim.to(monkeySkin, 0.1, {alpha:0}, 1.4);
	iconsAnim.to(huggySkin, 0.1, {alpha:1}, 1.4);
	iconsAnim.to(hand, 0.5, {x:-120, y:-120, ease:'quad.inOut'}, 1.5);
	iconsAnim.to(icon3.scale, 0.25, {x:1, y:1}, 1.75);
	iconsAnim.to(icon1.scale, 0.25, {x:0.9, y:0.9}, 1.75);
	iconsAnim.to(huggySkin, 0.1, {alpha:0}, 1.9);
	iconsAnim.to(pandaSkin, 0.1, {alpha:1}, 1.9);

	iconsAnim.timeScale(0.7);

	screen.show = function() {
		playSound('sWin');

		screen.visible = true;
		gsap.to(app.obj2d.downloadBtn, 0.25, {alpha:0});
		gsap.to(app.obj2d.eatFastFood, 0.25, {alpha:0}); 

		gsap.from(bg, 0.5, {alpha:0});

		gsap.from(youWin.scale, 1.2, {delay:0.25, x:0, y:0, ease:'elastic.out'});
		//gsap.from(chooseTxt.scale, 1.2, {delay:0.35, x:0, y:0, ease:'elastic.out'});
		gsap.from(shine, 0.5, {delay:0.35, alpha:0});
		gsap.from(pandaSkin.scale, 0.25, {delay:0.35, x:0, y:0, ease:'sine.inOut'});

		chooseTxt.children.forEach( (letter, i) => gsap.from(letter.scale, 0.5, {x:0, y:0, ease:'back.out', delay: 0.05*i}) );

		icon1.scale.set(1);
		gsap.from(icon1, 0.75, {delay:0.6, alpha:0, angle:30, ease:'back.out'});
		gsap.from(icon2, 0.75, {delay:0.7, alpha:0, angle:30, ease:'back.out'});
		gsap.from(icon3, 0.75, {delay:0.8, alpha:0, angle:30, ease:'back.out'});
		gsap.from(icon4, 0.75, {delay:0.9, alpha:0, angle:30, ease:'back.out'});

		gsap.to(icon1.scale, 0.25, {delay: 1.5, x:0.9, y:0.9, ease:'sine.out'});
		gsap.set(hand, {delay: 1.5, visible: true});
		gsap.from(hand, 0.25, {delay: 1.5, alpha: 0, onComplete: () => {			
			iconsAnim.play();
		}})
	}

	screen.setPortraite = function(leftUi, rightUI, upUI, downUI) {
		youWin.x = 0;
		youWin.y = -460;

		chooseTxt.x = 0;
		chooseTxt.y = 50;			

		skin.x = 0;
		skin.y = -200;

		icons.x = 0;
		icons.y = 350;
	}

	screen.setLandscape = function(leftUi, rightUI, upUI, downUI) {
		youWin.x = -300;
		youWin.y = upUI+200;

		chooseTxt.x = -300;
		chooseTxt.y = downUI - 130;			

		skin.x = -300;
		skin.y = 50;

		icons.x = 300;
		icons.y = 0;
	}

	return screen;
}