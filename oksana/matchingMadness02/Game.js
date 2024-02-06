function createAnimSprite(texture, framesData, animName) {	
    let spriteSheet;
  
    if ( app.sheets[animName] === undefined ) {
        let sheetData = createSpriteSheet(animName, framesData[animName]);

        spriteSheet = new PIXI.Spritesheet(texture, sheetData);
        spriteSheet.parse(() => { });

        app.sheets[animName] = spriteSheet;
    } else {
        spriteSheet = app.sheets[animName];
    }  

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


function createFireWorks(delay=0) {
    let firework = new PIXI.Container();    
    let nums = 12;
    let PI2 = Math.PI*2;
    let colors = [0xff9900, 0x00aa00, 0xff00ff, 0x00ffaa];

    let particles = [];

    for ( let index1=0; index1 < 4; index1++ ) {
        for ( let index2=0; index2 < nums; index2++ ) {
            let particle = new PIXI.Sprite( assets.textures.pixi.flash2 );
            particle.anchor.set(0.5);
            particle.scale.set(0.05 + 0.1 * Math.random());
            particle.tint = colors[ randomInteger(0, 3) ];
            particle.alpha = 0;
            particle.blendMode = PIXI.BLEND_MODES.HUE;

            let angle = index2 * PI2 / nums + Math.PI / nums * Math.random();
            particle.vx = (0.1 + 2 * index1) * Math.cos(angle);
            particle.vy = (0.1 + 2 * index1) * Math.sin(angle);
            particle.lifeTime = Math.floor( 40 + 30 * Math.random() );

            particles.push(particle);
            firework.addChild( particle );
        }
    }   

    function update() {
        for ( let particle of particles ) {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            particle.lifeTime--;

            if ( particle.lifeTime <= 0 ) {
                particle.scale.x *= 0.8;
                particle.scale.y *= 0.8;
            }
            
            particle.vx *= 0.96;
            particle.vy *= 0.96;
            particle.vy += 0.05;

            particle.angle +=  particle.vx + particle.vy * 8;

            if ( particle.alpha < 0.8 )
                particle.alpha += 0.1;
        }
    }
    
    gsap.delayedCall( delay, ()=>app.update.add(update) );

    return firework;
}