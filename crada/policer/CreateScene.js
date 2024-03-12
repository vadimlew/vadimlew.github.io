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
	initVerletPhys();
	initPlayer();
	initWorld();
	initKickEffect();
	initPoliceLabel();
	initSmile();
	initMoneyDrop();
	initEnemies();
	initPhys();
}

function initCamera() {	
	app.camera3d = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 1000);

	app.camera3d.posTo = new THREE.Vector3(-3.5, 2.5, 0.2);
	app.camera3d.lookTo = new THREE.Vector3(-1, 0, 0.2);	
	app.camera3d.lookNow = app.camera3d.lookTo.clone();

	app.camera3d.position.copy(app.camera3d.posTo);
	app.camera3d.lookAt(app.camera3d.lookTo);
	app.camera3d.updateProjectionMatrix();	
}

function initLights() {
	let lightAmbient = new THREE.AmbientLight(0xffffff, 0.7);
	app.obj3d.lightAmbient = lightAmbient;
	app.obj3d.main.add(lightAmbient);

	let lightDirectional = new THREE.DirectionalLight(0xffffff, 0.6); //0xfd6051
	lightDirectional.position.set(-5, 10, -5);
	lightDirectional.castShadow = true;
	app.obj3d.lightDirectional = lightDirectional;
	app.obj3d.main.add(lightDirectional);

	lightDirectional.shadow.camera.left = -10;
	lightDirectional.shadow.camera.right = 10;
	lightDirectional.shadow.camera.top = 10;
	lightDirectional.shadow.camera.bottom = -10;
	lightDirectional.shadow.radius = 2;

	lightDirectional.shadow.mapSize.width = 1024;
	lightDirectional.shadow.mapSize.height = 1024;
}

function initMaterials() {
	for (let textureName in assets.textures.three) {
		let texture = assets.textures.three[textureName];
		setTextureDefaultSettings(texture);
	}	
	
	app.material.world = new THREE.MeshLambertMaterial({
		map: assets.textures.three['texture_world']		
	});	

	app.material.people = new THREE.MeshLambertMaterial({
		map: assets.textures.three['texture_people']		
	});	

	app.material.water = new THREE.MeshLambertMaterial({
		map: assets.textures.three['texture_water']		
	});	

	app.material.building = new THREE.MeshLambertMaterial({
		map: assets.textures.three['texture_world'],
		transparent: true,
		opacity: 1
	});	

	app.material.label = new THREE.MeshLambertMaterial({
		map: assets.textures.three['texture_police_label'],
		transparent: true,
		side: THREE.DoubleSide,
		opacity: 0.75
	});	

	app.material.label2 = new THREE.MeshLambertMaterial({
		map: assets.textures.three['gradient'],
		transparent: true,
		side: THREE.DoubleSide
	});	
	
	app.material.particle = new THREE.SpriteMaterial({
		map: assets.textures.three['particle'],
		color: 0x00ff00,
		blending: THREE.AdditiveBlending,
		depthWrite: false,
		transparent: true,
		sizeAttenuation: true
	});
	assets.textures.three['particle'].flipY = true;
	assets.textures.three['particle'].wrapS = THREE.ClampToEdgeWrapping;
	assets.textures.three['particle'].wrapT = THREE.ClampToEdgeWrapping;

	app.material.kickEffect = new THREE.SpriteMaterial({
		map: assets.textures.three['texture_kick'],		
		blending: THREE.AdditiveBlending,
		depthWrite: false,
		transparent: true,
		sizeAttenuation: true
	});
	assets.textures.three['texture_kick'].flipY = true;
	assets.textures.three['texture_kick'].wrapS = THREE.ClampToEdgeWrapping;
	assets.textures.three['texture_kick'].wrapT = THREE.ClampToEdgeWrapping;

	app.material.money = new THREE.SpriteMaterial({
		map: assets.textures.three['money'],		
		depthWrite: true,
		transparent: true,
		sizeAttenuation: true
	});
	assets.textures.three['money'].flipY = true;
	assets.textures.three['money'].wrapS = THREE.ClampToEdgeWrapping;
	assets.textures.three['money'].wrapT = THREE.ClampToEdgeWrapping;

	app.material.smile = new THREE.SpriteMaterial({
		map: assets.textures.three['sad_smile'],
		depthWrite: true,
		transparent: true,
		sizeAttenuation: true
	});
	assets.textures.three['sad_smile'].flipY = true;
	assets.textures.three['sad_smile'].wrapS = THREE.ClampToEdgeWrapping;
	assets.textures.three['sad_smile'].wrapT = THREE.ClampToEdgeWrapping;

	let waterTexture = assets.textures.three['texture_water'];
	gsap.to(waterTexture.offset, 4, {x: 0.25, repeat:-1, yoyo:true, ease:'sine.inOut'});
	gsap.to(waterTexture.offset, 3, {y: -0.25, repeat:-1, yoyo:true, ease:'sine.inOut'});
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
		obj.receiveShadow = true;
		obj.material = app.material.world;

		if ( obj.name.includes('Grass') || obj.name.includes('Water') ) {
			obj.castShadow = false;
			obj.receiveShadow = false;
		}

		if (obj.name.includes('House')) {
			obj.material = app.material.building;
		}
	});

	world.getObjectByName('water').material = app.material.water;
	world.getObjectByName('policeCar').visible = false;	

	app.obj3d.jailPlaces = [];
	let startX = 0.1;
	let startZ = -0.8;
	let distance = 0.2;
	let col = 4;
	let row = 4;
	let size = col*row;
	for (let i=0; i < size; i++) {
		let x = startX + distance * Math.floor(i/col); 
		let z = startZ + distance * (i%col); 
		let pos = new THREE.Vector3(x, 0, z);
		app.obj3d.jailPlaces.push(pos);
	}
}

function initKickEffect() {
	app.obj3d.kickEffect = new THREE.Sprite(app.material.kickEffect);
	app.obj3d.kickEffect.visible = false;
	app.obj3d.player.add(app.obj3d.kickEffect); 
	app.obj3d.kickEffect.position.set(-0.04, 0.2, 0.17);

	app.obj3d.kickEffect.show = function() {
		this.visible = true;
		gsap.killTweensOf(this.scale);
		gsap.fromTo(this.scale, {x:0, y:0, z:0}, {x:0.35, y:0.35, z:0.35, duration:0.2, ease:'sine.out', onComplete:()=>{
			this.visible = false;
		}});
	}
}

function initSmile() {
	app.obj3d.smile = new THREE.Sprite(app.material.smile);
	app.obj3d.smile.visible = false;
	app.obj3d.main.add(app.obj3d.smile); 
	app.obj3d.smile.scale.set(0.22, 0.22, 1);

	app.obj3d.smile.show = function(position) {
		this.visible = true;
		this.position.copy(position);
		gsap.killTweensOf(this.position);
		gsap.fromTo(this.position, {y:0.4}, {y:0.6, duration:0.25, ease:'sine.out'});
		gsap.delayedCall(0.6, ()=>{
			app.obj3d.smile.visible = false;
		});
	}
}

function initMoneyDrop() {
	let moneys = [];
	let pool = [];

	function createMoney() {
		let spriteMoney = new THREE.Sprite(app.material.money.clone());
		let scale = 0.1 + 0.05 * Math.random();
		spriteMoney.scale.set(scale, scale*0.65, 1);
		spriteMoney.velocity = new THREE.Vector3();
		return spriteMoney;
	}    

	function update() {
		moneys.forEach( (money) => {				
			if (money.position.y <= 0.05) {
				money.position.y = 0.05;
				money.material.opacity -= 0.1;	
			} else {
				money.position.add(money.velocity);	
			}			

			if (money.material.opacity <= 0) {								
				removeFromArray(money, moneys);
				pool.push(money);
			}
		});
	}		

	app.obj3d.money = {};
	app.obj3d.money.show = function(position) {
		let len = randomInteger(5, 7);
		for (let i=0; i<len; i++) {
			let money = pool.length > 0? pool.shift() : createMoney();
			money.position.copy(position);
			let radius = 0.02;
			let angle = 2*Math.PI*Math.random();
				
			money.position.x += radius * Math.cos(angle);
			money.position.y += 0.4;
			money.position.z += radius * Math.sin(angle);	
			
			money.velocity.x = Math.cos(angle) * 0.02 * Math.random();
			money.velocity.y = -0.04;
			money.velocity.z = Math.sin(angle) * 0.02 * Math.random();	
			
			money.angleSpeed = 0.1 + 0.1 * Math.random();
			money.material.rotation = 2*Math.PI*Math.random();
			money.material.opacity = 1;
				
			app.obj3d.main.add(money);
			moneys.push(money);
		}		
	}

	app.update.push(update);
}


function initPoliceLabel() {
	let world = assets.models.world;

	let policeLabel = world.getObjectByName('policeLabel');
	let glowedTube = world.getObjectByName('policeLabel2');

	policeLabel.visible = false;
	glowedTube.visible = false;
	
	app.obj3d.policeLabel = policeLabel;
	app.obj3d.policeLabel.putTimer = 0;

	policeLabel.material = app.material.label;
	glowedTube.material = app.material.label2;

	policeLabel.castShadow = false;
	glowedTube.castShadow = false;

	policeLabel.receiveShadow = false;
	glowedTube.receiveShadow = false;

	let sparkles = app.template.particles(app.material.particle, 50, updateParticles, 100);
    policeLabel.add(sparkles);
    app.update.push(sparkles.update);
	
	function updateParticles(particle) {
		if (particle.visible) {
			particle.position.y += particle.vy;
			particle.scale.multiplyScalar(0.98);
			if (particle.position.y > 0.4) {
				particle.visible = false;				
			}
		} else {
			let radius = 0.1;
			let angle = 2*Math.PI*Math.random();
			particle.position.set(
				radius * Math.cos(angle), 
				-0.05, 
				radius * Math.sin(angle) 
			);			
			let scale = 0.05 + 0.05 * Math.random();
			particle.scale.set(scale/2, scale, scale);
			particle.vy = 0.005 + 0.005 * Math.random();
			particle.visible = true;
		}
	}	

	showPoliceLabel();
}


function initPlayer() {
	let player = THREE.SkeletonUtils.clone(assets.models.people);
	app.obj3d.player = player;		
	app.obj3d.main.add(player);
	
	player.name = 'player';	
	player.stack = [];

	player.position.set(-1, 0, 0.2);
	player.rotation.y = -Math.PI/2;

	player.traverse((obj) => {
		obj.castShadow = true;
		obj.receiveShadow = true;
		obj.material = app.material.people;
	});

	player.getObjectByName('mPeople_M_0').visible = false;	
	player.getObjectByName('mPeople_M_2').visible = false;
	player.getObjectByName('mPeople_M_3').visible = false;
	player.getObjectByName('mPeople_M_Enemy').visible = false;
	player.getObjectByName('mPeople_M_Police').visible = true;
	player.getObjectByName('mPeople_W_0').visible = false;
	player.getObjectByName('mPeople_W_1').visible = false;
	player.getObjectByName('mPeople_W_2').visible = false;
	player.getObjectByName('mPeopleWeapon').visible = false;
	player.getObjectByName('mPeopleClub').visible = false;
	
	player.club = player.getObjectByName('mPeopleClub');
	
	addAnimationMixer(player, assets.models.people.v_data.animations);
	player.anim.set('Idle', 0);

	player.anim.action['Kick'].setLoop(THREE.LoopOnce);

	app.phys.add(player, {shape:'circle', radius:0.11, drag:0});

	let stateMachine = new StateMachine();

	let idleState = new PlayerIdleState(player);
	let walkState = new PlayerWalkState(player);
	let attackState = new PlayerAttackState(player);	
	
	stateMachine.add(idleState, walkState, attackState);
	stateMachine.set(PlayerIdleState);

	player.stateMachine = stateMachine;
	app.update.push(stateMachine.update);	
}

function initEnemies() {
	let enemies = [];	
	app.obj3d.enemies = enemies;		

	app.obj3d.world.getObjectByName('spawnPoints').children.forEach( (place, i) => {		
		if ( Math.random() > 0.15 ) {
			let enemy = createCriminal();		
			enemy.position.copy(place.position);
			enemy.rotation.y = 2*Math.PI * Math.random();
			app.obj3d.main.add(enemy);
			app.obj3d.enemies.push(enemy);
			enemy.phys.resetVelocity();
		} else {
			let citizen = createCitizen();		
			citizen.position.copy(place.position);
			citizen.rotation.y = 2*Math.PI * Math.random();
			app.obj3d.main.add(citizen);
			citizen.phys.resetVelocity();
		}		
	});

	function createCriminal() {
		let criminal = THREE.SkeletonUtils.clone(assets.models.people);

		criminal.name = 'criminal';		
		criminal.speed = 0.017;
        criminal.toRotate = 0;		

		addAnimationMixer(criminal, assets.models.people.v_data.animations);
		criminal.anim.set('Idle', 0);

		criminal.traverse((obj) => {
			obj.castShadow = true;
			obj.receiveShadow = true;
			obj.material = app.material.people;
		});

		criminal.getObjectByName('mPeople_M_0').visible = false;	
		criminal.getObjectByName('mPeople_M_2').visible = false;
		criminal.getObjectByName('mPeople_M_3').visible = false;
		criminal.getObjectByName('mPeople_M_Enemy').visible = false;
		criminal.getObjectByName('mPeople_M_Police').visible = true;
		criminal.getObjectByName('mPeople_W_0').visible = false;
		criminal.getObjectByName('mPeople_W_1').visible = false;
		criminal.getObjectByName('mPeople_W_2').visible = false;
		criminal.getObjectByName('mPeopleWeapon').visible = false;
		criminal.getObjectByName('mPeopleClub').visible = false;

		criminal.getObjectByName('mPeople_M_Enemy').visible = true;
		criminal.getObjectByName('mPeople_M_Police').visible = false;
		criminal.getObjectByName('mPeopleWeapon').visible = true;

		criminal.gun = criminal.getObjectByName('mPeopleWeapon');

		criminal.anim.action['Dead'].setLoop(THREE.LoopOnce);

		app.phys.add(criminal, {shape:'circle', radius:0.15, drag:0.5});

		let stateMachine = new StateMachine();
		
		let walkState = new EnemyWalkState(criminal);
		let deathState = new EnemyDeathState(criminal);
		
		stateMachine.add(walkState, deathState);
		stateMachine.set(EnemyWalkState);

		criminal.stateMachine = stateMachine;
		app.update.push(stateMachine.update);

		return criminal;
	}	

	function createCitizen() {
		let citizen = THREE.SkeletonUtils.clone(assets.models.people);

		citizen.name = 'citizen';		
		citizen.speed = 0.005;
        citizen.toRotate = 0;		

		addAnimationMixer(citizen, assets.models.people.v_data.animations);
		citizen.anim.set('Idle', 0);	
		
		citizen.traverse((obj) => {
			obj.castShadow = true;
			obj.receiveShadow = true;
			obj.material = app.material.people;
		});		

		citizen.getObjectByName('mPeople_M_0').visible = false;		
		citizen.getObjectByName('mPeople_M_2').visible = false;
		citizen.getObjectByName('mPeople_M_3').visible = false;
		citizen.getObjectByName('mPeople_M_Enemy').visible = false;
		citizen.getObjectByName('mPeople_M_Police').visible = false;
		citizen.getObjectByName('mPeople_W_0').visible = false;
		citizen.getObjectByName('mPeople_W_1').visible = false;
		citizen.getObjectByName('mPeople_W_2').visible = false;
		citizen.getObjectByName('mPeopleWeapon').visible = false;
		citizen.getObjectByName('mPeopleClub').visible = false;

		let names = ['mPeople_M_0', 'mPeople_M_2', 'mPeople_M_3', 'mPeople_W_0', 'mPeople_W_1', 'mPeople_W_2'];
		let name = getRandomItem(names);		
		citizen.getObjectByName(name).visible = true;

		app.phys.add(citizen, {shape:'circle', radius:0.15, drag:0.5});

		let stateMachine = new StateMachine();
		
		let walkState = new CitizenWalkState(citizen);
		stateMachine.add(walkState);
		stateMachine.set(CitizenWalkState);

		citizen.stateMachine = stateMachine;
		app.update.push(stateMachine.update);

		return citizen;
	}	
}

function initPhys() {
	let debug = false;

	app.obj3d.world.getObjectByName('hitBounds').children.forEach(wall => {		
		wall.visible = false;			

		if ( wall.name.includes('Cube') ) {
			let width = wall.geometry.boundingBox.max.x;
			let height = wall.geometry.boundingBox.max.z;		
			app.phys.add(wall, {shape:'aabb', aabb:[width, height], isStatic:true, debug});	
		} else {			
			let radius = wall.geometry.boundingBox.max.x;
			app.phys.add(wall, {shape:'circle', radius, isStatic:true, debug});
		}		
	});		
	
	app.obj3d.world.traverse((obj) => {
		if ( obj.name.includes('tree') ) app.phys.add(obj, {shape:'circle', radius: 0.1, isStatic:true, debug});
		if ( obj.name.includes('trashCan') ) app.phys.add(obj, {shape:'circle', radius: 0.1, isStatic:true, debug});
		if ( obj.name.includes('lightPole') ) app.phys.add(obj, {shape:'circle', radius: 0.05, isStatic:true, debug});
		if ( obj.name.includes('sign') ) app.phys.add(obj, {shape:'circle', radius: 0.05, isStatic:true, debug});
		if ( obj.name.includes('trashBag') ) app.phys.add(obj, {shape:'circle', radius: 0.1, isStatic:true, debug});
		if ( obj.name.includes('bush01') ) app.phys.add(obj, {shape:'aabb', aabb:[0.1, 0.1], isStatic:true, debug});
		if ( obj.name.includes('bush02') ) app.phys.add(obj, {shape:'aabb', aabb:[0.1, 0.25], isStatic:true, debug});
	});

	app.obj3d.player.phys.event.on('contact', contactHandler);
	function contactHandler(contact) {
        if (contact.name === 'criminal' && app.stateGame != 'loaded') {   
			app.obj3d.player.stateMachine.set(PlayerAttackState);
			contact.phys.destroy();

			gsap.delayedCall(0.1, ()=>{
				shakeWorld();				
				contact.stateMachine.set(EnemyDeathState);
			});           
		}		

		if (contact.name === 'policeLabel') {   
			putInJail();
			// app.obj3d.player.followArrow.visible = false;
		} 
    }
}

function init2dScene() {
	app.obj2d.ui = new PIXI.Container();
	app.scene2d.addChild(app.obj2d.ui);	

	app.obj2d.fsCTA = app.template.fullScreenCTA();
	app.obj2d.soundBtn = app.template.soundButton();
	app.obj2d.downloadBtn = app.template.downloadButton({txt: params.textInstall.value, bgColor: 0x00f900, textColor:0xffffff});	

	app.obj2d.progressbar = createProgressBar();
	app.obj2d.progressbar.alpha = 0;

	app.obj2d.winScreen = createWinScreen();
	// app.obj2d.winScreen.show();

	// app.obj2d.criminalBar = createCriminalBar();
	// app.obj2d.criminalBar.alpha = 0;
	
	app.obj2d.joystick = app.template.joystick({
		player: app.obj3d.player, 
		layer: app.scene2d,
		maxSpeed:0.05,
		isTutor: true
	});	
	app.obj2d.joystick.y = 300;
	
	app.obj2d.helper = new PIXI.Sprite( assets.textures.pixi.catchText );
	app.obj2d.helper.anchor.set(0.5);
	gsap.to( app.obj2d.helper.scale, 0.5, {x: 0.95, y: 0.95, ease: 'sine.inOut', repeat: -1, yoyo: true } )

	app.obj2d.ui.addChild(
		app.obj2d.joystick,
		// app.obj2d.criminalBar,
		app.obj2d.progressbar,
		app.obj2d.helper,
		app.obj2d.winScreen,
		app.obj2d.fsCTA,
		app.obj2d.soundBtn,
		// app.obj2d.downloadBtn		
	);
}


function createCriminalBar() {
	let criminalbar = new PIXI.Container();
	let catched = 0;
	let maxCriminal = 15;	

	let isComplete = false;
	
	let icon = new PIXI.Sprite(assets.textures.pixi['criminal']);	
	let countTxt = app.template.text({txt:'0/'+maxCriminal, fontSize:60, fontFamily:'font_agency', outlineColor:0xffffff});
	countTxt.position.set(180, 55);

	criminalbar.addChild(icon, countTxt);

	criminalbar.add = function() {
		if (isComplete) return;

		catched += 1;
		countTxt.setText(catched + '/' + maxCriminal);
		gsap.killTweensOf(criminalbar.scale);
		gsap.to(criminalbar.scale, 0.1, {x:1.05, y:1.05, repeat:1, yoyo:true});

		if (catched >= maxCriminal) {
			catched = maxCriminal;
			isComplete = true;

			gsap.to(criminalbar, 0.5, {alpha:0, delay:0.25});
			gsap.to(app.obj2d.progressbar, 0.5, {alpha:1, delay:0.5});

			// showPoliceLabel();
		}		
	}

	return criminalbar;
}


function createProgressBar() {
	let progressbar = new PIXI.Container();
	progressbar.scale.set(0.95);
	let money = 0;
	let maxMoney = 100;

	let isComplete = false;

	let back = new PIXI.Sprite(assets.textures.pixi['progress_back']);
	let line = new PIXI.Sprite(assets.textures.pixi['progress_line']);
	let icon = new PIXI.Sprite(assets.textures.pixi['car_icon']);

	let mask = new PIXI.Graphics();
	mask.beginFill(0);
	mask.drawRect(-270, -40, 540, 80);
	line.addChild(mask);
	line.mask = mask;

	back.anchor.set(0.5);
	line.anchor.set(0.5);
	icon.anchor.set(0.5);
	icon.position.set(300, 0);
	mask.position.set(-540, 0);

	progressbar.addChild(back, line, icon);

	progressbar.add = function(value=2) {
		if (isComplete) return;

		money += value;		

		if (money >= maxMoney) {
			money = maxMoney;
			isComplete = true;

			playSound("sBtn");
			gsap.to(icon.scale, 0.25, {x:1.2, y:1.2, ease:'sine.out', repeat:1, yoyo:true, delay:0.25, onComplete:()=>{
				winGame();
			}});
		}

		let ratio = money / maxMoney;
		let toX = -540 + 540 * ratio;

		gsap.killTweensOf(mask);
		gsap.to(mask, 0.25, {x:toX, ease:'sine.out'});
	}

	return progressbar;
}


function createWinScreen() {
	let winScreen = new PIXI.Container();
	winScreen.visible = false;

	let back = new PIXI.Graphics();
	back.beginFill(0x251835);
	back.drawRect(-1280, -1280, 2560, 2560);	

	let icon = new PIXI.Container();
	let iconBg = new PIXI.Sprite(assets.textures.pixi['frame_blue']);
	iconBg.anchor.set(0.5);

	let light = new PIXI.Sprite(assets.textures.pixi['light']);
	light.anchor.set(0.5);
	gsap.to(light, 20, {angle:360, ease:'linear', repeat:-1});

	let airplane = new PIXI.Sprite(assets.textures.pixi['airplane']);
	airplane.anchor.set(0.5);
	airplane.y = 40;

	icon.addChild(iconBg, light, airplane);
	
	// let upgradeTxt = app.template.outlinedText({txt:params.textUpgrade.value, fontSize:68, fontFamily:'font_agency', outlineColor:0xffffff, outlineWidth:1});	
	let upgradeTxt = new PIXI.Sprite( assets.textures.pixi.upgradeText );
	upgradeTxt.anchor.set(0.5);
	
	let upgradeBtn = new PIXI.Container();
	let btnBack = new PIXI.Sprite(assets.textures.pixi['yellow_btn']);
	btnBack.anchor.set(0.5);
	let btnTxt = new PIXI.Sprite( assets.textures.pixi.upgradeBtnText );
	btnTxt.anchor.set(0.5);
	upgradeBtn.addChild(btnBack, btnTxt);

	upgradeBtn.interactive = true;
	upgradeBtn.on('pointertap', clickAd);

	winScreen.addChild(back, icon, upgradeTxt, upgradeBtn);

	winScreen.show = function() {
		winScreen.visible = true;
		gsap.to(app.obj2d.downloadBtn, 0.5, {alpha:0, visible:false});
		gsap.from(back, 0.5, {alpha:0, ease:'sine.out'});
		gsap.from(icon.scale, 1, {x:0, y:0, ease:'elastic.out', delay:0.25});		

		// upgradeTxt.children.forEach((letter, i) => {			
		// 	gsap.from(letter, 1, {alpha:0, y:50, ease:'elastic.out', delay:0.75+0.03*i});			
		// });

		gsap.to( upgradeTxt.scale, 0.5, {x: 0.95, y: 0.95, ease: 'sine.inOut', repeat: -1, yoyo: true } )

		gsap.from(btnBack, 0.5, {alpha:0, ease:'sine.out', delay:0.5});
		gsap.from(btnTxt, 0.5, {alpha:0, ease:'sine.out', delay:0.55});

		gsap.from(btnBack, 1, {y:50, ease:'elastic.out', delay:0.5});
		gsap.from(btnTxt, 1, {y:50, ease:'elastic.out', delay:0.6});

		gsap.to(btnBack, 0.5, {y:-25, ease:'quad.out', delay:1, yoyo:true, repeat:-1});
		gsap.to(btnTxt, 0.5, {y:-20, ease:'quad.out', delay:1.1, yoyo:true, repeat:-1});		
	}

	winScreen.setPortrait = function(upUI, downUI) {
		back.width = app.canvasWidth / app.obj2d.ui.scale.x;
		back.height = app.canvasHeight / app.obj2d.ui.scale.y;			

		icon.position.set(0, 0);
		upgradeTxt.position.set(0, upUI + 200);
		upgradeBtn.position.set(0, downUI - 200);
	}

	winScreen.setLandscape = function(upUI, downUI) {
		back.width = app.canvasWidth / app.obj2d.ui.scale.x;
		back.height = app.canvasHeight / app.obj2d.ui.scale.y;	
		
		icon.position.set(-320, 0);
		upgradeTxt.position.set(260, -130);
		upgradeBtn.position.set(260, 110);
	}

	return winScreen;
}