function createGameScene() {
	let gameScene = new PIXI.Container();

	gameScene.visible = false; 

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
	
	let playMoreBtnBrown =  createPlayMoreBtnBrown();
	gameScene.addChild( playMoreBtnBrown );

	gameScene.portrait = function( upUI, rightUI, leftUI, downUI ) {				
		logo.x = 0;
		logo.y = upUI + 160;

		board.x = 0;
		board.y = 30;
		board.scale.set(1);

		board.restaurant.x = 0;
		board.restaurant.y = -60;

		bg.width = app.canvasHeight / app.obj2d.main.scale.y;
		bg.height = app.canvasHeight / app.obj2d.main.scale.y;	

		playMoreBtnBrown.x = 0;
		playMoreBtnBrown.y = downUI - 120;
	};

	gameScene.landscape = function (upUI, rightUI, leftUI, downUI) {		
		logo.x = -300;
		logo.y = -100;
		logo.scale.set(1.2);

		board.x = 250;
		board.y = 0;
		board.scale.set(0.8);

		board.restaurant.x = -150;
		board.restaurant.y = 10;
		
		bg.width = app.canvasWidth / app.obj2d.main.scale.x;
		bg.height = app.canvasWidth / app.obj2d.main.scale.x;		

		playMoreBtnBrown.x = -300;
		playMoreBtnBrown.y = 150;
	};

	gameScene.show = function () { 
		gameScene.visible = true;
		
		gsap.to( logo, 0.15, { angle: 10, repeat: 3, yoyo: true, ease: 'sine.inOut', delay: 0.25 });
		gsap.from( logo.scale, 1.0, { x: 0, y: 0, ease: 'elastic.out', delay: 0.25 });
		// gsap.from( board.scale, 0.5, { x: 0, y: 0, ease: 'sine.out', delay: 0.25 });

		gsap.from( playMoreBtnBrown, 0.5, { alpha: 0, delay: 1.0 });
		gsap.to( playMoreBtnBrown.scale, 0.6, { x: 0.95, y: 0.95, delay: 1.0, ease: 'sine.inOut', repeat: -1, yoyo: true });

		gsap.from( gameScene, 0.5, { alpha: 0 });
		gsap.delayedCall( 1.5, app.obj2d.tutor.show );

		board.start();
	};

	gameScene.hide = function () { 		
		gsap.to( gameScene, 0.5, { alpha: 0, visible: false });
	};
	
	return gameScene;
};


function createBoard() {
	let tiles = [];
	let isDown = false;
	let isSwapped = false;
	let isDiscoball = false;
	let mouse = {x:0, y:0};
	let currentTileIndex;
	let swapTime = 0.4;
	let tileSize = 64;
	let boardCol = 8;
	let boardRow = 11;
	let startX = -(boardCol-1) * 0.5 * tileSize;
	let startY = -(boardRow-1) * 0.5 * tileSize;

	let board = new PIXI.Container();
	board.interactive = true;
	board.name = "board";

	let dropEmitter = new ParticleEmitter( Drop );

	let boardBg = new PIXI.Sprite(assets.textures.pixi.boardBg);
	boardBg.anchor.set(0.5, 0.5);	

	let restaurant = new PIXI.Sprite( assets.textures.pixi.upRest );
	restaurant.anchor.set(0.5);
	restaurant.scale.set(0.85);	
	restaurant.alpha = 0.0;
	board.restaurant = restaurant;

	let goodJob = new PIXI.Sprite(assets.textures.pixi.goodJob);
	goodJob.anchor.set(0.5, 0.5);

	let blowed = [];

	let dropShadowFilter = new PIXI.filters.DropShadowFilter({		
        alpha: 0.6, 
        blur: 8 
	});
	goodJob.filters = [dropShadowFilter];

	restaurant.addChild(goodJob);

	board.addChild(restaurant, boardBg, dropEmitter.display);
	
	gsap.to (boardBg.scale, 0.35, {x:1, y:1, ease: "sine.out"});

	// 8 to 11 
	let data = [
		"dynamit", "cheese", "tomato", "carrot", "baklagani", "baklagani","pappier","dynamit",
       "tomato", "tomato", "water", "tomato", "baklagani","cheese", "pappier","baklagani",
       "pappier","cheese", "pappier", "baklagani", "tomato","tomato", "water", "carrot",
       "water", "cheese","water","tomato","baklagani", "cheese","pappier","pappier",
       "baklagani","water", "water", "baklagani", "water", "water","tomato", "baklagani",
       "rocket", "baklagani", "tomato","cheese","pappier", "pappier", "carrot", "rocket",
       "carrot", "tomato", "pappier", "water", "pappier", "pappier", "water", "water",
       "tomato", "tomato", "pappier", "water", "water","carrot", "water", "cheese",
       "water","cheese", "water","tomato","baklagani", "carrot", "pappier", "pappier",
       "baklagani","baklagani","water", "tomato", "tomato","water","tomato", "baklagani",
       "dynamit","cheese","tomato","cheese","cheese","carrot","carrot", "dynamit",
	];


	board.start = function() {
		for ( let i = 0; i < data.length; i++ ) {
			let column = i%boardCol ;
			let row = Math.floor(i/boardCol);		
			let spriteName = data[i];
			
			let tile = new PIXI.Sprite( assets.textures.pixi[spriteName] );
			tile.interactive = true;
			tile.anchor.set(0.5);
			tile.name = spriteName;
	
			if ( tile.name == "dynamit" ) {
				tile = createDynamit(tile);
				tile.interactive = true;
				tile.name = spriteName;
			} 
	
			if ( tile.name == "rocket" ) {
				tile = createRocket(tile);
				tile.interactive = true;
				tile.name = spriteName;
			} 

			if ( tile.name == "discoBall" ) {
				tile = createDiscoball(tile);
				tile.interactive = true;
				tile.name = spriteName;
			} 
	
			tile.x = startX + column * tileSize;
			tile.y = startY + row * tileSize;
			tile.scale.set(0);
			gsap.to( tile.scale, 0.2, {x:1, y:1, ease: "sine.out", delay: 0.35+i*0.01} );
			boardBg.addChild(tile);
			tiles.push(tile);
		};
	}

	board.showEnd = function() {
		board.off("pointerdown", pointerDownHander);
		board.off("pointerup", pointerUpHander);
		board.off("pointermove", pointerMoveHander);
		
		gsap.to( boardBg, 0.5, { alpha: 0 } );
		gsap.to( restaurant, 0.5, { alpha: 1 } );

		let fireWork1 = createFireWorks(0.25 + 0.5 * Math.random() );
		fireWork1.position.set(-300, -300);
		playSound('fireworks');

		let fireWork2 = createFireWorks(0.25 + 0.5 * Math.random());
		fireWork2.position.set(300, -300);		

		let fireWork3 = createFireWorks(0.25 + 0.5 * Math.random());
		fireWork3.position.set(100, -400);		

		let fireWork4 = createFireWorks(0.25 + 0.5 * Math.random());
		fireWork4.position.set(-100, -350);		

		board.addChildAt( fireWork1, 0);
		board.addChildAt( fireWork2, 0);
		board.addChildAt( fireWork3, 0);
		board.addChildAt( fireWork4, 0);

		gsap.from(goodJob.scale, 1.5, {x: 0, y: 0, ease: 'sine.out'});
		gsap.to(goodJob, 0.75, {alpha: 0, delay: 2.0});

		gsap.delayedCall( 3.5, ()=>{
			app.obj2d.gameScene.hide();
			app.obj2d.endScreen.show();
		});
	}

	// gsap.delayedCall(4, board.showEnd);
	
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
			playSound('move');
			
			let index1 = tiles.indexOf( tile1 );
			let index2 = tiles.indexOf( tile2 );

			tiles[index1] = tile2;
			tiles[index2] = tile1;			

			gsap.to( tile1, swapTime, { x: tile2.x, y: tile2.y, ease: 'back.inOut' });
			gsap.to( tile2, swapTime, { x: tile1.x, y: tile1.y, ease: 'back.inOut', onComplete: ()=>{
				if ( checkBoosters( tile1 ) ) {
					blowTiles();
					fallTiles( findCombinations );
					return;
				}

				if ( checkBoosters( tile2 ) ) {
					blowTiles();
					fallTiles( findCombinations );
					return;
				}
				
				let isCombination = findCombinations();

				if ( !isCombination ) {		
					playSound('move');

					gsap.to( tile1, swapTime, { x: tile2.x, y: tile2.y, ease: 'back.inOut' });
					gsap.to( tile2, swapTime, { x: tile1.x, y: tile1.y, ease: 'back.inOut', onComplete: ()=>{
						isSwapped = false;
					}});

					let index1 = tiles.indexOf( tile1 );
					let index2 = tiles.indexOf( tile2 );

					tiles[index1] = tile2;
					tiles[index2] = tile1;
				}
			}});
		}
	};

	function fallTiles(onComplete) {
		let maxFallTime = 0;
		let delay = 0.5;

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
				let time = Math.floor(dy / tileSize) * 0.15;				
				gsap.to( tile, time, { y: newY, ease: 'back.out(1.1)', delay });	
				
				if ( time > maxFallTime ) maxFallTime = time + delay;
			}
		}	
		
		gsap.delayedCall( maxFallTime, ()=>{
			if ( onComplete ) onComplete();
		});
	}


	function findCombinations() {
		let isCombination = false;

		for ( let rowCount=0; rowCount < boardRow; rowCount++ ) {
			let same = [];
			let startIndex = rowCount * boardCol;
			let endIndex = startIndex + boardCol;			

			for ( let index = startIndex; index < endIndex; index++ ) {
				let tile = tiles[ index ];
				
				if ( tile === null ) {
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
				
				if ( tile === null ) {
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
				let index = blowed.indexOf( tile );
				if ( index === - 1 ) blowed.push( tile );
			}			
		}

		blowTiles();

		if (isCombination) {
			fallTiles( findCombinations );
		} else {
			isSwapped = false;			
		}

		return isCombination;
	}

    function blowTiles() {
		playSound('match', false, 0.3);
		
        for (let tile of blowed) {
            let index = tiles.indexOf(tile);
            if (index !== -1) tiles[index] = null;

			if (!tile || tile.isBlowed) continue;

			tile.interactive = false;
			tile.isBlowed = true;           

            gsap.to(tile, 0.25, { alpha: 0 });
            gsap.to(tile.scale, 0.2 + 0.05 * Math.random(), {
                x: 2.5, 
				y: 2.0, 
				ease: 'sine.in', 
				onComplete: () => {
					// playSound('match', false, 0.3);
					let particleColor = getColorByName(tile.name);					
					if (particleColor) dropEmitter.add(tile.x, tile.y, particleColor, 3);
					tile.destroy();
                }
            });
        }	

		blowed.length = 0;

		let count = 0;
		for ( let tile of tiles ) {
			if ( tile && !tile.isBlowed ) count++;
		}		

		if ( !isDiscoball && count <= 30 ) {			
			isDiscoball = true;
			
			let index = 3;
			let column = index%boardCol ;
			let row = Math.floor(index/boardCol);			
			
			let discoBall = new PIXI.Sprite( assets.textures.pixi['discoBall'] );			
			discoBall.anchor.set(0.5);
			discoBall = createDiscoball(discoBall);
			discoBall.interactive = true;
			discoBall.name = 'discoBall';
	
			discoBall.x = startX + column * tileSize;
			discoBall.y = startY + row * tileSize;
			discoBall.scale.set(0);

			gsap.to( discoBall.scale, 0.2, {x:1, y:1, ease: "sine.out"} );
			boardBg.addChild(discoBall);

			tiles[index] = discoBall;

			fallTiles();
		}
		
		if ( count <= 0 && app.stateGame === 'game' ) {	
			app.stateGame = 'final';

			gsap.delayedCall( 1, () => {
				board.showEnd();
			})			
		}
    };

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

		if ( !isSwapped && currentTileIndex ) {
			checkBoosters( tiles[currentTileIndex] );
			blowTiles();
			fallTiles( findCombinations );
		}

		currentTileIndex = null;
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

    function dynamitBoom(tile) {		
		isSwapped = true;

        let index = tiles.indexOf(tile);

        let tileX = index % boardCol;
		let tileY = Math.floor( index / boardCol);

		let radius = 3;

		for ( let index = 0; index < tiles.length; index++ ) {
			let tileX2 = index % boardCol;
			let tileY2 = Math.floor( index / boardCol);

			let dx = tileX2 - tileX;
			let dy = tileY2 - tileY;
			let distance = Math.sqrt( dx*dx + dy*dy );

			let tile = tiles[ index ];

			if ( distance <= radius && tile && blowed.indexOf(tile) == -1 && !tile.isBlowed ) {
				blowed.push( tile );
				checkBoosters( tile )
			}
		}

		let explosion = createExplosion(tile.x, tile.y);
		board.addChild(explosion);	

		playSound("bomb");
		shakeBoard();
    };

    function rocketBoom(tile) {
		isSwapped = true;

        let index = tiles.indexOf(tile);

        let tileX = index % boardCol;
		let tileY = Math.floor( index / boardCol);		

		for ( let index = 0; index < tiles.length; index++ ) {
			let tileX2 = index % boardCol;
			let tileY2 = Math.floor( index / boardCol);

			if ( (tileX2 === tileX || tileY2 === tileY) && tiles[index] && blowed.indexOf(tiles[index]) == -1 ) {
				blowed.push( tiles[index] );
				checkBoosters( tiles[index] );
			}
		}

		let rocket1 = createFlyingRocket(tile.x, tile.y, 1, 0);
		board.addChild(rocket1);

		let rocket2 = createFlyingRocket(tile.x, tile.y, -1, 0);
		board.addChild(rocket2);

		let rocket3 = createFlyingRocket(tile.x, tile.y, 0, 1);
		board.addChild(rocket3);

		let rocket4 = createFlyingRocket(tile.x, tile.y, 0, -1);
		board.addChild(rocket4);		
		
		playSound("rocket");
    };

	function discoBallBoom(tile) {
		isSwapped = true; 
		
		let newAdded = [];

		playSound('rainbowSpin', true);

		for ( let index = 0; index < tiles.length; index++ ) {
			let tile = tiles[index];

			// if ( tile.name === 'dynamit' || tile.name === 'rocket' ) continue;

			if ( tile && blowed.indexOf(tile) == -1 ) {
				newAdded.push( tile );				
			}
		}	

		newAdded.sort( ()=> Math.random() > 0.5? 1 : -1 );

		let flash = new PIXI.Sprite( assets.textures.pixi.flash );
		flash.anchor.set(0.5);
		tile.addChildAt( flash, 0 );
		tile.interactive = false;
		tile.parent.setChildIndex( tile, tile.parent.children.length - 1 );

		let deltaX = 3 + Math.floor( 2 * Math.random() );
		let deltaY = 3 + Math.floor( 2 * Math.random() );

		// gsap.killTweensOf( tile.children[1] );
		gsap.from( flash.scale, 0.2, { x: 0, y: 0, ease: 'sine.inOut' });
		gsap.to( tile.scale, 0.2, { x:'+=0.15', y:'+=0.15', ease: 'sine.inOut' });
		gsap.to( tile, 0.05, { x:'-=' + deltaX, ease: 'sine.inOut' });
		gsap.to( tile, 0.06, { y:'-=' + deltaY, ease: 'sine.inOut' });
		gsap.to( tile, 0.1, { x:'+=' + deltaX, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.05 });
		gsap.to( tile, 0.12, { y:'+=' + deltaY, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.06 });
		
		let outlineFilter = new PIXI.filters.OutlineFilter( 5, 0xffffff );
		let glowFilter = new PIXI.filters.GlowFilter({ color: 0x99ff99, outerStrength: 5 });

		for ( let index=0; index < newAdded.length; index++ ) {
			let blowedTile = newAdded[ index ];
			gsap.to( blowedTile.scale, 0.1, { x: '+=0.05', y: '+=0.05', ease: 'sine.out', delay: index * 0.05, 
				onStart: ()=>{
					playSound('rainbowTentacles');

					blowedTile.filters = [outlineFilter];	
					
					let deltaX = blowedTile.x - tile.x;
					let deltaY = blowedTile.y - tile.y;
					let distance = Math.sqrt( deltaX**2 + deltaY**2 );
					let normalX = deltaX / distance;
					let normalY = deltaY / distance;
					let radius = 30;
					
					let line = new PIXI.Graphics();
					line.x = tile.x + normalX * radius;
					line.y = tile.y + normalY * radius;
					line.filters = [glowFilter];
					line.alpha = 0.8;
					
					gsap.from( line, 0.1, {alpha: 0} );
					gsap.to( line, 0.1, {alpha: 0, delay: 0.2} );

					line.lineStyle( 7, 0xffffff );
					line.lineTo( deltaX - normalX * radius, deltaY - normalY * radius );
					board.addChild(line);
				}
			});
		}

		gsap.delayedCall( 0.2 + newAdded.length * 0.05, ()=>{
			stopSound('rainbowSpin');
			gsap.killTweensOf( tile.children[1] );
			gsap.killTweensOf( tile );
			blowed.push( ...newAdded );
			blowTiles();
			shakeBoard();
			fallTiles( findCombinations );
		});		
    };


	function checkBoosters( tile ) {		
		let isBooster = false;

		switch ( tile.name ) {
			case 'dynamit': 
				dynamitBoom(tile); 
				isBooster = true;
				break;

			case 'rocket': 
				rocketBoom(tile); 
				isBooster = true;
				break;

			case 'discoBall': 
				discoBallBoom(tile);
				isBooster = true;
				break;
		}	
		
		return isBooster;
	}

	function shakeBoard() {
		gsap.to( boardBg, 0.05, { x: -10 + 20 * Math.random(), y: -10 + 20 * Math.random(), repeat: 3, yoyo: true, ease: 'quad.inOut' });
	}	

	return board;
};