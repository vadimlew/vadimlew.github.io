function createScene() {
	init2dScene();
	// console.log( boarModel.swapTiles(50, 51) );
}

function init2dScene() {
	app.template = new Template();

	app.obj2d.main = new PIXI.Container();
	app.scene2d.addChild(app.obj2d.main);
	
	app.obj2d.gameScene = createGameScene();
	app.obj2d.tutor = createTutor();
	setTimeout( app.obj2d.tutor.show, 1000 );	

	app.obj2d.gameScene.board.display.addChild( app.obj2d.tutor );
	app.obj2d.finish = createFinishWin();

	app.obj2d.fsCTA = app.template.fullScreenCTA();
	app.obj2d.soundBtn = app.template.soundButton();

	app.emitter = new ParticleEmitter( Drop );	
	
	app.obj2d.main.addChild(		
		app.obj2d.gameScene,		
		app.obj2d.finish,
		app.obj2d.fsCTA,
		app.obj2d.soundBtn		
	);

	// setTimeout( app.obj2d.finish.show, 1000 );
};


function createGameScene() {
	let gameScene = new PIXI.Container();

	let bg1 = new PIXI.Sprite(assets.textures.pixi.bg);
	gameScene.addChild(bg1);
	bg1.anchor.set(0.5, 0.5);
	bg1.interactive = true;	

	let bg2 = new PIXI.Sprite(assets.textures.pixi.bg);
	gameScene.addChild(bg2);
	bg2.anchor.set(0.5, 0.5);
	bg2.interactive = true;	
	bg2.x = bg2.width;

	gsap.to(bg1, 10, {x: -bg1.width, ease: 'linear', repeat: -1});
	gsap.to(bg2, 10, {x: 0, ease: 'linear', repeat: -1});

	let girl = new PIXI.Sprite(assets.textures.pixi.girl);
	gameScene.addChild(girl);
	girl.anchor.set(0.5, 0.5);

	let boarModel = new BoardModel(8, 11, ["yellow", "red", "green", "blue"], {"rocket1": 0, "rocket2": 0, "bomb": 0});
	boarModel.tiles = [
		"bomb", "yellow", "red", "red", "green", "green","red","bomb",
		"blue", "yellow", "blue", "red", "green","yellow", "green","green",
		"green","green", "yellow", "blue", "red","red", "blue", "red",
		"blue", "yellow","blue","red","green", "yellow","red","blue",
		"yellow","blue", "blue", "red", "red", "blue","red", "yellow",
		"rocket2", "green","rocket1","yellow", "blue", "green","green", "rocket2",
		"green", "yellow", "green", "blue", "green", "green", "blue", "blue",
		"red", "red", "yellow", "yellow", "red","yellow", "blue", "yellow",
		"blue","yellow", "blue","red","blue", "yellow", "green", "green",
		"yellow","blue","blue", "red", "red","blue","red", "green",
		"bomb","yellow","red","yellow","yellow","green","yellow", "bomb",
	];

	let board = new BoardView(boarModel);
	gameScene.addChild(board.display);
	gameScene.board = board;

	let downloadBtn = createDownloadButton();
	gameScene.addChild( downloadBtn );

	gameScene.portrait = function( upUI, downUI ) {		
		girl.x = 0;
		girl.y = upUI + 230;
		girl.scale.set(0.55);

		board.display.x = 0;
		board.display.y = 30;
		board.display.scale.set(1);

		bg1.width = app.canvasHeight / app.obj2d.main.scale.y;
		bg1.height = app.canvasHeight / app.obj2d.main.scale.y;	

		downloadBtn.x = 0;
		downloadBtn.y = downUI - 120;
	};

	gameScene.landscape = function (upUI) {		
		girl.x = -300;
		girl.y = -100;	
		girl.scale.set(0.8);	
		
		board.display.x = 250;
		board.display.y = 0;
		board.display.scale.set(0.9);

		bg1.width = app.canvasWidth / app.obj2d.main.scale.x;
		bg1.height = app.canvasWidth / app.obj2d.main.scale.x;
		
		downloadBtn.x = -300;
		downloadBtn.y = 180;
	};

	gameScene.hide = function () { 
		// gsap.to( board, 0.25, { alpha: 0 });
		gsap.to( downloadBtn, 0.25, { alpha: 0 });
	}

	return gameScene;
};


function createTutor () {
	let tutor = new PIXI.Container();
	tutor.visible = false;
	tutor.x = -5;
	tutor.y = -57;
	
	let blackTutor = new PIXI.Sprite(assets.textures.pixi.blackTutor);
	tutor.addChild(blackTutor);
	blackTutor.anchor.set(0.5, 0.5);	
	blackTutor.hitArea = new PIXI.Rectangle(0, 0, 0, 0);
	blackTutor.y -= 64;
	
	let hand = new PIXI.Sprite(assets.textures.pixi.hand);
	tutor.addChild(hand);
	hand.anchor.set(0.5, 0.5);
	hand.y = 180 - 64;
	hand.x = -90;
	hand.hitArea = new PIXI.Rectangle(0, 0, 0, 0);

	var tl = gsap.timeline({repeat: -1, repeatDelay: 1, paused: true, delay: 0.5});
	tl.from(hand, 0.4, {alpha: 0});
	tl.to(hand, 0.5, {x: -25});	
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


function createDownloadButton() { 
	let downloadBtn = new PIXI.Sprite( assets.textures.pixi.downloadBtn );	
	downloadBtn.anchor.set(0.5, 0.5);
	downloadBtn.interactive = true;
	downloadBtn.on( 'pointertap', clickAd );

	return downloadBtn;
}


function createFinishWin() {
	let finish = new PIXI.Container();	
	finish.visible = false;

	let black = new PIXI.Sprite(assets.textures.pixi.black);	
	black.anchor.set(0.5, 0.5);
	black.scale.set(1.5);
	black.alpha = 0.8;
	black.interactive = true;
	black.on( 'pointertap', clickAd );
	finish.addChild(black);

	let downloadBtn = new PIXI.Sprite(assets.textures.pixi.playMore);	
	downloadBtn.anchor.set(0.5, 0.5);	
	downloadBtn.interactive = true;
	downloadBtn.on( 'pointertap', clickAd );
	finish.addChild(downloadBtn);

	let logo = new PIXI.Sprite(assets.textures.pixi.logo);	
	logo.hitArea = new PIXI.Rectangle(0,0,0,0);
	logo.anchor.set(0.5, 0.5);
	logo.scale.set(0.7);
	finish.addChild(logo);

	finish.portrait = function (upUI,downUI) {		
		logo.x = 0;		
		logo.y = -100;		

		downloadBtn.x = 0;
		downloadBtn.y = downUI - 240;
	};

	finish.landscape = function (upUI, rightUI, downUI) {		
		logo.x = -240;		
		logo.y = 0;		

		downloadBtn.x = 310;
		downloadBtn.y = 0;
	};	

	finish.show = function () {
		stopSound('bg');
		playSound('packshot');

		app.obj2d.gameScene.hide();

		finish.visible = true;

		gsap.from( black, 0.5, {alpha: 0});		

		gsap.from( logo.scale, 1.0, { x: 0.0, y: 0.0, ease: 'elastic.out', delay: 0.25 });	

		gsap.from( downloadBtn.scale, 0.5, { x: 0.0, y: 0.0, ease: 'back.out', delay: 0.5 });	
		gsap.to( downloadBtn.scale, 0.75, { x: 0.87, y: 0.87, repeat: -1, yoyo: true, delay: 1.0 });		
	}

	return finish;
};