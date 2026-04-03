function createScene() {	
	init3dScene();	
	init2dScene();	
}

function init3dScene() {
	app.obj3d.main = new THREE.Group();
	app.scene3d.add(app.obj3d.main);	
	app.raycaster.layers.set(1);
	
	initCamera();
	initLights();
	initMaterials();
	initWorld();	
	initPlayer();	
	initUpgradeCircles();
	initEnemies();
	initBoss();	
	initCoins();
	initBlood();

	app.cannon = new CannonPhysics();
}


function initCamera() {	
	app.camera3d = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 1000);	
}


function initLights() {
	let lightAmbient = new THREE.AmbientLight(0xffffff, 0.7);
	app.obj3d.lightAmbient = lightAmbient;
	app.obj3d.main.add(lightAmbient);

	let lightDirectional = new THREE.DirectionalLight(0xffffff, 0.5); //0xfd6051
	lightDirectional.position.set(-2, 20, 10);
	lightDirectional.castShadow = true;
	
	app.obj3d.lightDirectional = lightDirectional;
	app.obj3d.main.add(lightDirectional);

	lightDirectional.shadow.camera.left = -5;
	lightDirectional.shadow.camera.right = 20;
	lightDirectional.shadow.camera.top = 30;
	lightDirectional.shadow.camera.bottom = -2;
	lightDirectional.shadow.radius = 2;

	lightDirectional.shadow.mapSize.width = 1024 * 2;
	lightDirectional.shadow.mapSize.height = 1024 * 2;

	app.lightDirectional = lightDirectional;
}


function initMaterials() {
	for (let textureName in assets.textures.three) {
		let texture = assets.textures.three[textureName];
		setTextureDefaultSettings(texture);
	}	

	let envirementMap = assets.textures.three['environment_map2'];
	envirementMap.mapping = THREE.EquirectangularReflectionMapping;
    envirementMap.encoding = THREE.sRGBEncoding;

	app.materials.world = new THREE.MeshLambertMaterial({
		map: assets.textures.three['texture_world']
	});

	app.materials.hero = new THREE.MeshPhongMaterial({
		map: assets.textures.three['texture_world'],
		shininess: 30,
		envMap: envirementMap,
		reflectivity: 0.1
	});

	app.materials.part = new THREE.MeshPhongMaterial({
		map: assets.textures.three['texture_world'],
		shininess: 30,		
		//envMap: envirementMap,
		//reflectivity: 0.1
	});

	app.materials.glow = new THREE.MeshLambertMaterial({
		map: assets.textures.three['glow'],
		//depthWrite: false,
		transparent: true,
		blending: THREE.AdditiveBlending,
		opacity: 0.3,
		side: 2		
	});

	app.materials.upgrade = new THREE.MeshBasicMaterial({
		map: assets.textures.three['texture_upgrade'], 
		//depthWrite: false,
		blending: 2,
		opacity: 0.4,
		blending: THREE.AdditiveBlending,
		transparent: true
	});	

	app.materials.blueCircle = new THREE.SpriteMaterial({
		map: assets.textures.three['bonus_circle_blue3'],
		//depthWrite: false,
		blending: THREE.AdditiveBlending,
		transparent: true,
		sizeAttenuation: true
	});

	app.materials.yellowCircle = new THREE.SpriteMaterial({
		map: assets.textures.three['bonus_circle_yellow'],
		//depthWrite: false,
		blending: THREE.AdditiveBlending,
		transparent: true,
		sizeAttenuation: true
	});

	app.materials.blood = new THREE.SpriteMaterial({
		map: assets.textures.three['white_circle'],
		//color: 0x0000ff,
		//depthWrite: false,
		//blending: THREE.AdditiveBlending,
		transparent: true,
		sizeAttenuation: true
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
		if ( obj.name.includes('Cone') || obj.name.includes('Box') || obj.name.includes('wheel') || obj.name.includes('fence') || obj.name.includes('part') ) {
			obj.castShadow = true;
		}

		if ( obj.name == 'room' || obj.name == 'podium' || obj.name == 'road' || obj.name.includes('Cube') || obj.name.includes('Box') ) {			
			obj.receiveShadow = true;
		}

		obj.material = app.materials.world;		
	});	

	app.obj3d.podium = world.getObjectByName('podium');	
	app.obj3d.glow = world.getObjectByName('glow');		
	app.obj3d.glow.visible = false;
	app.obj3d.glow.material = app.materials.glow;

	app.obj3d.door1 = world.getObjectByName('ring_door_start');	
	app.obj3d.door2 = world.getObjectByName('ring_door_start001');	

	app.obj3d.room = world.getObjectByName('room');	
}


function initPlayer() {
	let player = new Player();	
	app.obj3d.player = player;
	app.obj3d.podium.add( player.model );
}


function initUpgradeCircles() {
	let partsNames = [ ['Body_'], ['Left_Arm_', 'Right_Arm_'], ['Head_'], ['Left_Leg_', 'Right_Leg_'] ];
	let charactersName = ['Blue', 'Flash', 'Lilith', 'Mario', 'Morales'];
	let sizes = [0.6, 0.4, 0.5, 0.65];

	app.upgradeCircles = [];
	app.upgradeClickObjects = [];

	let upgrades = app.obj3d.world.getObjectByName('upgrades');
	upgrades.children.forEach( (child, index) => {
		let upgradeCircle = new UpgradeCircle();
		child.add( upgradeCircle.object3d );
		app.upgradeCircles.push( upgradeCircle );
		app.upgradeClickObjects.push( upgradeCircle.object3d );

		for (let partId in partsNames) {			
			let upgradeNames = partsNames[partId].map( name => name + charactersName[index] );			
			upgradeCircle.addUpgradePart( upgradeNames, sizes[partId] );
		}
		
		upgradeCircle.showPart( app.currentPartId );
	});	
}


function initEnemies() {
	app.enemies = [];

	for (let i=0; i < 18; i++) {
		let enemy = new Enemy();
		app.obj3d.world.add( enemy.model );
		app.enemies.push(enemy);		

		if (i < 9 ) {
			enemy.model.position.x = -1.3 + i%3*1.3;
			enemy.model.position.z = -12 + Math.trunc(i/3)*1.5;
		} else {
			enemy.model.position.x = 8.75 + i%3*1.3;
			enemy.model.position.z = -20 + Math.trunc(i/3)*1.5;
		}		
	}	
}


function initBoss() {
	let boss = new Boss();
	boss.model.scale.set( 2, 2, 2 );
	boss.model.position.set( 10, 0, -30 );
	app.obj3d.world.add( boss.model );
	app.obj3d.boss = boss;
}


function initCoins() {	
	app.coins = [];

	let coinTemplate = app.obj3d.world.getObjectByName('coin');
	coinTemplate.visible = false;	

	for (let i=0; i < 25; i++) {
		let coin = new Coin( coinTemplate );

		coin.model.visible = true;
		coin.model.position.x = 3.5 + i%5 * 0.75;
		coin.model.position.z = -13.5 + Math.trunc(i/5) * 0.75;

		app.coins.push( coin );
		app.obj3d.world.add( coin.model );		
	}
}


function addTrail() {
	let part;

	let player = app.obj3d.player;	
	
	if (app.trail.length > 0) {
		part = app.trail.shift();
		part.material.color.r = 1;
		part.material.color.b = 0.2;
		part.visible = true;
		part.scale.set( 1, 1, 1 );
	} else {
		let geometry = new THREE.CircleGeometry(0.15, 8);
    	let material = new THREE.MeshBasicMaterial({color:0xff0044});	
    	part = new THREE.Mesh(geometry, material);
		part.rotation.x = -Math.PI/2;
		app.obj3d.world.add(part);
	}

	part.position.setFromMatrixPosition( player.trailPoint.matrixWorld );	
	
	gsap.to(part.material.color, 0.6, {b:1, r:0.4});
	gsap.to(part.scale, 0.6, {x:0, y:0, z:0, ease:'quad.in', onComplete:()=>{
		part.visible = false;
		app.trail.push(part);
	}})
}


function initBlood() {
	app.particles = [];
	app.pool = [];

	function update() {
		app.particles.forEach(part => {
			part.position.add(part.velocity);

			part.velocity.x *= 0.98;
			part.velocity.y -= 0.008;
			part.velocity.z *= 0.98;

			part.scale.multiplyScalar(0.97);

			if (part.scale.x < 0.01) {
				part.visible = false;

				let id = app.particles.indexOf(part);
				app.particles.splice(id, 1);

				app.pool.push(part);
			}
		})
	}

	app.update.add(update);
}


function addBlood(position, color=0x000000, vx, vz) {
	let num = Math.floor(6 + 5 * Math.random());

	for (let i = 0; i < num; i++) {
		let part = app.pool.length > 0 ? app.pool.pop() : new THREE.Sprite(app.materials.blood.clone());
		part.material.color.set(color);

		part.velocity = new THREE.Vector3(
			vx - 0.1 + 0.2 * Math.random(),
			0.1,
			vz - 0.1 + 0.2 * Math.random()
		);
		part.visible = true;
			
		part.position.copy(position);
		part.position.y = 2;

		let scale = 0.1 + Math.random() * 0.1;	
		part.scale.set(scale, scale, scale);

		app.particles.push(part);
		app.obj3d.main.add(part);
	}
}


function init2dScene() {
	app.obj2d.ui = new PIXI.Container();
	app.scene2d.addChild(app.obj2d.ui);	

	app.template = new Template();
	app.obj2d.fsCTA = app.template.fullScreenCTA();
	app.obj2d.soundBtn = app.template.soundButton();

	app.obj2d.joystick = new PlayerJoystickController( app.obj3d.player );
	app.obj2d.tutorialJoystick = new TutorialJoystick();		

	app.obj2d.coinsBar = createCoinsBar();

	app.obj2d.chooseArmorText = createAnimText( 'CHOOSE ARMOR' );	
	app.obj2d.bossFightText = createAnimText( 'BOSS FIGHT!' );	

	app.obj2d.ui.addChild(		
		app.obj2d.soundBtn,		
		app.obj2d.joystick.display,
		app.obj2d.tutorialJoystick.display,
		app.obj2d.coinsBar,
		app.obj2d.chooseArmorText,
		app.obj2d.bossFightText,
		app.obj2d.fsCTA
	);	
}


function createCoinsBar() {
	let coinsBar = new PIXI.Sprite(assets.textures.pixi['coinsBar']);
	coinsBar.alpha = 0;

	let coinsAmount = 0;

	coinsBar.txt = PIXIText(coinsAmount, {
		fontFamily: "font_agency",
		fontSize: 36,
		color: 0xffffff,
		align: "right",
		valign: "center",
		letterSpacing: -3,
		wordWrap: false
	});
	coinsBar.txt.x = 100;
	coinsBar.txt.y = 25;
	coinsBar.addChild(coinsBar.txt);	

	coinsBar.show = function() {
		gsap.to(coinsBar, 0.5, {alpha:1});
	}

	coinsBar.hide = function() {
		gsap.to(coinsBar, 0.5, {alpha:0});
	}	

	coinsBar.addCoin = function() {
		coinsAmount++;
		coinsBar.txt.setText( coinsAmount );

		gsap.killTweensOf(coinsBar.scale);
		coinsBar.scale.set(1);
		gsap.from( coinsBar.scale, 0.25, {x:0.9, y:0.9});
	}	

	return coinsBar;
}


function createAnimText( string, intervalTime = 4000 ) {
	let animText = PIXIText(string, {
		fontFamily: "font_agency",
		fontSize: 80,
		color: 0xffffff,
		align: "center",
		valign: "center",
		letterSpacing: -3,
		wordWrap: false
	});
	animText.visible = false;

	animate();	

	function animate() {
		animText.children.forEach( (letter, index) => {
			gsap.to( letter, 0.25, {y:'-=20', repeat:1, delay: index * 0.1, yoyo:true, ease:'quad.out'});
		})
	}

	animText.show = function() {
		animText.visible = true;
		gsap.from( animText, 0.5, {alpha: 0});
		animText.intervalId = setInterval( animate, intervalTime );
	}

	animText.hide = function() {
		clearInterval( animText.intervalId );
		gsap.to( animText, 0.5, {alpha: 0});
	}	

	return animText;
}