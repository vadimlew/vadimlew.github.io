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