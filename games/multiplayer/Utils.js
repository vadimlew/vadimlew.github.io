class Utils {
    static createAnimSprite( sheetImage, framesNum=4, animationSpeed=1/10, width=16, height=16 ) {
        let textures = [];
        let baseTexture = new PIXI.BaseTexture( sheetImage );

        for ( let i=0; i < framesNum; i++ ) {
            let frame = new PIXI.Rectangle( i*width, 0, width, height );
            let texture = new PIXI.Texture( baseTexture, frame );
            textures.push(texture);
        }

        let animSprite = new PIXI.AnimatedSprite( textures );
        animSprite.animationSpeed = animationSpeed;
        animSprite.play();
        
        return animSprite;
    }
}