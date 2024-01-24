class Stink {
    model = new THREE.Group();
    emitter;
    position = new THREE.Vector3();

    constructor() {
        this.emitter = new ParticleEmitter( StinkParticle, this.model );        
    }

    show() {
        this.model.visible = true;
        app.update.add( this.update );
    }

    hide() {
        this.model.visible = false;
        app.update.delete( this.update );
    }

    update = () => {
        this.emitter.add( this.position, 1 );
    }
}


class StinkParticle extends Particle {        

    constructor( emitter ) {
        super();
        this.emitter = emitter;
        this.initModel();
        this.reset();        
    }

    initModel() {
        this.material = new THREE.SpriteMaterial({ 
            map: assets.textures.three.stinky,
            transparent: true,            
            depthWrite: false,
         });       
        this.model = new THREE.Sprite( this.material );
        assets.textures.three.stinky.flipY = true;
    }

    reset() {
        this.model.position.x += -0.3 + 0.6 * Math.random();
        this.model.position.y += 0.2 + 0.2 * Math.random();
        this.model.position.z += -0.3 + 0.6 * Math.random();

        // this.model.scale.setScalar( 0.4 + 0.4 * Math.random() );
        this.model.scale.setScalar(0);

        this.model.visible = true;        
        this.velocity.set(
            -0.015 + 0.03 * Math.random(),
			0.01 + 0.01 * Math.random(),
			-0.015 + 0.03 * Math.random()
        )
        this.model.material.opacity = 0.3 + 0.3 * Math.random();
    }

    update() {
        this.model.position.add( this.velocity );      

        this.velocity.x *= 0.98;
        this.velocity.y *= 0.98;
        this.velocity.z *= 0.98;

        this.model.scale.addScalar( 0.017 );
        
        this.model.material.rotation += this.velocity.y;

        if ( this.model.scale.x > 1.0 ) {
            this.model.material.opacity *= 0.9;
        }        

        if ( this.model.material.opacity <= 0.005 ) {
            this.model.visible = false;
            this.emitter.onParticleComplete( this );
        }
    }
}