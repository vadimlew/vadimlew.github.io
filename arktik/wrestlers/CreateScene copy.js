function createScene() {
	init2dScene();
}

function init2dScene() {
	app.template = new Template();

	app.obj2d.main = new PIXI.Container();
	app.scene2d.addChild(app.obj2d.main);
	
	app.obj2d.gameScene = heroSelectScene();
	app.obj2d.tutor = createTutor();
	setTimeout( app.obj2d.tutor.show, 1000 );

	app.obj2d.gameScene.board.addChild( app.obj2d.tutor );

	app.obj2d.finish = createFinish();

	app.obj2d.fsCTA = app.template.fullScreenCTA();
	app.obj2d.soundBtn = app.template.soundButton();
	
	app.obj2d.main.addChild(		
		app.obj2d.gameScene,		
		app.obj2d.finish,
		app.obj2d.fsCTA,
		app.obj2d.soundBtn		
	);
};


function heroSelectScene() {
	let gameScene = new PIXI.Container();

	let bg = new PIXI.Sprite(assets.textures.pixi.bg);
	gameScene.addChild(bg);
	bg.anchor.set(0.5, 0.5);
	bg.interactive = true;
	
	let logo = new PIXI.Sprite(assets.textures.pixi.logo);
	gameScene.addChild(logo);
	logo.anchor.set(0.5, 0.5);	

	let board = createBoard();
	gameScene.addChild(board);
	gameScene.board = board;

	//let downloadBtn = createDownloadButton();
	//gameScene.addChild( downloadBtn );

	gameScene.portrait = function( upUI, downUI ) {		
		logo.x = 0;
		logo.y = upUI + 140;

		board.x = 0;
		board.y = 30;
		board.scale.set(1);

		bg.width = app.canvasHeight / app.obj2d.main.scale.y;
		bg.height = app.canvasHeight / app.obj2d.main.scale.y;	

		downloadBtn.x = 0;
		downloadBtn.y = downUI - 120;
	};

	gameScene.landscape = function (upUI) {		
		logo.x = -300;
		logo.y = -100;		
		
		board.x = 250;
		board.y = 0;
		board.scale.set(0.9);

		bg.width = app.canvasWidth / app.obj2d.main.scale.x;
		bg.height = app.canvasWidth / app.obj2d.main.scale.x;
		
		//downloadBtn.x = -300;
		//downloadBtn.y = 150;
	};

	gameScene.hide = function (upUI) { 
		gsap.to( logo, 0.25, { alpha: 0 });
		gsap.to( board, 0.25, { alpha: 0 });
		gsap.to( downloadBtn, 0.25, { alpha: 0 });
	}

	return gameScene;
};

function createBoard() {
	let tiles = [];
	let isDown = false;
	let isSwapped = false;
	let mouse = {x:0, y:0};
	let currentTileIndex;
	let swapTime = 0.4;
	let tileSize = 64;
	let boardCol = 8;
	let boardRow = 11;
	let startX = -(boardCol-1) * 0.5 * tileSize;
	let startY = -(boardRow-1) * 0.5 * tileSize;

	let moveSteps = 0;
	let dynamitCount = 0;
	let isDynamitTutor = false;

	let board = new PIXI.Container();
	board.interactive = true;

	let boardBg = new PIXI.Sprite(assets.textures.pixi.boardBg);
	boardBg.anchor.set(0.5, 0.5);	
	boardBg.scale.set(0);
	board.addChild(boardBg);	
	
	gsap.to (boardBg.scale, 0.35, {x:1, y:1, ease: "sine.out"});

	// 8 to 11
	let data = [
		"cheese", "cheese", "tomato", "carrot", "baklagani", "baklagani","pappier","baklagani",
		"water", "cheese", "water", "tomato", "baklagani","cheese", "pappier","pappier",
		"pappier","pappier", "carrot", "baklagani", "tomato","tomato", "water", "carrot",
		"water", "cheese","water","tomato","baklagani", "cheese","pappier","pappier",
		"baklagani","water", "water", "tomato", "baklagani", "water","tomato", "baklagani",
		"tomato", "pappier","cheese","pappier", "carrot", "pappier","carrot", "pappier",
		"carrot", "pappier", "baklagani", "pappier", "baklagani", "baklagani", "water", "water",
		"tomato", "tomato", "pappier", "water", "water","carrot", "water", "cheese",
		"water","cheese", "water","tomato","baklagani", "cheese", "pappier", "pappier",
		"baklagani","water","water", "tomato", "tomato","water","tomato", "baklagani",
		"carrot","cheese","tomato","cheese","cheese","carrot","carrot", "baklagani",
	];

	for ( let i = 0; i < data.length; i++ ){
		let column = i%boardCol ;
		let row = Math.floor(i/boardCol);		

		let spriteName = data[i];
		let tile = new PIXI.Sprite( assets.textures.pixi[spriteName] );
		tile.interactive = true;
		tile.anchor.set(0.5, 0.5);
		tile.name = spriteName;

		tile.x = startX + column * tileSize;
		tile.y = startY + row * tileSize;
		tile.scale.set(0);
		gsap.to( tile.scale, 0.2, {x:1, y:1, ease: "sine.out", delay: 0.35+i*0.01} );
		boardBg.addChild(tile);
		tiles.push(tile);		
	};
	
	function swapTile( index, dx, dy ) {
		let direction;
		
		if (Math.abs(dx) > Math.abs(dy)) {
			direction = dx > 0 ? "right" : "left";
		} else {
			direction = dy < 0 ? "up" : "down";
		};	
		
		let column = index % boardCol;
		let row = Math.floor( index / boardCol);
		
		let tile1, tile2;

		switch( direction ) {
			case "right":
				if ( column != 7 ) {
					let swappedIndex = index + 1;
					tile1 = tiles[ index ];
					tile2 = tiles[ swappedIndex ];								
				}
			break;

			case "left":
				if ( column != 0 ) {
					let swappedIndex = index - 1;
					tile1 = tiles[ index ];
					tile2 = tiles[ swappedIndex ];								
				}
			break;

			case "up":
				if ( row != 0 ) {
					let swappedIndex = index - boardCol;
					tile1 = tiles[ index ];
					tile2 = tiles[ swappedIndex ];									
				}
			break;

			case "down":
				if ( row != 10 ) {
					let swappedIndex = index + boardCol;
					tile1 = tiles[ index ];
					tile2 = tiles[ swappedIndex ];							
				}
			break;
		}

		if ( tile1 && tile2 && tile1.visible && tile2.visible ) {
			isSwapped = true;
			playSound('Move');

			let index1 = tiles.indexOf( tile1 );
			let index2 = tiles.indexOf( tile2 );

			tiles[index1] = tile2;
			tiles[index2] = tile1;

			gsap.to( tile1, swapTime, { x: tile2.x, y: tile2.y, ease: 'back.inOut' });
			gsap.to( tile2, swapTime, { x: tile1.x, y: tile1.y, ease: 'back.inOut', onComplete: ()=>{

				if ( tile1.name === 'dinamit' ) {
					bigBadaBoom( tile1 );
					return;
				} 

				if ( tile2.name === 'dinamit' ) {
					bigBadaBoom( tile2 ); 
					return;
				}

				let isCombination = findCombinations();

				if ( !isCombination ) {		
					playSound('Move');

					gsap.to( tile1, swapTime, { x: tile2.x, y: tile2.y, ease: 'back.inOut' });
					gsap.to( tile2, swapTime, { x: tile1.x, y: tile1.y, ease: 'back.inOut', onComplete: ()=>{
						isSwapped = false;
					}});

					let index1 = tiles.indexOf( tile1 );
					let index2 = tiles.indexOf( tile2 );

					tiles[index1] = tile2;
					tiles[index2] = tile1;

				} else {

					// isSwapped = false;
					moveSteps++;

				}
			}});
		}
	};


	function bigBadaBoom(tile) {
		let boom = app.obj2d.boom;

		tile.parent.addChild( boom );

		boom.x = tile.x;
		boom.y = tile.y;
		boom.play();
		gsap.to( boom.scale, 0.5, { x: 3.0, y: 3.0, ease: 'sine.in' });		

		gsap.to( board, 0.05, {x: '+= 15', ease: 'quad.inOut', yoyo: true, repeat: 6, delay: 0.25 });
		gsap.to( board, 0.07, {y: '+= 15', ease: 'cubic.inOut', yoyo: true, repeat: 6, delay: 0.25 });

		board.off("pointerdown", pointerDownHander);
		board.off("pointerup", pointerUpHander);
		board.off("pointermove", pointerMoveHander);

		app.handTimeline.pause(0);

		gsap.delayedCall( 0.3, () => {
			for ( let tile of tiles ) {
				let dx = tile.x - boom.x;
				let dy = tile.y - boom.y;
				let distance = Math.sqrt(dx * dx + dy * dy);
				let delay = Math.max( distance / 1000 - 0.2, 0 );
	
				gsap.to( tile, 0.25, {alpha: 0, delay});
				gsap.to( tile.scale, 0.25, {x: 2.5, y: 2.0, ease: 'sine.in', delay, onComplete: ()=>{
					if (tile.name != 'dinamit') app.emitter.add( tile.x, tile.y, getColorByName(tile.name), 2 );
					tile.visible = false;					
				}});
			}
		})

		gsap.delayedCall( 1.0, () => {
			app.obj2d.gameScene.hide();
			app.obj2d.finish.show();
		})		

		playSound('dynamit');
	}


	function fallTiles() {
		for ( let colCount=0; colCount < boardCol; colCount++ ) {
			let empty = [];
			let moved = [];
			let startIndex = colCount;
			let endIndex = startIndex + 88;

			for ( let index = endIndex; index >= startIndex; index -= boardCol ) {
				let tile = tiles[ index ];
				
				if ( tile === null ) {
					empty.push( index );
				} else if ( empty.length > 0 ) {
					tiles[ index ] = null;
					tiles[ empty.shift() ] = tile;
					empty.push(index);
					moved.push(tile);
				}			
			}	
			
			for ( let tile of moved ) {
				let index = tiles.indexOf(tile);
				let newY = startY + Math.floor( index / boardCol ) * tileSize;
				let dy = newY - tile.y;
				let time = Math.floor(dy / tileSize) * 0.2;				
				gsap.to( tile, time, { y: newY, ease: 'back.out(1.25)', delay: 0.25 });				
			}
		}		
	}


	function fillEmptyTiles( onComplete ) {
		let maxFallTime = 0;

		for ( let colCount=0; colCount < boardCol; colCount++ ) {
			let empty = [];			
			let startIndex = colCount;
			let endIndex = startIndex + 88;

			for ( let index = endIndex; index >= startIndex; index -= boardCol ) {
				let tile = tiles[ index ];
				
				if ( tile === null ) {
					empty.push( index );
				}
			}	
			 
			for ( let index of empty ) {
				let column = index % boardCol ;
				let row = Math.floor( index / boardCol );		

				let spriteName = getRandomSpriteName();
				let tile = new PIXI.Sprite( assets.textures.pixi[spriteName] );
				tile.interactive = true;
				tile.anchor.set(0.5, 0.5);
				tile.name = spriteName;
				
				if ( spriteName === 'dinamit' ) {
					gsap.to( tile.scale, 0.3, {x: 0.9, y: 0.9, ease: 'quad.inOut', yoyo: true, repeat: -1});
					gsap.to( tile, 0.25, {angle: -10, ease: 'quad.inOut', yoyo: true, repeat: -1});

					if ( !isDynamitTutor ) {
						isDynamitTutor = true;						
						
						let hand = new PIXI.Container();
						let handSprite = new PIXI.Sprite( assets.textures.pixi.hand );						
						handSprite.anchor.set(0.44, 0.1);
						hand.addChild(handSprite);
						app.obj2d.main.addChild(hand);
						
						hand.hitArea = new PIXI.Rectangle(0, 0, 0, 0);

						var tl = gsap.timeline({repeat: -1, repeatDelay: 1, delay: 2.5});
						tl.from(handSprite, 0.4, {alpha: 0});
						tl.to(handSprite.scale, 0.25, {x: 0.8, y: 0.8, ease: 'quad.inOut' });	
						tl.to(handSprite, 0.5, {x: 64, ease: 'sine.inOut' });	
						tl.to(handSprite.scale, 0.25, {x: 1.0, y: 1.0, ease: 'quad.inOut' });						
						tl.to(handSprite, 0.5, {alpha: 0});

						app.handTimeline = tl;

						gsap.ticker.add(() => {
							app.obj2d.main.toLocal( tile.position, boardBg, hand.position );
						});
					}
				}

				tile.x = startX + column * tileSize;
				tile.y = startY - tileSize * (empty.indexOf( index ) + 1);
				tile.alpha = 0;

				let placeY = startY + row * tileSize;				
				
				boardBg.addChild(tile);
				tiles[index] = tile;
				
				let dy = placeY - tile.y;
				let time = Math.floor(dy / tileSize) * 0.2;
				let delay = 0.26;

				gsap.to( tile, time, { y: placeY, ease: "back.out(1.25)", delay } );
				gsap.to( tile, 0.2, { alpha: 1, delay: 0.26 + empty.indexOf( index ) * 0.05 });

				if ( time > maxFallTime ) maxFallTime = time;
			}
		}

		if ( maxFallTime > 0 ) gsap.delayedCall( maxFallTime+0.01, ()=>{
			if ( onComplete ) onComplete();
		});
	}


	function getRandomSpriteName() {
		let sprites = ["cheese", "tomato", "carrot", "baklagani", "pappier", "water"];
		let randomIndex = Math.floor( sprites.length * Math.random() );
		
		if ( dynamitCount < 3 && moveSteps >= 5 && Math.random() > 0.5 ) {
			dynamitCount += 1;			
			return "dinamit";
		}

		return sprites[ randomIndex ];
	}	


	function findCombinations() {
		let isCombination = false;	
		let findedTiles = [];

		for ( let rowCount=0; rowCount < boardRow; rowCount++ ) {
			let same = [];
			let startIndex = rowCount * boardCol;
			let endIndex = startIndex + boardCol;			

			for ( let index = startIndex; index < endIndex; index++ ) {
				let tile = tiles[ index ];
				
				if ( tile === null || tile.name === 'dinamit' ) {
					if ( same.length >= 3 ) {
						isCombination = true;
						finded( same );
					} 
					same.length = 0;
					continue;
				}
				
				if ( same.length === 0 || same[0].name === tile.name ) {
					same.push(tile);
				} else if ( same.length < 3 ) {
					same.length = 0;
					same.push(tile);
				} else {
					isCombination = true;
					finded( same );
					same.length = 0;
					same.push(tile);
				}				
			}	
			
			if ( same.length >= 3 ) {
				isCombination = true;
				finded( same );
			}
		}

		for ( let colCount=0; colCount < boardCol; colCount++ ) {
			let same = [];
			let startIndex = colCount;
			let endIndex = startIndex + 88;

			for ( let index = startIndex; index < endIndex; index += boardCol ) {
				let tile = tiles[ index ];
				
				if ( tile === null || tile.name === 'dinamit' ) {
					if ( same.length >= 3 ) {
						isCombination = true;
						finded( same );											
					}
					same.length = 0;
					continue;
				}
				
				if ( same.length === 0 || same[0].name === tile.name ) {
					same.push(tile);
				} else if ( same.length < 3 ) {
					same.length = 0;
					same.push(tile);
				} else {					
					isCombination = true;
					finded( same );
					same.length = 0;
					same.push(tile);
				}				
			}

			if ( same.length >= 3 ) {
				isCombination = true;
				finded( same );											
			}
		}
		
		function finded( same ) {
			for ( let tile of same ) {
				let index = findedTiles.indexOf( tile );
				if ( index === - 1 ) findedTiles.push( tile );
			}			
		}

		blowTiles( findedTiles );

		if ( isCombination ) {
			fallTiles();
			fillEmptyTiles( findCombinations );
		} else {
			isSwapped = false;
			// moveSteps++;
		}

		return isCombination;
	}

	function blowTiles( same ) {
		for ( let tile of same ) {
			let index = tiles.indexOf( tile );
			if ( index !== -1 ) tiles[index] = null;
			
			playSound('Match1');

			gsap.to( tile, 0.25, {alpha: 0});
			gsap.to( tile.scale, 0.25, {x: 2.5, y: 2.0, ease: 'sine.in', onComplete: ()=>{
				tile.visible = false;					
				app.emitter.add( tile.x, tile.y, getColorByName(tile.name), 3 );
			}});
		}
	}

	board.on ("pointerdown", pointerDownHander);
	board.on ("pointerup", pointerUpHander);
	board.on ("pointermove", pointerMoveHander);

	function pointerDownHander(event) {
		if ( isSwapped ) return;

		let index = tiles.indexOf( event.target );		
		
		if ( index != -1 ) {
			isDown = true;
			
			mouse.x = event.client.x;
			mouse.y = event.client.y;

			currentTileIndex = index;
		}
	};

	function pointerUpHander(event) {
		isDown = false;
	};

	function pointerMoveHander(event) {
		if (isDown) {			
			let dx = event.client.x - mouse.x;
			let dy = event.client.y - mouse.y;
			let distance = Math.sqrt(dx*dx + dy*dy);			

			if (distance > 8) {
				isDown = false;
				swapTile(currentTileIndex, dx, dy);
			}
		};
	};

	return board;
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

function createTutor () {
	let tutor = new PIXI.Container();
	tutor.visible = false;
	tutor.x = -5;
	tutor.y = -57;
	
	let blackTutor = new PIXI.Sprite(assets.textures.pixi.blackTutor);
	tutor.addChild(blackTutor);
	blackTutor.anchor.set(0.5, 0.5);	
	blackTutor.hitArea = new PIXI.Rectangle(0, 0, 0, 0);
	
	let hand = new PIXI.Sprite(assets.textures.pixi.hand);
	tutor.addChild(hand);
	hand.anchor.set(0.5, 0.5);
	hand.y = 180;
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


function createFinish() {
	let finish = new PIXI.Container();	
	finish.visible = false;

	let black = new PIXI.Sprite(assets.textures.pixi.black);
	finish.addChild(black);
	black.anchor.set(0.5, 0.5);
	black.scale.set(1.5);
	black.interactive = true;

	let downloadBtn = new PIXI.Sprite(assets.textures.pixi.playMore);
	finish.addChild(downloadBtn);
	downloadBtn.anchor.set(0.5, 0.5);	
	downloadBtn.interactive = true;
	downloadBtn.on( 'pointertap', clickAd );

	let packshotDad = new PIXI.Container();
	finish.addChild(packshotDad);
	
	let packshot = new PIXI.Sprite(assets.textures.pixi.packshot);
	packshotDad.addChild(packshot);
	packshot.anchor.set(0.5, 0.5);
	
	let left_hat = new PIXI.Sprite(assets.textures.pixi.left_hat);
	packshot.addChild(left_hat);
	left_hat.anchor.set(0.5, 0.5);
	left_hat.x = -190;
	left_hat.scale.set(0.67);
	left_hat.y = 50;

	let centerHat = new PIXI.Sprite(assets.textures.pixi.centerHat);
	packshot.addChild(centerHat);
	centerHat.anchor.set(0.5, 0.5);
	centerHat.scale.set(0.7)

	let right_hat = new PIXI.Sprite(assets.textures.pixi.right_hat);
	packshot.addChild(right_hat);
	right_hat.anchor.set(0.5, 0.5);
	right_hat.scale.set(0.67);
	right_hat.x = 190;
	right_hat.y = 50;

	let goodJob = new PIXI.Sprite(assets.textures.pixi.goodJob);
	packshot.addChild(goodJob);
	goodJob.anchor.set(0.5, 0.5);

	let tl1 = gsap.timeline({ paused: true, delay: 0.25 });//repeat: 1,
	tl1.from(packshot.scale, 0.5, {x: 0, y:0, ease: "back.out"});
	tl1.from(left_hat.scale, 0.2,  {x: 0, y:0, ease: "back.out"});
	tl1.from(centerHat.scale, 0.2,  {x:0,y:0, ease: "back.out"});
	tl1.from(right_hat.scale, 0.2,  {x: 0, y:0, ease: "back.out"});

	finish.portrait = function (upUI,downUI){
		packshotDad.scale.set(1);
		packshotDad.x = 0;
		packshotDad.y = -80;
		goodJob.y = 250;
		packshot.y = -10;
		finish.y = -80;
		downloadBtn.x = 0;
		downloadBtn.y = downUI - 160;		
	};

	finish.landscape = function (rightUI, downUI){
		packshotDad.scale.set(0.7);
		packshotDad.x = -250;
		packshotDad.y = 0;
		goodJob.y = 245;
		packshot.y = -10;
		finish.y = 0;
		downloadBtn.x = 310 ;
		downloadBtn.y = 0;		
	};	

	finish.show = function () {
		stopSound('bg');
		playSound('packshot');

		finish.visible = true;

		gsap.from( black, 0.5, {alpha: 0});
		
		tl1.play();

		gsap.from( downloadBtn.scale, 0.5, { x: 0.0, y: 0.0, ease: 'back.out', delay: 0.25 });	
		gsap.to( downloadBtn.scale, 0.75, { x: 0.9, y: 0.9,repeat: -1, yoyo: true, delay: 0.75  });	

		gsap.from( goodJob.scale, 1.0, { x: 0.0, y: 0.0, ease: 'elastic.out', delay: 0.5 });	
	}

	return finish;
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
		app.obj2d.gameScene.board.addChild( this.display );
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
}


function createAnimSprite(texture, framesData, animName) {	
	let sheetData = createSpriteSheet(animName, framesData[animName]);

	let spriteSheet = new PIXI.Spritesheet(texture, sheetData);
	spriteSheet.parse(()=>{});	
	
	let animSprite = new PIXI.AnimatedSprite(spriteSheet.animations[animName]);	
	animSprite.animationSpeed = 0.35;
	animSprite.loop = false;	
	
	return animSprite;
}	

function createSpriteSheet(animName, frames) {
	let sheetData = {
		frames,
		animations: {
			[animName] : []
		}, 
		meta: {
			scale: 1
		}
	}

	for (let frameName in frames) {
		sheetData.animations[animName].push(frameName);
	}

	return sheetData;
}