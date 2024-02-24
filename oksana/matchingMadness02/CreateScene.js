function createScene() {
	init2dScene();
}

function init2dScene() {
	app.template = new Template();

	app.obj2d.main = new PIXI.Container();
	app.scene2d.addChild(app.obj2d.main);	
	app.obj2d.failEnd = createFail();
	app.obj2d.endScreen = createEndScreen();
	app.obj2d.gameScene = createGameScene();
	app.obj2d.firstScreen = createFirstScreen();
	app.obj2d.tutor = createTutor();

	app.obj2d.gameScene.board.addChild( app.obj2d.tutor );

	app.obj2d.fsCTA = app.template.fullScreenCTA();
	app.obj2d.soundBtn = app.template.soundButton();
	
	app.obj2d.main.addChild(
		app.obj2d.gameScene,		
		app.obj2d.failEnd,
		app.obj2d.firstScreen,
		app.obj2d.endScreen,
		app.obj2d.fsCTA,
		app.obj2d.soundBtn,
	);

	// let fireWorks = createFireWorks();
	// app.obj2d.main.addChild(fireWorks);

	// app.obj2d.endScreen.show();
};


function createEndScreen () {
	let endScreen = new PIXI.Container();	
	endScreen.visible = false;

	let btnContainer = new PIXI.Container();	

	endScreen.interactive = true;
	endScreen.on ("pointertap", clickAd);

	let bg2 = new PIXI.Sprite(assets.textures.pixi.bg2);
	endScreen.addChild(bg2);
	bg2.anchor.set(0.5);	

	let allBlack = new PIXI.Sprite(assets.textures.pixi.allBlack);
	endScreen.addChild(allBlack);
  	allBlack.anchor.set(0.5, 0.5); 

	let shefSmile = new PIXI.Sprite(assets.textures.pixi.shefSmile);
	endScreen.addChild(shefSmile);
	shefSmile.anchor.set(0.5, 0.5); 
  
	gsap.from (shefSmile.scale, 0.75, { x: 0,y: 0,ease: "back.out" });
	
	let restV2 = new PIXI.Sprite(assets.textures.pixi.restV2);
	endScreen.addChild(restV2);
	restV2.anchor.set(0.5, 0.5);	

	let upgradeBtn = new PIXI.Sprite(assets.textures.pixi.upgradeBtn);
	btnContainer.addChild(upgradeBtn);
	upgradeBtn.anchor.set(0.5, 0.5); 

	gsap.to (upgradeBtn.scale, 0.75, { x: 0.95,y: 0.95,repeat: -1, yoyo: true  });

	gsap.from (upgradeBtn, 0.75,{alpha : 0, delay: 0.5});
  
	let hand = new PIXI.Sprite(assets.textures.pixi.hand);
	btnContainer.addChild(hand);

	endScreen.addChild(btnContainer);

	hand.alpha = 0;
	hand.hitArea = new PIXI.Rectangle(0,0,0,0);

	var tl = gsap.timeline({ repeat: -1, delay: 2, repeatDelay: 3 });
	tl.to(hand, 0.5, { alpha: 1 });
	tl.to(hand.scale, 0.25, { x: 0.8, y: 0.8, repeat: 1, yoyo: true });
	tl.to(upgradeBtn.scale, 0.25, { x: 0.9, y: 0.9, repeat: 1, yoyo: true, delay: -0.25 });
	tl.to(hand, 0.5, { alpha: 0 }); 

	endScreen.portrait = function (upUI, rightUI, leftUI, downUI) {
		restV2.x = 85;
		restV2.y = 90;

		shefSmile.x = 0;
		shefSmile.y = upUI + 210;
		shefSmile.scale.set(1);	

		btnContainer.x = 0;
		btnContainer.y = downUI - 210;
		btnContainer.scale.set(1);

		allBlack.x = 0;
		allBlack.y = 0
		allBlack.scale.set(3, 3);

		bg2.width = app.canvasHeight / app.obj2d.main.scale.y;
		bg2.height = app.canvasHeight / app.obj2d.main.scale.y;
		bg2.x = 0;	
	};

	endScreen.landscape = function ( upUI, rightUI, leftUI, downUI ) {		
		restV2.x = 100;
		restV2.y = 85;		

		shefSmile.x = leftUI + 250;
		shefSmile.y = -50;
		shefSmile.scale.set(0.9);	

		btnContainer.x = rightUI - 250;
		btnContainer.y = 40;
		btnContainer.scale.set(0.7);

		allBlack.x =0;
		allBlack.y = 0
		allBlack.scale.set(3,3);
		
		bg2.width = app.canvasWidth / app.obj2d.main.scale.x + 150;
		bg2.height = app.canvasWidth / app.obj2d.main.scale.x;
		bg2.x = 75;			
	};

	endScreen.show = function () { 
		endScreen.visible = true;

		stopSound('music');
		fadeSound('music', 0.5, 0, 1000);
		playSound('win');

		gsap.from( endScreen, 1.0, { alpha: 0 });		
	};

	return endScreen;
};


function createFirstScreen() {
	let firstScreen = new PIXI.Container();	

	let bg = new PIXI.Sprite(assets.textures.pixi.bg);
	firstScreen.addChild(bg);
	bg.anchor.set(0.5, 0.5); 

	let allBlack = new PIXI.Sprite(assets.textures.pixi.allBlack);
	firstScreen.addChild(allBlack);
  	allBlack.anchor.set(0.5, 0.5); 

	let shefSmile = new PIXI.Sprite(assets.textures.pixi.shefSmile);
	firstScreen.addChild(shefSmile);
	shefSmile.anchor.set(0.5, 0.5); 

	gsap.from (shefSmile.scale, 0.75, { x: 0,y: 0,ease: "back.out" });

	let baseRestr = new PIXI.Sprite(assets.textures.pixi.baseRestr);
	firstScreen.addChild(baseRestr);
	baseRestr.anchor.set(0.5, 0.5); 
	
	gsap.from (baseRestr, 1, { alpha: 0,ease: "back.out" });

	let btnConteiner = new PIXI.Container();

	firstScreen.addChild(btnConteiner);

	let upgradeBtn = new PIXI.Sprite(assets.textures.pixi.upgradeBtn);
	btnConteiner.addChild(upgradeBtn);
	upgradeBtn.anchor.set(0.5, 0.5); 

	upgradeBtn.interactive = true;

	upgradeBtn.on ("pointertap", pointerDownHander);

	function pointerDownHander (event) {
		playSound('button');
		firstScreen.hide();
		upgradeBtn.interactive = false;
		app.obj2d.gameScene.show();
		clearTimeout(timerFailEnd);		
	} ;

	gsap.to (upgradeBtn.scale, 0.75, { x: 0.95,y: 0.95,repeat: -1, yoyo: true  });

	gsap.from (upgradeBtn, 0.75,{alpha : 0, delay: 0.5});
  
	let hand = new PIXI.Sprite(assets.textures.pixi.hand);
	btnConteiner.addChild(hand);

	hand.alpha = 0;
	hand.hitArea = new PIXI.Rectangle(0,0,0,0);

	var tl = gsap.timeline({ repeat: -1, delay: 2, repeatDelay: 3 });
	tl.to(hand, 0.5, { alpha: 1 });
	tl.to(hand.scale, 0.25, { x: 0.8, y: 0.8, repeat: 1, yoyo: true });
	tl.to(upgradeBtn.scale, 0.25, { x: 0.9, y: 0.9, repeat: 1, yoyo: true, delay: -0.25 });
	tl.to(hand, 0.5, { alpha: 0 }); 

	let timerFailEnd = setTimeout ( ()=>{
		app.obj2d.failEnd.show();
		firstScreen.hide()
	}, 8000)
	//timeout если нажал на кнопку - clear timeout

	firstScreen.portrait = function( upUI, rightUI, leftUI, downUI ) {		
		bg.width = app.canvasHeight / app.obj2d.main.scale.y;
		bg.height = app.canvasHeight / app.obj2d.main.scale.y;	
		
		allBlack.x =0;
		allBlack.y = 0
		allBlack.scale.set(3,3);
		
		hand.x = 80
		hand.y = 0;

		shefSmile.x = 0;
		shefSmile.y = upUI + 210;

		baseRestr.x = 0;
		baseRestr.y = 20;

		btnConteiner.x = 0;
		btnConteiner.y = downUI - 210;
		btnConteiner.scale.set(1);
	};

	firstScreen.landscape = function (upUI, rightUI, leftUI, downUI) {
		bg.width = app.canvasWidth / app.obj2d.main.scale.x;
		bg.height = app.canvasWidth / app.obj2d.main.scale.x;		

		allBlack.x =0;
		allBlack.y = 0
		allBlack.scale.set(3,3);

		shefSmile.x = leftUI + 250;
		shefSmile.y = -50;
		shefSmile.scale.set(0.9);		
		
		baseRestr.scale.set(1);

		hand.x = 80
		hand.y = 0;

		btnConteiner.x = rightUI - 250;
		btnConteiner.y = +40;
		btnConteiner.scale.set(0.7);
	};

	firstScreen.show = function () { 
		firstScreen.visible = true;

		gsap.from( shefSmile, 0.25, { alpha: 0 });
		gsap.from( baseRestr, 0.25, { alpha: 0 });
		gsap.from( allBlack, 0.25, { alpha: 0 });
		gsap.from( hand, 0.25, { alpha: 0 });
		gsap.from( upgradeBtn, 0.25, { alpha: 0 });
	};

	firstScreen.hide = function () { 
		gsap.to( firstScreen, 0.5, { alpha: 0, onComplete: ()=>firstScreen.visible = false });
	};

	return firstScreen
};



function createFail() {
	let failEnd = new PIXI.Container();

	failEnd.visible = false;

	let bg = new PIXI.Sprite(assets.textures.pixi.bg);
	failEnd.addChild(bg);
	bg.anchor.set(0.5, 0.5); 

	let allBlack = new PIXI.Sprite(assets.textures.pixi.allBlack);
	failEnd.addChild(allBlack);
  	allBlack.anchor.set(0.5, 0.5); 

	let tryAgainBtn = new PIXI.Sprite(assets.textures.pixi.tryAgainBtn);
	failEnd.addChild(tryAgainBtn);
	tryAgainBtn.anchor.set(0.5, 0.5); 

	tryAgainBtn.interactive = true;
	tryAgainBtn.on ("pointertap", clickAd);

	gsap.to (tryAgainBtn.scale, 0.75, { x: 0.9,y: 0.9,repeat: -1, yoyo: true  });

	let worriedShef = new PIXI.Sprite(assets.textures.pixi.worriedShef);
	failEnd.addChild(worriedShef);
	worriedShef.anchor.set(0.5, 0.5); 


	let fail = new PIXI.Sprite(assets.textures.pixi.fail);
	failEnd.addChild(fail);
	fail.anchor.set(0.5, 0.5); 
	

	failEnd.portrait = function( upUI, rightUI, leftUI, downUI  ) {		
		worriedShef.x = 0;
		worriedShef.y = 0;
		worriedShef.scale.set(1);

		allBlack.x =0;
		allBlack.y = 0
		allBlack.scale.set(3,3);

		bg.width = app.canvasHeight / app.obj2d.main.scale.y;
		bg.height = app.canvasHeight / app.obj2d.main.scale.y;	
		
		fail.x = 0;
		fail.y = upUI + 230;
		fail.scale.set(0.85);

		tryAgainBtn.x = 0;
		tryAgainBtn.y = downUI - 200;
	
	};
	failEnd.landscape = function (upUI, rightUI, leftUI, downUI ) {		
		worriedShef.x = -300;
		worriedShef.y = 50;
		worriedShef.scale.set(0.8);
		
		
		fail.x = -300;
		fail.y = -250;
		fail.scale.set(0.7);

		bg.width = app.canvasWidth / app.obj2d.main.scale.x;
		bg.height = app.canvasWidth / app.obj2d.main.scale.x;
		

		allBlack.x =0;
		allBlack.y = 0
		allBlack.scale.set(3,3);
		
		tryAgainBtn.x = +300;
		tryAgainBtn.y = 0;
	};
	failEnd.show = function () { 

		failEnd.visible = true;
		stopSound('music');
		fadeSound('music', 0.5, 0, 1000);
		playSound('fail');

		gsap.from (worriedShef.scale, 0.75, { x: 0,y: 0,ease: "back.out" });
		gsap.from (fail.scale, 0.5, { x: 0,y: 0,ease: "back.out" });

		// gsap.from( fail, 0.25, { alpha: 0 });
		gsap.from( tryAgainBtn, 0.25, { alpha: 0 });
	};

	return failEnd;
};

function getColorByName( name ) {
	switch( name ) {
		case 'cheese': return 0xfef556; break;
		case 'tomato': return 0xe53e2f; break;
		case 'carrot': return 0xf37411; break;
		case 'baklagani': return 0xa72dfe; break;
		case 'pappier': return 0x48ba1c; break;
		case 'water': return 0x0676f7; break;
	}	
}

function createDynamit( sprite ) {
	let dynamit = new PIXI.Container();
	
	sprite.scale.set(0.35);
	sprite.interactive = false;

	let fire = new PIXI.Sprite( assets.textures.pixi.fire );
	fire.anchor.set(0.5);
	fire.scale.set(0.5);
	fire.position.set(-60, -70);

	gsap.to(sprite, 0.2 + 0.05 * Math.random(), {angle: -5, ease: 'sine.inOut', yoyo: true, repeat: -1});
	gsap.to(fire.scale, 0.1, {x: 0.6, y: 0.6, ease: 'quad.inOut', yoyo: true, repeat: -1});	

	sprite.addChild(fire);
	dynamit.addChild(sprite);

	dynamit.on('removed', () => {
		gsap.killTweensOf(sprite);
		gsap.killTweensOf(fire.scale);
	});

	return dynamit;
}

function createRocket( sprite ) {
	let rocket = new PIXI.Container();
	
	sprite.scale.set(0.35);
	sprite.interactive = false;

	let fire = new PIXI.Sprite( assets.textures.pixi.fire );
	fire.anchor.set(0.5);
	fire.scale.set(0.5);
	fire.position.set(-60, 70);

	gsap.to(sprite, 0.2 + 0.05 * Math.random(), {angle: -5, ease: 'sine.inOut', yoyo: true, repeat: -1});	
	gsap.to(fire.scale, 0.1, {x: 0.6, y: 0.6, ease: 'quad.inOut', yoyo: true, repeat: -1});	

	sprite.addChild(fire);
	rocket.addChild(sprite);

	return rocket;
}

function createDiscoball( sprite ) {
	let discoBall = new PIXI.Container();
	
	sprite.scale.set(0.35);
	sprite.interactive = false;
	
	// gsap.to(sprite, 0.3, {angle: -5, ease: 'sine.inOut', yoyo: true, repeat: -1});
	gsap.to(sprite, 7.0, {angle: 360, ease: 'linear', repeat: -1});		
	
	discoBall.addChild(sprite);

	return discoBall;
}

function createExplosion(x, y) {
	let exploisen = new PIXI.Container();	
	exploisen.position.set(x, y);

	let flash = new PIXI.Sprite( assets.textures.pixi.flash );
	flash.anchor.set(0.5);
	flash.scale.set(1.5);	
	flash.blendMode = PIXI.BLEND_MODES.ADD;

	for (let index = 0; index < 14; index++) {
		let radius = 120 + 20 * Math.random();
		let angle = index * 2 * Math.PI / 14 + Math.PI / 6 * Math.random();
		let x = radius * Math.cos(angle);
		let y = radius * Math.sin(angle);
		let blowPart = new PIXI.Sprite( assets.textures.pixi.smoke3 );
		blowPart.anchor.set(0.5);
		blowPart.scale.set(0.0);
		blowPart.rotation = angle + Math.PI/2;

		gsap.to( blowPart, 0.6, {x, y, ease: 'cubic.out'} );
		gsap.to( blowPart, 0.6, {alpha: 0, delay: 0.3} );
		gsap.to( blowPart.scale, 0.3, {x: 1, y: 1, ease: 'cubic.in'} );
		gsap.to( blowPart.scale, 0.3, {x: 0, y: 0, delay: 0.3, ease: 'cubic.out'} );

		exploisen.addChild(blowPart);
	}

	for (let index = 0; index < 12; index++) {
		let radius = 80 + 20 * Math.random();
		let angle = index * 2 * Math.PI / 12 + Math.PI / 7 * Math.random();
		let x = radius * Math.cos(angle);
		let y = radius * Math.sin(angle);
		let blowPart = new PIXI.Sprite( assets.textures.pixi.smoke2 );
		blowPart.anchor.set(0.5);
		blowPart.scale.set(0.0);
		blowPart.rotation = angle + Math.PI/2;

		gsap.to( blowPart, 0.5, {x, y, ease: 'cubic.out'} );
		gsap.to( blowPart, 0.5, {alpha: 0, delay: 0.25} );
		gsap.to( blowPart.scale, 0.25, {x: 1, y: 1, ease: 'cubic.in'} );
		gsap.to( blowPart.scale, 0.25, {x: 0, y: 0, delay: 0.25, ease: 'cubic.out'} );

		exploisen.addChild(blowPart);
	}

	exploisen.addChild(flash);

	for (let index = 0; index < 8; index++) {
		let radius = 40 + 20 * Math.random();
		let angle = index * 2 * Math.PI / 8 + Math.PI / 8 * Math.random();
		let x = radius * Math.cos(angle);
		let y = radius * Math.sin(angle);
		let blowPart = new PIXI.Sprite( assets.textures.pixi.smoke1 );
		blowPart.anchor.set(0.5);
		blowPart.scale.set(0.0);
		blowPart.rotation = angle + Math.PI/2;

		gsap.to( blowPart, 0.5, {x, y, ease: 'cubic.out'} );
		gsap.to( blowPart, 0.5, {alpha: 0, delay: 0.25} );
		gsap.to( blowPart.scale, 0.25, {x: 1, y: 1, ease: 'cubic.in'} );
		gsap.to( blowPart.scale, 0.25, {x: 0, y: 0, delay: 0.25, ease: 'cubic.out'} );

		exploisen.addChild(blowPart);
	}	

	gsap.to( flash, 0.25, {alpha: 0, delay: 0.25} );
	gsap.from( flash.scale, 0.5, {x: 0, y: 0, ease: 'quad.out' } );

	gsap.delayedCall( 1.0, onComplete );
	function onComplete() {
		exploisen.destroy();
	}

	return exploisen;
}

function createFlyingRocket(x, y, nx, ny) {
	let rocket = new PIXI.Container();
	rocket.position.set(x + nx * 20, y + ny * 20);
	rocket.scale.set(0.7);

	rocket.rotation = Math.PI/2 + Math.atan2(ny, nx);

	let cap = new PIXI.Sprite(assets.textures.pixi.rocketCap);
	cap.anchor.set(0.5);
	cap.scale.set(0.35);

	let trail = new PIXI.Sprite(assets.textures.pixi.rocketTrail);
	trail.anchor.set(1.0, 0.5);
	trail.angle = -90;

	gsap.to(rocket, 1.0, { x: x + nx*1800, y: y + ny*1800, ease: 'quad.in' });

	gsap.from(trail.scale, 0.2, {x: 0.0, ease: 'sine.in'});
	gsap.to(trail.scale, 0.25, {x: 0.95, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 0.2});
	gsap.to(trail.scale, 0.2, {y: 0.96, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 0.2});

	for (let index = 0; index < 25; index++) {
		let smoke = new PIXI.Sprite(assets.textures.pixi.smoke3);
		smoke.anchor.set(0.5);
		smoke.x = 25 * Math.random() * (index % 2 === 0 ? 1 : -1);
		smoke.y = 20 + 20 * Math.random();	
		smoke.scale.set(0.7);
		smoke.alpha = 0;

		let delay = index * 0.05;

		gsap.to( smoke, 0.2, {alpha: 1, ease: 'quad.in', repeat: -1, delay, repeatDelay: 0.8 } );
		gsap.to( smoke, 0.5, {y: 380, x: 0, ease: 'quad.in', repeat: -1, delay, onUpdate: ()=>{
			let scale = Math.min( 0.6, (380 - smoke.y) / 150); 
			smoke.scale.set(scale);
		}} );		

		rocket.addChild(smoke);
	}

	rocket.addChild(cap, trail);

	return rocket;
}

function createTutor () {
	let tutor = new PIXI.Container();
	tutor.visible = false;
	tutor.x = -5;
	tutor.y = -57;
	
	let blackTutor = new PIXI.Sprite(assets.textures.pixi.blackTutor);
	tutor.addChild(blackTutor);
	blackTutor.anchor.set(0.5, 0.5);	
	blackTutor.hitArea = new PIXI.Rectangle(0, 0, 0, 0);

	let playMore = createPlayMore();
	tutor.addChild( playMore );
	
	let hand = new PIXI.Sprite(assets.textures.pixi.hand);
	tutor.addChild(hand);
	hand.anchor.set(0.5, 0.5);
	hand.y = 190;
	hand.x = -75;
	hand.hitArea = new PIXI.Rectangle(0, 0, 0, 0);

	var tl = gsap.timeline({repeat: -1, repeatDelay: 1, paused: true, delay: 0.5});
	tl.from(hand, 0.4, {alpha: 0});
	tl.to(hand, 0.5, {x: -10});	
	tl.to(hand, 0.5, {alpha: 0});

	tutor.show = function() {
		tutor.visible = true;
		gsap.from( tutor, 0.5, { alpha: 0 });
		tl.play();
	};

	tutor.hide = function() {
		tl.pause(0);
		gsap.to( tutor, 0.5, { alpha: 0, onComplete: ()=> tutor.visible = false });
	};

	return tutor;
};


function createPlayMore() { 
	let PlayMore = new PIXI.Sprite( assets.textures.pixi.PlayMore );	
	PlayMore.anchor.set(0.5, 0.5);
	PlayMore.interactive = true;
	PlayMore.on( 'pointertap', clickAd );
	
	return PlayMore;
};

function createPlayMoreBtnBrown() { 
	let playMoreBtnBrown = new PIXI.Sprite( assets.textures.pixi.playMoreBtnBrown );	
	playMoreBtnBrown.anchor.set(0.5, 0.5);
	playMoreBtnBrown.interactive = true;
	playMoreBtnBrown.on( 'pointertap', clickAd );

	return playMoreBtnBrown;
};


class Drop extends Particle {

	constructor( emitter ) {
        super();
        this.emitter = emitter;
        this.initDisplay();
        this.reset();        
    }

    initDisplay() {
        this.display = new PIXI.Sprite( assets.textures.pixi.drop );
		this.display.anchor.set(0.5);
		// app.obj2d.gameScene.board.addChild( this.display );
    }

    reset( x, y, tint ) {
		this.display.visible = true;
		this.display.position.set(x, y);
		this.display.angle = 0;
		this.velocity.x = -15 + 30 * Math.random();
		this.velocity.y = 2 + 2 * Math.random();
		this.display.scale.x = 0.3 + 0.25 * Math.random();
		this.display.scale.y = this.display.scale.x;
		this.display.alpha = 1;		
		this.display.tint = tint;
    }

    update() {
        this.display.x += this.velocity.x;
        this.display.y += this.velocity.y;

		this.velocity.x *= 0.93;
		this.velocity.y += 1.0;

		this.display.angle = -this.velocity.x * 4;
		this.display.alpha -= 0.035;              

        if ( this.display.alpha <= 0 ) {
            this.display.visible = false;
            this.emitter.onParticleComplete( this );
        }
    }
};


