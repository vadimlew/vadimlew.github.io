class Coin extends Particle {
    target;
    accelerate = new PIXI.Point();
 
	constructor( emitter ) {
        super();
        this.emitter = emitter;
        this.initDisplay();
        this.reset();
    }

    initDisplay() {
        this.display = new PIXI.Sprite( assets.textures.pixi.drop );
		this.display.anchor.set(0.5);
        this.display.visible = false;
		app.obj2d.gameScene.board.addChild( this.display );
    }

    reset( x, y, target ) {
		this.display.visible = true;
		this.display.position.set(x, y);
		this.display.angle = 0;

		this.velocity.x = 0;
		this.velocity.y = 0;		

		this.target = target;
    }

    update() {
        let dx = this.target.x - this.display.x;
        let dy = this.target.y - this.display.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        this.accelerate.x += 2 * dx / distance;
        this.accelerate.y += 2 * dy / distance;

        this.velocity.x += this.accelerate.x;
        this.velocity.y += this.accelerate.y;

        this.display.x += this.velocity.x;
        this.display.y += this.velocity.y;

		this.velocity.x *= 0.93;
		this.velocity.y *= 0.93;		

        if ( distance <= 4 ) {
            this.display.visible = false;
            this.emitter.onParticleComplete( this );
        }
    }
}