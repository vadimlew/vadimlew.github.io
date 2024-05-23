class BoardView {
    model;
    display;
    currentTileIndex;
    startX;
    startY;
    boardBg;

    tiles = [];
    mouse = {x:0, y:0};
    swapTime = 0.4;
    fallTime = 0.15;
	tileSize = 64;	
    isDown = false;
    counter = 0;

    constructor(model) {
        this.model = model;
        this.initDisplay();
        this.initEvents();
    }

    initDisplay() {
        this.display = new PIXI.Container();     
        this.display.interactiveChildren = false;

        this.boardBg = new PIXI.Sprite(assets.textures.pixi.boardBg);
        this.boardBg.anchor.set(0.5, 0.5);
        this.display.addChild(this.boardBg);       

        this.startX = -(this.model.width-1) * 0.5 * this.tileSize;
	    this.startY = -(this.model.height-1) * 0.5 * this.tileSize;

        for (let index = 0; index < this.model.tiles.length; index++) {
            this.createNewTile(index, 0.35 + index * 0.01);
        };

        gsap.delayedCall( 1.2, ()=>this.display.interactiveChildren = true );
    }

    createNewTile(index, delay=0) {
        let {tileX, tileY} = this.model.getTilePosition(index);
        
        let tile;
        let spriteName = this.model.tiles[index];

        switch(spriteName) {
            case 'bomb': 
                tile = this.createBomb(); 
                break;

            case 'rocket1': 
                tile = this.createRocket(1);
                break;

            case 'rocket2': 
                tile = this.createRocket(2);
                break;

            default: 
                tile = new PIXI.Sprite(assets.textures.pixi[spriteName]);
                tile.anchor.set(0.5, 0.5);
                break;
        }        

        tile.interactive = true; 
        tile.name = spriteName;

        tile.x = this.startX + tileX * this.tileSize;
        tile.y = this.startY + tileY * this.tileSize;

        gsap.from(tile.scale, 0.25, { x: 0, y: 0, ease: "back.out", delay });
        this.boardBg.addChild(tile);

        this.tiles[index] = tile;
    }

    createBomb() {
        let bomb = new PIXI.Container();
        
        let sprite = new PIXI.Sprite(assets.textures.pixi['bomb']);
        sprite.anchor.set(0.5, 0.5);       
    
        let fire = new PIXI.Sprite( assets.textures.pixi['fire'] );
        fire.anchor.set(0.5);
        fire.scale.set(0.2);
        fire.position.set(10, -25);
    
        gsap.to(sprite, 0.2 + 0.05 * Math.random(), {angle: -5, ease: 'sine.inOut', yoyo: true, repeat: -1});
        gsap.to(fire.scale, 0.1, {x: 0.25, y: 0.25, ease: 'quad.inOut', yoyo: true, repeat: -1});	
    
        sprite.addChild(fire);
        bomb.addChild(sprite);       

        bomb.blow = () => {
            playSound('bomb');

            this.shake();

            let explosion = new Explosion(bomb.x, bomb.y);
            this.boardBg.addChild(explosion.sprite);

            gsap.killTweensOf(sprite);
            gsap.killTweensOf(fire.scale);            
        }
    
        return bomb;
    }

    createRocket(orientation=1) {
        let rocket = new PIXI.Container();
	
        let sprite = new PIXI.Sprite(assets.textures.pixi['rocket']);
        sprite.anchor.set(0.5, 0.5);
        sprite.scale.set(0.55);

        sprite.angle = orientation === 1 ? 0 : 90;
      
        gsap.to(sprite, 0.2 + 0.05 * Math.random(), {angle: '+=5', ease: 'sine.inOut', yoyo: true, repeat: -1});	
       
        rocket.addChild(sprite);

        rocket.blow = () => {       
            playSound('rocket');

            if (orientation === 1) {
                this.boardBg.addChild( new FlyingRocket(rocket.x, rocket.y, 1, 0).sprite );
                this.boardBg.addChild( new FlyingRocket(rocket.x, rocket.y, -1, 0).sprite );
            } else {
                this.boardBg.addChild( new FlyingRocket(rocket.x, rocket.y, 0, 1).sprite );
                this.boardBg.addChild( new FlyingRocket(rocket.x, rocket.y, 0, -1).sprite );
            }            

            gsap.killTweensOf(sprite);                  
        }

        return rocket;
    }

    initEvents() {
        this.display.on ("pointerdown", this.pointerDownHander.bind(this));
        this.display.on ("pointerup", this.pointerUpHander.bind(this));
        this.display.on ("pointermove", this.pointerMoveHander.bind(this));
    }

    pointerDownHander(event) {
        let index = this.tiles.indexOf(event.target);        
		
		if (index != -1) {
			this.isDown = true;
			
			this.mouse.x = event.client.x;
			this.mouse.y = event.client.y;

			this.currentTileIndex = index;
		}
    }

    pointerUpHander() {
        this.isDown = false;
    }

    pointerMoveHander(event) {
        if (this.isDown) {
			let dx = event.client.x - this.mouse.x;
			let dy = event.client.y - this.mouse.y;
			let distance = Math.sqrt(dx*dx + dy*dy);

			if (distance > 8) {
				this.isDown = false;
				this.swapTile(this.currentTileIndex, dx, dy);
			}
		}
    }

    swapTile(indexA, dx, dy) {
        let direction;
		
		if (Math.abs(dx) > Math.abs(dy)) {
			direction = dx > 0 ? "right" : "left";
		} else {
			direction = dy < 0 ? "up" : "down";
		};	

        let indexB = this.model.getSwappedIndex(indexA, direction);
        if (indexB === -1) return;

        let tileA = this.tiles[indexA];
        let tileB = this.tiles[indexB];

        playSound('move');
        gsap.to(tileA, this.swapTime, { x: tileB.x, y: tileB.y, ease: 'back.inOut' });
		gsap.to(tileB, this.swapTime, { x: tileA.x, y: tileA.y, ease: 'back.inOut' });

        let animData = this.model.swapTiles(indexA, indexB);

        if (animData.status) {
            this.display.interactiveChildren = false;
            [this.tiles[indexA], this.tiles[indexB]] = [this.tiles[indexB], this.tiles[indexA]];
            gsap.delayedCall(this.swapTime, ()=>this.startAnimation(animData));
        } else {
            gsap.to(tileA, this.swapTime, { x: tileA.x, y: tileA.y, ease: 'back.inOut', delay: this.swapTime });
		    gsap.to(tileB, this.swapTime, { x: tileB.x, y: tileB.y, ease: 'back.inOut', delay: this.swapTime });
            gsap.delayedCall(this.swapTime, ()=> playSound('move'));
        }
    }

    async startAnimation(animData) {
        this.counter += animData.removed.length;        
        
        await this.blowTiles(animData.removed);
        await this.fallTiles(animData.falled);
        await this.createNewTiles(animData.created);

        if (this.counter >= 200) {
            app.obj2d.finish.show();
            return;
        } 

        animData = this.model.getIterationResult();

        if (animData.status) {
            this.startAnimation(animData);
        } else {
            this.display.interactiveChildren = true;            
        }      
    }    

    blowTiles(blowed) {
		for (let index of blowed) {
            playSound('bubble', false, 0.5);

            let tile = this.tiles[index];
			this.tiles[index] = null;

            if (tile.name === 'bomb' || tile.name === 'rocket1' || tile.name === 'rocket2') {
                tile.blow();
            }

			gsap.to(tile, 0.35, {alpha: 0, delay: 0.1, onStart: () => app.emitter.add( tile.x, tile.y, this.getColorByName(tile.name), 5 )});
			gsap.to(tile.scale, 0.35, {x: 1.5, y: 1.5, ease: 'sine.in', onComplete: ()=>{
				tile.destroy();
			}});            
		}

        return new Promise( (resolve) => {
            gsap.delayedCall(0.35, resolve);
        })
	}

    fallTiles(falled) {
        let maxFallTime = 0.05;

        for (let index=0; index < falled.from.length; index++) {
            let fromIndex = falled.from[index];
            let toIndex = falled.to[index];

            let tile = this.tiles[fromIndex];
            
            this.tiles[fromIndex] = null;
            this.tiles[toIndex] = tile;

            let {tileY} = this.model.getTilePosition(toIndex);
            let positionY = this.startY + tileY * this.tileSize;

            let fallTime = this.fallTime * (positionY - tile.y) / this.tileSize;
            if (fallTime > maxFallTime) maxFallTime = fallTime - this.fallTime;

            gsap.to(tile, fallTime, {y: positionY, ease: 'back.out(1.1)' });
        }

        return new Promise( (resolve) => {            
            gsap.delayedCall(maxFallTime, resolve);
        })
    }

    createNewTiles(created) {
        for (let index of created) {
            this.createNewTile(index);
		}

        return new Promise( (resolve) => {
            gsap.delayedCall(0.1, resolve);
        })
    }

    getColorByName( name ) {
        switch( name ) {
            case 'yellow': return 0xfef556; break;
            case 'red': return 0xe53e2f; break;
            case 'green': return 0x48ba1c; break;
            case 'blue': return 0x0676f7; break;
        }	
    }

    shake() {
        this.boardBg.x = -Math.random() * 10;
        this.boardBg.y = -Math.random() * 10;

        gsap.to(this.boardBg, 0.05, {x: Math.random() * 10, repeat: 2, yoyo: true, ease: 'sine.inOut'});
        gsap.to(this.boardBg, 0.045, {y: Math.random() * 10, repeat: 2, yoyo: true, ease: 'sine.inOut'});
        gsap.to(this.boardBg, 0.05, {x: 0, y: 0, ease: 'sine.out', delay: 0.05 * 3});
    }
}