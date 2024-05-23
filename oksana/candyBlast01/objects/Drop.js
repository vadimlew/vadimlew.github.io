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
		app.obj2d.gameScene.board.display.addChild( this.display );
    }

    reset( x, y, tint ) {
		this.display.visible = true;
		this.display.position.set(x, y);
		this.display.angle = 0;
		this.velocity.x = -15 + 30 * Math.random();
		this.velocity.y = -4 + 2 * Math.random();
		this.display.scale.x = 0.4 + 0.35 * Math.random();
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
		this.display.scale.x -= 0.025;
		this.display.scale.y -= 0.025;

        if ( this.display.scale.x <= 0 ) {
            this.display.visible = false;
            this.emitter.onParticleComplete( this );
        }
    }
}