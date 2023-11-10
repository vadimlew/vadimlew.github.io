class Fire extends Particle {        

    constructor( emitter ) {
        super();
        this.emitter = emitter;
        this.initModel();
        this.reset();
        app.obj3d.main.add( this.model );
    }

    initModel() {
        this.material = new THREE.SpriteMaterial({ 
            map: assets.textures.three.spark2,           
            transparent: true
        });       
        this.model = new THREE.Sprite( this.material );       

        // assets.textures.three.fire.encoding = THREE.sRGBEncoding;
        assets.textures.three.spark2.flipY = true;
    }

    reset() {
        this.model.visible = true;
        this.model.scale.setScalar( 0.8 + 0.2 * Math.random() );
        this.velocity.set(
            -0.075 + 0.15 * Math.random(),
			0.025 + 0.025 * Math.random(),
			-0.075 + 0.15 * Math.random()
        )
        this.model.material.opacity = 0.6 + 0.2 * Math.random();        
        this.model.material.color.setHex( 0xffffff );
    }

    update() {
        this.model.position.add( this.velocity );      

        this.velocity.x *= 0.99;
        this.velocity.z *= 0.99;        

        this.model.scale.multiplyScalar(0.9);
        this.model.material.opacity -= 0.05;       
        
        // this.model.material.color.r += 0.1;
        this.model.material.color.g -= 0.025;
        // this.model.material.color.b += 0.1;

        if ( this.model.material.opacity <= 0 ) {
            this.model.visible = false;
            this.emitter.onParticleComplete( this );
        }
    }
}