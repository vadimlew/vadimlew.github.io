class BoardModel {
    tiles = [];
    minMatch = 3;

    width;
    height;
    library;

    static EMPTY = 'empty';
    static falseStatus = {status: false};

    constructor(width, height, library, boosters) {
        this.width = width;
        this.height = height;
        this.library = library;
        this.boosters = boosters;

        this.tiles.length = width * height;
        this.tiles.fill(BoardModel.EMPTY);
    }

    matchTiles() {
        let matched = [];
        let queue = [];

        let addToMatched = (array) => {
            if (array.length >= this.minMatch) {
                for (let tile of array) { 
                    if (matched.indexOf(tile) === -1) matched.push(tile);
                }                
            }
        }

        let addToQueue = (x, y) => {
            let index = this.getIndex(x, y);
            let tile = this.tiles[index];

            if (tile === BoardModel.EMPTY) {
                addToMatched(queue);
                queue.length = 0;
                return;
            }

            if (queue.length === 0) {
                queue.push(index);
            } else if (this.tiles[queue[0]] === tile) { 
                queue.push(index);
            } else {
                addToMatched(queue);
                queue.length = 0;
                queue.push(index);
            }
        }

        for (let y = 0; y < this.height; y++) {
            queue.length = 0;

            for (let x = 0; x < this.width; x++) {
                addToQueue(x, y);
            }

            addToMatched(queue);
        }

        for (let x = 0; x < this.width; x++) {
            queue.length = 0;

            for (let y = 0; y < this.height; y++) {
                addToQueue(x, y);
            }

            addToMatched(queue);
        }

        this.remove(matched);
    }

    remove(removed) {
        for (let index of removed) {
            this.tiles[index] = BoardModel.EMPTY;
        }
        return removed;
    }

    getRemoved() {
        let removed = [];

        for (let index = 0; index < this.tiles.length; index++) {
            let tile = this.tiles[index];

            if (tile === BoardModel.EMPTY) {
                removed.push(index);
            }
        }
        
        return removed;
    }

    getFalled() {
        let falled = {
            from: [],
            to: []
        }       

        for (let x = 0; x < this.width; x++) {
            let emptyCount = 0;            

            for (let y = this.height-1; y >= 0; y--) {
                let index = this.getIndex(x, y);
                let tile = this.tiles[index];                

                if (tile === BoardModel.EMPTY) {                    
                    emptyCount++;
                } else if (emptyCount > 0) {
                    let newIndex = this.getIndex(x, y + emptyCount);
                    this.tiles[index] = BoardModel.EMPTY;
                    this.tiles[newIndex] = tile;

                    falled.from.push(index);
                    falled.to.push(newIndex);
                }
            }
        }

        return falled;
    }

    getCreateNew() {
        let created = [];

        tilesCicle: for (let index = 0; index < this.tiles.length; index++) {
            if (this.tiles[index] === BoardModel.EMPTY) {
                created.push(index);

                for (let booster in this.boosters) {
                    let chance = this.boosters[booster];

                    if (chance > Math.random()) {
                        this.tiles[index] = booster;
                        this.boosters[booster] = -0.1;
                        continue tilesCicle;
                        break;
                    }

                    this.boosters[booster] += 0.0025;
                }

                this.tiles[index] = getRandomItem(this.library);
            }
        }

        return created;
    }

    getSwappedIndex(index, direction) {
        let {tileX, tileY} = this.getTilePosition(index);

        if (direction === 'right' && tileX === this.width-1) return -1;
        if (direction === 'left' && tileX === 0) return -1;
        if (direction === 'up' && tileY === 0) return -1;
        if (direction === 'down' && tileY === this.height-1) return -1;
		
		let swappedIndex;

		switch( direction ) {
			case "right": swappedIndex = index + 1; break;
			case "left": swappedIndex = index - 1; break;
			case "up": swappedIndex = index - this.width; break;
			case "down": swappedIndex = index + this.width; break;
		}

        return swappedIndex;
    }

    swapTiles(indexA, indexB) {
        [this.tiles[indexA], this.tiles[indexB]] = [this.tiles[indexB], this.tiles[indexA]];        

        this.checkBoosters(indexA);
        this.checkBoosters(indexB);

        let result = this.getIterationResult();

        if (!result.status) [this.tiles[indexA], this.tiles[indexB]] = [this.tiles[indexB], this.tiles[indexA]];

        return result;
    }

    getIterationResult() {
        this.matchTiles();

        return {
            removed: this.getRemoved(),
            falled: this.getFalled(),
            created: this.getCreateNew(),
            get status() {
                return this.removed.length > 0;
            }
        };
    }

    getIndex(x, y) {
        return x + y * this.width;
    }   

    getTilePosition(index) {
        return { 
            tileX: index % this.width,
            tileY: Math.floor(index / this.width)
        }        
    }

    useBomb(bombIndex, bombRadius = 3) {        
        let {tileX: bombX, tileY: bombY} = this.getTilePosition(bombIndex);     
        
        this.tiles[bombIndex] = BoardModel.EMPTY;

		for (let index = 0; index < this.tiles.length; index++) {
            if (this.tiles[index] === BoardModel.EMPTY) continue;

			let {tileX, tileY} = this.getTilePosition(index);

			let dx = tileX - bombX;
			let dy = tileY - bombY;			
			let distance = Math.abs(dx) + Math.abs(dy);

			if (distance < bombRadius) {               
                this.checkBoosters(index);
                this.tiles[index] = BoardModel.EMPTY;
			}
		}       
    }

    useRocket(rocketIndex, orientation) {        
        let {tileX, tileY} = this.getTilePosition(rocketIndex);

        this.tiles[rocketIndex] = BoardModel.EMPTY;

		for (let index = 0; index < this.tiles.length; index++) {
            if (this.tiles[index] === BoardModel.EMPTY) continue;

			let {tileX: tileX2, tileY: tileY2} = this.getTilePosition(index);

			if ( (orientation === 1 && tileY2 === tileY) || (orientation === 2 && tileX2 === tileX) ) {
                this.checkBoosters(index);
                this.tiles[index] = BoardModel.EMPTY;
			}
		}       
    }

    checkBoosters(tileIndex) {
        let tile = this.tiles[tileIndex];

        switch (tile) {
            case 'bomb':
                this.useBomb(tileIndex);
                break;

            case 'rocket1':
                this.useRocket(tileIndex, 1);
                break;

            case 'rocket2':
                this.useRocket(tileIndex, 2);
                break;
        }
    }
}