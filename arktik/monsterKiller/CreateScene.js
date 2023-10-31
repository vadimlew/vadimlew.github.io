function createScene() {	
	init3dScene();	
	init2dScene();	
}

function init3dScene() {
	app.obj3d.main = new THREE.Group();
	app.scene3d.add(app.obj3d.main);	
	app.physics = new VerletPhysics( {isDebug: false} );
	
	initCamera();
	initLights();
	initMaterials();
	initWorld();	
	initPlayer();	
	initEnemies();		
	
	//new PlayableController();
}


function initCamera() {	
	app.camera3d = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 1000);		

	app.camera3d.position.set(0, 10+30, 15+20);
	app.camera3d.lookAt(0, 0, 0);
	app.camera3d.updateProjectionMatrix();
}


function initLights() {
	app.scene3d.fog = new THREE.FogExp2( 0x00BFFF, 0.03 );
	
	let lightAmbient = new THREE.AmbientLight(0xffffff, 0.4); //0.3
	app.obj3d.lightAmbient = lightAmbient;
	app.obj3d.main.add(lightAmbient);

	let lightDirectional = new THREE.DirectionalLight(0xffffff, 0.4); //0x664F00 //0.3
	lightDirectional.position.set(-5, 30, -10);
	lightDirectional.castShadow = true;
	app.obj3d.lightDirectional = lightDirectional;
	app.obj3d.main.add(lightDirectional);

	lightDirectional.shadow.camera.left = -30;
	lightDirectional.shadow.camera.right = 30;
	lightDirectional.shadow.camera.top = 30;
	lightDirectional.shadow.camera.bottom = -30;
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

	app.materials.ground = new MixTextureShader(
		{
			map: assets.textures.three['groundMap'],	
			normalMap: assets.textures.three['stoneNormal'],			
			normalScale: new THREE.Vector2(4, 4)
		},
		{
			mapA: assets.textures.three['grass'],
			mapB: assets.textures.three['stone']			
		}
	);		

	app.materials.houseV1 = new THREE.MeshLambertMaterial({
		map: assets.textures.three['houseV1']		
	});	

	app.materials.houseV2 = new THREE.MeshLambertMaterial({
		map: assets.textures.three['houseV2']		
	});	

	app.materials.houseV3 = new THREE.MeshLambertMaterial({
		map: assets.textures.three['houseV3']		
	});	

	app.materials.fence = new THREE.MeshLambertMaterial({
		map: assets.textures.three['fence']		
	});	

	app.materials.lampPost = new THREE.MeshLambertMaterial({
		map: assets.textures.three['lampPost']		
	});	

	app.materials.lamp = new THREE.MeshBasicMaterial({
		map: assets.textures.three['lamp']		
	});	

	app.materials.barrel = new THREE.MeshLambertMaterial({
		map: assets.textures.three['barrel']		
	});	

	app.materials.crate = new THREE.MeshLambertMaterial({
		map: assets.textures.three['crate']		
	});		

	app.materials.shine = new THREE.SpriteMaterial({ 
		map: assets.textures.three['shine2'],
		opacity: 0.3,
		blending: THREE.AdditiveBlending
	});	

	app.materials.bulletTrace = new THREE.MeshLambertMaterial({
		map: assets.textures.three['bulletTrace'],
		transparent: true,
		blending: THREE.AdditiveBlending
	});  
	
	app.materials.bulletShine = new THREE.MeshLambertMaterial({
		map: assets.textures.three['bulletShine'],
		transparent: true,
		//blending: THREE.AdditiveBlending
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

	world.traverse( obj => {
		obj.castShadow = true;
		obj.receiveShadow = true;

		if ( obj.name === 'Ground' ) {
			obj.castShadow = false;
			obj.material = app.materials.ground;
		}

		if ( obj.name.includes('HouseV1') ) {
			obj.material = app.materials.houseV1;

			let rectShape = new RectangleShape( 5, 8, obj.rotation.y );
			let rectBody = new VerletBody( obj, rectShape );
			rectBody.isStatic = true;
        	app.physics.addBody( rectBody );			
		}

		if ( obj.name.includes('HouseV2') ) {
			obj.material = app.materials.houseV2;

			let rectShape1 = new RectangleShape( 5, 8, obj.rotation.y );
			let rectBody1 = new VerletBody( obj, rectShape1 );
			rectBody1.isStatic = true;
        	app.physics.addBody( rectBody1 );
			
			let rectShape2 = new RectangleShape( 12, 2, obj.rotation.y );
			let rectBody2 = new VerletBody( obj, rectShape2 );
			rectBody2.isStatic = true;
        	app.physics.addBody( rectBody2 );
		}

		if ( obj.name.includes('HouseV3') ) {
			obj.material = app.materials.houseV3;

			if ( obj.name != 'HouseV3Wing' ) {
				let circleShape = new CircleShape( 2.5 );
				let circleBody = new VerletBody( obj, circleShape );
				circleBody.isStatic = true;
				app.physics.addBody( circleBody );	
			}					
		}
		
		if ( obj.name.includes('Fence') ) {
			obj.material = app.materials.fence;

			let rectShape = new RectangleShape( 0.2, 5.8, obj.rotation.y );
			let body = new VerletBody( obj, rectShape );
			body.isStatic = true;
        	app.physics.addBody( body );
		}

		if ( obj.name.includes('Lamp') ) {
			obj.material = app.materials.lamp;			
		}
		
		if ( obj.name.includes('LampPoll') ) {
			obj.material = app.materials.lampPost;

			let rectShape = new RectangleShape( 0.8, 0.8 );
			let body = new VerletBody( obj, rectShape );
			body.isStatic = true;
        	app.physics.addBody( body );
		}		

		if ( obj.name.includes('Barrel') ) {
			obj.material = app.materials.barrel;
			let circleShape = new CircleShape( 0.75, 0.75 );
			let body = new VerletBody( obj, circleShape );
			body.isStatic = true;
        	app.physics.addBody( body );
		}

		if ( obj.name.includes('Crate') ) {
			obj.material = app.materials.crate;

			let rectShape = new RectangleShape( 1, 1, obj.rotation.y );
			let rectBody = new VerletBody( obj, rectShape );
			rectBody.isStatic = true;
        	app.physics.addBody( rectBody );
		}

		if ( obj.name.includes('LampLight') ) {
			let spotLight = new THREE.SpotLight( 0x00BFFF, 5, 15, Math.PI/2, 0.5 );
			spotLight.castShadow = false;
			spotLight.position.copy(obj.position);
			spotLight.target.position.set(obj.position.x, obj.position.y - 10, obj.position.z)

			app.obj3d.main.add(spotLight);
			app.obj3d.main.add(spotLight.target);
			
			//const spotLightHelper = new THREE.SpotLightHelper( spotLight );
			//app.obj3d.main.add( spotLightHelper );		

			let shine = new THREE.Sprite( app.materials.shine );
			shine.castShadow = false;
			shine.receiveShadow = false;
			shine.scale.setScalar(5);
			obj.add(shine);

			gsap.to( shine.scale, 1 + Math.random(), {x: 5.5, y:5.5, z: 5.5, repeat: -1, yoyo: true, ease: 'quad.inOut'});
		}

		if ( obj.name == 'HouseV3Wing' ) {
			gsap.to( obj.rotation, 9, {z: -2*Math.PI, ease: 'none', repeat: -1});
		}
	})	
}


function initPlayer() {
	let player = new Player();
	app.obj3d.player = player;
	app.obj3d.main.add( player.model );	

	app.obj3d.followCamera = new FollowCameraHelper( app.camera3d, player.model, [0, 12, 4], [0, 0, -5] );
}


function initEnemies() {	
	for ( let i=0; i < 4; i++ ) {
		let enemy = new SkeletonWarior();
		enemy.model.getObjectByName('Shield').visible = false;
		enemy.model.position.set(-2 + i, 0, -16);
		app.obj3d.main.add( enemy.model );
	}

	for ( let i=0; i < 6; i++ ) {
		let enemy = new SkeletonWarior();		
		enemy.model.position.set( -1.5 + i%3, 0, -32 + Math.floor(i/3) * 1.5 );
		app.obj3d.main.add( enemy.model );
	}	
}


function init2dScene() {
	app.obj2d.ui = new PIXI.Container();
	app.scene2d.addChild(app.obj2d.ui);
	
	app.obj2d.fsCTA = new FullScreenCTA( clickAd );
	app.obj2d.soundBtn = new SoundButton();	
	app.obj2d.joystick = new PlayerJoystickController( app.obj3d.player );	
	//app.obj2d.tutorialHand = new TutorialJoystick();	

	//let vectorTest = new VectorWorkTest();

	app.obj2d.ui.addChild(
		//app.obj2d.tutorialHand.display,			
		app.obj2d.soundBtn.display,
		app.obj2d.joystick.display,		
		app.obj2d.fsCTA.display		
	);	
}