function createScene() {	
	init3dScene();	
	init2dScene();	
}

function init3dScene() {
	app.obj3d.main = new THREE.Group();
	app.scene3d.add(app.obj3d.main);	
	
	initCamera();
	initLights();
	initMaterials();
	initWorld();
	initSea();
	initHero();	
	initEnemies();
	initBullets();
	initPhys();
}


function initCamera() {	
	app.camera3d = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 1000);

	app.camera3d.posTo = new THREE.Vector3(-1.0, 1.1, 0);
	app.camera3d.lookTo = new THREE.Vector3(-0.4, 0, 0);	
	app.camera3d.lookNow = app.camera3d.lookTo.clone();	

	app.camera3d.position.copy(app.camera3d.posTo);
	app.camera3d.lookAt(app.camera3d.lookTo);
	app.camera3d.updateProjectionMatrix();
}


function initLights() {
	let lightAmbient = new THREE.AmbientLight(0xffffff, 0.7);
	app.obj3d.lightAmbient = lightAmbient;
	app.obj3d.main.add(lightAmbient);

	let lightDirectional = new THREE.DirectionalLight(0xffffff, 0.45); //0xfd6051
	lightDirectional.position.set(10, 30, 10);
	lightDirectional.castShadow = true;
	app.obj3d.lightDirectional = lightDirectional;
	app.obj3d.main.add(lightDirectional);

	lightDirectional.shadow.camera.left = -1.5;
	lightDirectional.shadow.camera.right = 1.5;
	lightDirectional.shadow.camera.top = 1.5;
	lightDirectional.shadow.camera.bottom = -1.5;
	lightDirectional.shadow.radius = 2;

	lightDirectional.shadow.mapSize.width = 1024;
	lightDirectional.shadow.mapSize.height = 1024;

	app.lightDirectional = lightDirectional;
}


function initMaterials() {
	for (let textureName in assets.textures.three) {
		let texture = assets.textures.three[textureName];
		setTextureDefaultSettings(texture);
	}
	
	//assets.textures.three['textureEnvironment'].mapping = THREE.EquirectangularReflectionMapping;	

	app.materials.world = getWorldDrawableMaterial();	

	app.materials.water = new THREE.MeshLambertMaterial({
		map: assets.textures.three['textureWater2']
	});

	//app.materials.water = new WaterShaderMaterial();

	app.materials.ground = new THREE.MeshPhongMaterial({
		map: assets.textures.three['textureWorld'],		
		shininess: 50
	});

	app.materials.hero = new THREE.MeshLambertMaterial({
		map: assets.textures.three['texturePeople00'],
		//envMap: assets.textures.three['texture_environment'],
		reflectivity: 0.1,
	});	

	app.materials.enemy = new THREE.MeshLambertMaterial({
		map: assets.textures.three['texturePeople01'],
		//envMap: assets.textures.three['texture_environment'],
		reflectivity: 0.1,
	});	

	app.materials.glass = new THREE.MeshPhongMaterial({ 
		color: 0x00dd00,
		emissive: 0x00dd00,
		specular: 0xffffff,
		shininess: 50,
		//envMap: assets.textures.three['texture_environment'],
		reflectivity: 0.2,
		transparent: true,
		opacity: 0.25,
		side: THREE.BackSide
	})

	app.materials.bullet = new THREE.MeshPhongMaterial({		
		color: 0x00ff00,
		reflectivity: 0.1,
		shininess: 50
	});	
}	


function setTextureDefaultSettings(texture, magFilter=THREE.NearestFilter) {
	texture.magFilter = magFilter;
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.flipY = false;
	//texture.encoding = THREE.sRGBEncoding;
}


function initWorld() {
	let world = assets.models.world;
	app.obj3d.world = world;
	app.obj3d.main.add(world);

	world.traverse((obj) => {
		obj.castShadow = true;
		obj.receiveShadow = true;		

		if (obj.name == 'Ground') obj.material = app.materials.world;
		if (obj.name == 'Ground2') obj.material = app.materials.ground;
	});

	app.obj3d.world.ground = world.getObjectByName('Ground');
	app.obj3d.world.ground2 = world.getObjectByName('Ground2');

	app.obj3d.world.ground2.visible = false;

	let bullet = world.getObjectByName('Bullet');
	bullet.visible = false;
	app.obj3d.bullet = bullet;
}


function initSea() {
	let water = app.obj3d.world.getObjectByName('Water');
	//let waterTexture = app.materials.water.map;
	/*let vertices = water.geometry.attributes.position.array;
	let bufferVertices = vertices.slice();
	let animVertices = [];	*/

	water.traverse((obj) => {	
		obj.castShadow = false;		
		obj.receiveShadow = true;		
		if (obj.name == 'Water') 
			obj.material = app.materials.water;		
	});

	//gsap.to( waterTexture.offset, 3, {x: 0.1, y: -0.05, repeat: -1, yoyo: true, ease: 'sine.inOut'});

	/*for (let j=0; j < vertices.length; j += 3) {
		animVertices[j] = vertices[j] * 1000;						
		animVertices[j+1] = randomInteger(0, 360);
		animVertices[j+2] = vertices[j+2] * 500;
	}*/
	
	function updateSea() {
		/*for (let j=0; j < vertices.length; j += 3) {
			animVertices[j] += 3;
			if (animVertices[j] >= 360) animVertices[j] -= 360; 
	
			animVertices[j+1] += 5;
			if (animVertices[j+1] >= 360) animVertices[j+1] -= 360;
	
			animVertices[j+2] += 4;
			if (animVertices[j+2] >= 360) animVertices[j+2] -= 360;
	
			vertices[j] = bufferVertices[j] + 0.015 * Math.sin( animVertices[j]*toRAD );
			vertices[j+1] = bufferVertices[j+1] + 0.030 * Math.sin( animVertices[j+1]*toRAD );
			vertices[j+2] = bufferVertices[j+2] + 0.015 * Math.sin( animVertices[j+2]*toRAD );
		}
		water.geometry.attributes.position.needsUpdate = true;	*/		
		
		/*waterTexture.offset.x += 0.002;
		waterTexture.offset.y += 0.001;
		if(waterTexture.offset.x > 1) waterTexture.offset.x -= 1;	
		if(waterTexture.offset.y > 1) waterTexture.offset.y -= 1;*/


	}

	//app.update.push( updateSea );
}


function initHero() {
	let hero = THREE.SkeletonUtils.clone( assets.models.hero );
	hero.name = 'hero';	
	hero.life = 100;
	hero.damage = 4;
	hero.speed = 0;
	hero.toSpeed = 0;
	app.obj3d.hero = hero;
	app.obj3d.main.add(hero);		

	hero.rotation.y = Math.PI/2;
	hero.position.set( -0.5, -0.1, 0);

	hero.traverse((obj) => {		
		obj.castShadow = true;
		obj.receiveShadow = true;

		obj.material = app.materials.hero;		

		if (obj.name === 'Head') {			
			obj.material = app.materials.glass;
		}
	});

	hero.muzzle = hero.getObjectByName('Bullet');
	hero.lifeBar = hero.getObjectByName('LifeBar');
	hero.bulletMaterial = app.materials.bullet.clone();
	hero.bulletMaterial.color = new THREE.Color(0x222244);	
	hero.paintColor = '#0000ff';
	hero.material = app.materials.hero;
	hero.glassMaterial = app.materials.glass;

	/*let arrowGeometry = new THREE.ConeGeometry( 0.02, 0.05, 16 ); 
	let arrowMaterial = new THREE.MeshLambertMaterial( {color: 0x00dd00} );
	let arrow = new THREE.Mesh( arrowGeometry, arrowMaterial ); 
	arrow.position.set(0, 0.05);
	arrow.scale.y = -1;
	hero.lifeBar.add( arrow );
	gsap.to(arrow.rotation, 2, {y: 2*Math.PI, repeat: -1, ease:'linear'});*/

	hero.die = function() {
		playSound('fail');

		hero.visible = false;	
		hero.lifeBarUI.visible = false;	

		app.obj2d.joystick.stop();

		app.phys.world.removeBody( hero.body );

		hero.stateMachine.set('IdleState');	
		let id = app.update.indexOf(hero.stateMachine.update);
		if (id != -1) app.update.splice(id, 1);

		while (app.enemies.length > 0) {
			let enemy = app.enemies[0];
			enemy.die();
			enemy.visible = true;		
		}

		winGame();
	}

	addAnimationMixer(hero, assets.models.hero.v_data.animations);
	hero.anim.set('Idle');

	let idleState = new IdleState(hero);
	let walkState = new WalkState(hero);

	let walkPredicate = new WalkPredicate(hero);
	let idlePredicate = new IdlePredicate(hero);
	
	walkState.predicates.push(idlePredicate);
	idleState.predicates.push(walkPredicate);	

	let stateMachine = new StateMachine();
	stateMachine.add(idleState, walkState);	
	stateMachine.set('IdleState');	

	hero.stateMachine = stateMachine;

	app.update.push(stateMachine.update);
}


function initEnemies() {
	let enemyPositions = [];	
	app.enemies = [];

	for ( let angle = -90; angle <= 90; angle += 90 ) {		
		let position = {
			x: -0.2 + 0.3 * Math.cos( angle * toRAD ),
			y: -0.1,
			z: 0.3 * Math.sin( angle * toRAD ),
			rotation: (270-angle) * toRAD
		};		
		enemyPositions.push( position );
	}

	for (let i=0; i < enemyPositions.length; i++) {
		let enemy = THREE.SkeletonUtils.clone(assets.models.hero);
		enemy.position.copy( enemyPositions[i] );
		enemy.rotation.y = enemyPositions[i].rotation;
		enemy.name = 'enemy' + i;
		enemy.life = 100;	
		enemy.damage = 0.5;
		enemy.speed = 0;
		enemy.toSpeed = 0;
		enemy.maxSpeed = 0.015;
		enemy.toRotate = enemy.rotation.y;
		enemy.turnTime = 0;		
		app.obj3d.main.add(enemy);	
		
		enemy.material = app.materials.enemy.clone();
		enemy.glassMaterial = app.materials.glass.clone();

		enemy.traverse((obj) => {		
			obj.castShadow = true;
			obj.receiveShadow = true;

			obj.material = enemy.material;

			if (obj.name === 'Head') {				
				obj.material = enemy.glassMaterial;
			}
		});

		enemy.muzzle = enemy.getObjectByName('Bullet');
		enemy.lifeBar = enemy.getObjectByName('LifeBar');
		enemy.bulletMaterial = app.materials.bullet.clone();

		enemy.startPosition = enemyPositions[i];		

		addAnimationMixer(enemy, assets.models.hero.v_data.animations);
		enemy.anim.set('Idle');

		//addCursor(app.obj3d.hero, enemy);

		enemy.die = function() {
			enemy.visible = false;
			enemy.lifeBarUI.visible = false;

			let id = app.enemies.indexOf(enemy);
			if (id != -1) app.enemies.splice(id, 1);

			app.phys.world.removeBody(enemy.body);			
			
			enemy.stateMachine.set('IdleState');
			id = app.update.indexOf(enemy.stateMachine.update);
			if (id != -1) app.update.splice(id, 1);

			if (app.enemies.length == 0) {
				app.obj3d.hero.die();
				app.obj3d.hero.visible = true;
				playSound('win');
				winGame();
			}
		}

		let idleState = new IdleState(enemy);
		let walkState = new WalkState(enemy);

		let walkPredicate = new WalkPredicate(enemy);
		let idlePredicate = new IdlePredicate(enemy);
		
		walkState.predicates.push(idlePredicate);
		idleState.predicates.push(walkPredicate);	

		let stateMachine = new StateMachine();
		stateMachine.add(idleState, walkState);	
		stateMachine.set('IdleState');	

		enemy.stateMachine = stateMachine;

		app.update.push(stateMachine.update);
		
		app.enemies.push(enemy);
	}	
}


function initBullets() {
	let hero = app.obj3d.hero;
	let ground = app.obj3d.world.ground;

	new BulletManager(hero, ground, app.enemies);
	app.enemies.forEach(enemy => new BulletManager(enemy, ground, [hero]));		
}


function initPhys() {
	app.phys = {};	

	let hero = app.obj3d.hero;
	let fixedTimeStep = 1/60;
	let maxSubSteps = 3;

	let world = new CANNON.World();
	world.gravity.set(0, -0.982, 0);
	app.phys.world = world;	

	let frictionMaterial = new CANNON.Material({ friction: 0.1 });	

	hero.body = new CANNON.Body({		
		mass: 10,
		position: new CANNON.Vec3(hero.position.x, hero.position.y, hero.position.z),		
		material: frictionMaterial,
		fixedRotation: true	
	});	
	hero.body.addShape( new CANNON.Sphere(0.05), new CANNON.Vec3(0, 0.05, 0) );

	app.enemies.forEach(enemy => {
		enemy.body = new CANNON.Body({
			mass: 10,
			position: new CANNON.Vec3(enemy.position.x, enemy.position.y, enemy.position.z),
			material: frictionMaterial,
			fixedRotation: true
		});	
		enemy.body.addShape( new CANNON.Sphere(0.05), new CANNON.Vec3(0, 0.05, 0) );

		world.addBody(enemy.body);
	});

	let groundBody = new CANNON.Body({
		mass: 0,
		position: new CANNON.Vec3(0, -0.092, 0),
		shape: new CANNON.Plane(),
		material: frictionMaterial
	});	
	groundBody.quaternion.setFromEuler(-Math.PI/2, 0, 0);	

	let platform2 = new CANNON.Body({		
		mass: 0,		
		material: frictionMaterial
	});	
	platform2.addShape( new CANNON.Box( new CANNON.Vec3(0.3, 0.05, 0.875) ), new CANNON.Vec3(0.7, -0.05, 0) );

	let platform3 = new CANNON.Body({		
		mass: 0,		
		material: frictionMaterial
	});	
	platform3.addShape( new CANNON.Box( new CANNON.Vec3(0.2, 0.05, 0.1) ), new CANNON.Vec3(0.25, -0.05, 0) );	

	let walls = new CANNON.Body({		
		mass: 0,		
		material: frictionMaterial
	});	
	walls.addShape( new CANNON.Plane(), new CANNON.Vec3(0, 0, -0.9) );
	walls.addShape( new CANNON.Plane(), new CANNON.Vec3(0, 0, 0.9), new CANNON.Quaternion().setFromEuler(0, Math.PI, 0) );
	walls.addShape( new CANNON.Plane(), new CANNON.Vec3(0.98, 0, 0), new CANNON.Quaternion().setFromEuler(0, -Math.PI/2, 0) );
	walls.addShape( new CANNON.Plane(), new CANNON.Vec3(-0.8, 0, 0), new CANNON.Quaternion().setFromEuler(0, Math.PI/2, 0) );

	let stairs1 = new CANNON.Body({		
		mass: 0,		
		material: frictionMaterial
	});	
	
	stairs1.addShape( 
		new CANNON.Box( new CANNON.Vec3(0.1, 0.025, 0.15) ), 
		new CANNON.Vec3(0.33, -0.066, -0.53), 
		new CANNON.Quaternion().setFromEuler(0, 0, 0.45)
	);	
	
	let stairs2 = new CANNON.Body({		
		mass: 0,		
		material: frictionMaterial
	});	
	stairs2.addShape( 
		new CANNON.Box( new CANNON.Vec3(0.1, 0.025, 0.15) ), 
		new CANNON.Vec3(0.33, -0.066, 0.53), 
		new CANNON.Quaternion().setFromEuler(0, 0, 0.45)
	);	

	world.addBody(hero.body);
	world.addBody(groundBody);	
	world.addBody(platform2);	
	world.addBody(stairs1);	
	world.addBody(stairs2);	
	world.addBody(walls);

	app.phys.platforms = [
		groundBody,		
		platform2, 		
		stairs1,
		stairs2
	];		

	for (let platform of app.phys.platforms) {
		platform.computeAABB();
	}

	app.phys.update = function() {
		world.step(fixedTimeStep, 1/25, maxSubSteps);
		hero.position.lerp( hero.body.position, 0.5 );
		app.enemies.forEach(enemy => enemy.position.lerp( enemy.body.position, 0.5 ) );
	}	

	app.update.push( app.phys.update );
}


function init2dScene() {
	app.obj2d.ui = new PIXI.Container();
	app.scene2d.addChild(app.obj2d.ui);	

	app.template = new Template();
	app.obj2d.fsCTA = app.template.fullScreenCTA();
	app.obj2d.soundBtn = app.template.soundButton();
	//app.obj2d.downloadBtn = app.template.downloadButton();	
	//app.obj2d.downloadBtn.visible = false;
	//app.obj2d.downloadBtn.alpha = 0;
	app.obj2d.choiceScreen = new ChoiceScreen();	
	app.obj2d.timeBar = new TimeBar();

	app.obj2d.blind = createBlind();

	app.obj2d.joystick = app.template.joystick({
		player: app.obj3d.hero,
		layer: app.scene2d,
		maxSpeed:0.015,
		isTutor: true
	});	

	app.obj3d.hero.lifeBarUI = createLifeBar( app.obj3d.hero );		
	let triangle = new PIXI.Sprite( assets.textures.pixi.triangle );
	triangle.anchor.set(0.5);
	triangle.y = -40;
	//gsap.to( triangle, 0.5, {y: -35, repeat: -1, yoyo: true, ease: 'sine.inOut' });
	app.obj3d.hero.lifeBarUI.addChild(triangle);
	app.obj2d.ui.addChild( app.obj3d.hero.lifeBarUI );
	
	for (let enemy of app.enemies) {
		enemy.lifeBarUI = createLifeBar( enemy );		
		app.obj2d.ui.addChild(enemy.lifeBarUI);
	}

	app.obj2d.fakeJoystick = app.template.fakeJoystick();
	app.obj2d.fakeJoystick.visible = false;	

	app.obj2d.killAllText = createKillText();

	app.obj2d.ui.addChild(		
		app.obj2d.fakeJoystick,
		app.obj2d.killAllText,
		app.obj2d.choiceScreen,
		app.obj2d.soundBtn,
		//app.obj2d.downloadBtn,
		app.obj2d.timeBar,		
		app.obj2d.blind,
		app.obj2d.fsCTA
	);	
}


function createBlind() {
	let blind = new PIXI.Graphics();
	blind.alpha = 0;
	blind.visible = false;

	blind.beginFill(0x222222);
	blind.drawRect(-1280, -1280, 2560, 2560);
	blind.endFill();

	blind.show = function( onComplete ) {
		blind.visible = true;
		gsap.to(blind, 0.5, {alpha: 1, onComplete});
	}

	blind.hide = function() {
		gsap.to(blind, 0.5, {alpha: 0});
	}

	return blind;
}


function createKillText() {		
	let killAllText = PIXIText('KILL ALL ENEMIES', {
		fontFamily 		: "font_baloo",
		fontSize 		: 80,
		color			: 0xffffff,
		align			: "center",			// left, right, center
		valign			: "center",			// top, bottom, center
		letterSpacing	: -10,
		lineHeight		: -30,
		wordWrapWidth	: 550,
		wordWrapHeight	: 300,
		wordWrap		: true
	});	

	let filterOutline = new PIXI.filters.OutlineFilter(8, 0x333377, 0.3);
	filterOutline.padding = 10;
	killAllText.filters = [filterOutline];	

	gsap.to(killAllText.scale, 0.3, {x: 0.9, y:0.9, repeat: -1, yoyo:true, ease:'sine.inOut'});
	
	killAllText.show = function() {
		gsap.to(killAllText, 0.25, {alpha: 1});
	}

	killAllText.hide = function() {
		gsap.to(killAllText, 0.25, {alpha: 0});
	}	
	
	return killAllText;		
}


function createLifeBar( obj3d ) {
	//let color = obj3d.bulletMaterial.color.getHex();

	let lifeUI = new PIXI.Container();	
	lifeUI.alpha = 0;

	let lifeBg = new PIXI.Sprite(assets.textures.pixi['life_bg']);
	lifeBg.anchor.set(0.5, 0.5);
	lifeUI.addChild(lifeBg);

	let lifeBar = new PIXI.Sprite(assets.textures.pixi['life_bar']);
	lifeBar.anchor.set(0.5, 0.5);
	//lifeBar.tint = color;
	lifeUI.addChild(lifeBar);
	lifeUI.lifeBar = lifeBar;

	let mask = new PIXI.Sprite(assets.textures.pixi['life_bar']);	
	mask.anchor.set(0.5, 0.5);
	lifeUI.addChild(mask);

	lifeBar.mask = mask;

	extra= new PIXI.Sprite(assets.textures.pixi['life_extra']);	
	extra.anchor.set(0.5, 0.5);
	lifeUI.addChild(extra);

	lifeUI.setColor = function( color ) {
		lifeBar.tint = color;
	}

	lifeUI.set = function(life) {
		let toX = -130*(1-life/100);
		gsap.to(lifeBar, 0.5, {x:toX, overwrite:true});		
	}

	lifeUI.show = function() {
		gsap.to(lifeUI, 0.25, {alpha: 1});
	}

	function update() {
		position3dTo2d( obj3d.lifeBar, lifeUI );
	}
	app.update.push(update);

	return lifeUI;
}


class TimeBar extends PIXI.Container {	
	#scoreText;
	#timeBar;

	constructor() {
		super();
		this.#initDisplay();
		this.#initTimer();
		this.alpha = 0;
	}

	#initDisplay() {
		let bg = new PIXI.Sprite( assets.textures.pixi.score_bg );	
		bg.anchor.set(0.5);

		let timeBar = new PIXI.Sprite(assets.textures.pixi['score_bar']);	
		timeBar.anchor.set(0.5, 0.5);
		timeBar.tint = 0x00dd00;
		timeBar.x = -460;
		
		let timeMask = new PIXI.Sprite(assets.textures.pixi['score_mask']);	
		timeMask.anchor.set(0.5, 0.5);		

		timeBar.mask = timeMask;

		let extra = new PIXI.Sprite(assets.textures.pixi['score_extra']);	
		extra.anchor.set(0.5, 0.5);

		this.#timeBar = timeBar;		

		this.addChild(bg, timeMask, timeBar, extra);
	}

	#initTimer() {
		let time = Math.ceil(app.gameTime / 60);
		let scoreText = PIXIText(time, {
			fontFamily: "font_baloo",
			fontSize: 30,
			color: 0x555555,
			align: "center",
			valign: "center",
			letterSpacing: -3,
			lineHeight: 0,
			wordWrapWidth: 550,
			wordWrapHeight: 300,
			wordWrap: false
		});
		scoreText.y = 13;

		this.#scoreText = scoreText;
		this.addChild(scoreText);
	}

	show() {		
		let time = app.gameTime;

		gsap.to(app, time, {gameTime: 0, ease:SteppedEase.config(time), 
			onUpdate: ()=>{
				this.#scoreText.setText(app.gameTime);
			},
			onComplete: timeOut
		});
		
		gsap.to(this.#timeBar, time, {x: 0, ease:'linear'});
		gsap.to(this, 0.25, {alpha: 1});
	}

	hide() {
		gsap.killTweensOf(app);
		gsap.killTweensOf(this.#timeBar);
		gsap.to(this, 0.25, {alpha: 0});
	}
}


class ChoiceScreen extends PIXI.Container {	
	#background;
	#colorIcons;
	#text;

	constructor() {
		super();
		this.#initDisplay();
	}

	#initDisplay() {		
		this.#background = this.#createBackground();
		this.#colorIcons = this.#createColorIcons();	
		this.#text = this.#createText();	
	}

	#createBackground() {
		let background = new PIXI.Sprite( assets.textures.pixi.colorChoiceBack );
		background.anchor.set(0.5);
		this.addChild( background );
		
		return background;
	}
	
	#createColorIcons() {
		let colorIcons = new PIXI.Container();	
		colorIcons.name = 'colorIcons';
		let delta = 250;		

		for ( let i=1; i <= 4; i++ ) {
			let colorIcon = new PIXI.Sprite( assets.textures.pixi['color0' + i] );			
			colorIcon.anchor.set(0.5);
			colorIcon.x = ( i == 1 || i == 4 ) ? -delta/2 : delta/2;
			colorIcon.y = ( i == 1 || i == 2 ) ? -delta/2 : delta/2;
			colorIcons.addChild( colorIcon );		
			
			colorIcon.hitHandArea = colorIcon.getBounds();
			colorIcon.interactive = true;
			colorIcon.on( 'pointertap', this.#colorIconTapHandler.bind(this) );
		}

		let hand = new PIXI.Sprite( assets.textures.pixi.hand );
		hand.interactive = false;
		hand.hitArea = new PIXI.Rectangle(0,0,0,0);
		hand.position.set( -delta/2, -delta/2 );
		colorIcons.addChild( hand);
		
		let animObj = {
			angle: 0			
		}

		gsap.to( animObj, 2, { angle: 360, repeat: -1, ease: 'linear', onUpdate: () => {			
			hand.x = delta/2 * Math.cos( animObj.angle * toRAD );
			hand.y = delta/2 * Math.sin( animObj.angle * toRAD );
			hand.rotation = 0.2 * Math.sin( animObj.angle * toRAD+1 );			
			
			for ( let index = 0; index < 4; index++ ) {
				let colorIcon = colorIcons.children[ index ];
				colorIcon.index = index;
				
				if ( colorIcon.hitHandArea.contains(hand.x, hand.y) ) {
					colorIcon.scale.x += ( 1.05 - colorIcon.scale.x ) * 0.05;					
				} else {
					colorIcon.scale.x += ( 1.00 - colorIcon.scale.x ) * 0.05;
				}

				colorIcon.scale.y = colorIcon.scale.x;
			}			
		}}); 

		this.addChild( colorIcons );

		return colorIcons;
	}

	#createText() {
		let chooseColorTxt = PIXIText('CHOOSE	COLOR', {
			fontFamily 		: "font_baloo",
			fontSize 		: 80,
			color			: 0xffffff,
			align			: "center",			// left, right, center
			valign			: "center",			// top, bottom, center
			letterSpacing	: -5,
			lineHeight		: -30,
			wordWrapWidth	: 600,
			wordWrapHeight	: 200,
			wordWrap		: false
		});				
		
		let startPlayTxt = PIXIText('and start play', {
			fontFamily 		: "font_baloo",
			fontSize 		: 40,
			color			: 0xfccb07,
			align			: "center",			// left, right, center
			valign			: "top",			// top, bottom, center
			letterSpacing	: -2,
			lineHeight		: -30,
			wordWrapWidth	: 600,
			wordWrapHeight	: 200,
			wordWrap		: false
		});	
		startPlayTxt.y = chooseColorTxt.height * 0.25;
		chooseColorTxt.addChild( startPlayTxt);		
		
		this.addChild( chooseColorTxt );

		return chooseColorTxt;
	}

	#colorIconTapHandler(e) {
		playSound('button');

		let colorIcons = this.getChildByName('colorIcons');
		for ( let colorIcon of colorIcons.children ) {
			colorIcon.off('pointerdown');
		}
		
		this.emit( 'iconChoiced', e.currentTarget.index );
		this.hide();
	}

	hide() {
		gsap.to( this, 0.4, {alpha: 0, visible: false} );
	}

	onResize() {
		this.#background.scale.x = 0.1 + app.canvasWidth / 1280 / app.obj2d.ui.scale.x;
		this.#background.scale.y = 0.1 + app.canvasHeight / 1280 / app.obj2d.ui.scale.x;

		let isPortraite = window.innerWidth < window.innerHeight;

		if ( isPortraite ) {

			this.#colorIcons.position.set(0, -100);
			this.#text.position.set(0, 250);

		} else {

			this.#colorIcons.position.set(260, 0);
			this.#text.position.set(-300, 0);	

		}
	}	
}