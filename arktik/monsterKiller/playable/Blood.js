class ParticleEmitter {
    particles = new Set();
    pool = [];
    particleClass;

    constructor( particleClass ) {
        this.particleClass = particleClass;
        app.update.add( this.update );
    }

    add( position, num=1 ) {
        for ( let i=0; i < num; i++ ) {
            let particle = this.pool.length > 0 ? this.pool.pop() : new this.particleClass( this );
            particle.reset();
            particle.model.position.copy( position );

            this.particles.add( particle );
        }        
    }

    onParticleComplete( particle, isPooled=true ) {
        this.particles.delete( particle );
        if ( isPooled ) this.pool.push( particle );
    }

    update = () => {
        for ( let particle of this.particles) {
            particle.update();
        }
    }
}


class Blood {
    emitter;
    model;
    velocity = new THREE.Vector3();    

    constructor( emitter ) {
        this.emitter = emitter;
        this.initModel();
        this.reset();
        app.obj3d.main.add( this.model );
    }

    initModel() {
        this.material = new THREE.MeshLambertMaterial({ color: 0x00dd00 });
        this.geometry = new THREE.SphereGeometry( 0.2, 6, 6 ); 
        this.model = new THREE.Mesh( this.geometry, this.material );

        //this.model.castShadow = true;
        //this.model.receiveShadow = true;
    }

    reset() {
        this.model.visible = true;
        this.model.scale.setScalar( 0.6 + 0.4 * Math.random() );
        this.velocity.set(
            -0.1 + 0.2 * Math.random(),
			0.1 + 0.1 * Math.random(),
			-0.1 + 0.2 * Math.random()
        )
    }

    update() {
        this.model.position.add( this.velocity );

        this.model.rotation.x += this.velocity.x * 0.1;
        this.model.rotation.y += this.velocity.y * 0.1;
        this.model.rotation.z += this.velocity.z * 0.1;

        this.velocity.x *= 0.98;
        this.velocity.y -= 0.025;
        this.velocity.z *= 0.98;        

        this.model.scale.multiplyScalar(0.97);

        if ( this.model.scale.x < 0.01 || this.model.position.y <= -0.25 ) {
            this.model.visible = false;
            this.emitter.onParticleComplete( this );
        }
    }
}


class Bone {
    emitter;
    model;
    velocity = new THREE.Vector3();    
    bounce = 1;

    constructor( emitter ) {
        this.emitter = emitter;
        this.initModel();
        this.reset();
        app.obj3d.main.add( this.model );
    }

    initModel() {
        this.model = assets.models['bones'].clone();

        this.model.traverse( bone => {
            // bone.castShadow = true;
            // bone.receiveShadow = true;

            bone.material = app.materials.skeletonWarior;
            bone.visible = false;
        })

        let boneName = 'Bone' + randomInteger(1, 3);

        this.model.getObjectByName( boneName ).visible = true;
        this.model.getObjectByName( boneName ).material = app.materials.skeletonWarior;        
    }

    reset() {
        this.model.visible = true;
        this.model.scale.setScalar( 0.4 + 0.25 * Math.random() );
        this.velocity.set(
            -0.1 + 0.2 * Math.random(),
			0.3 + 0.1 * Math.random(),
			-0.1 + 0.2 * Math.random()
        )
    }

    update() {
        this.model.position.add( this.velocity );

        this.model.rotation.x += this.velocity.z * 5;
        this.model.rotation.y += this.velocity.x * 3;
        this.model.rotation.z += this.velocity.y * 5;

        this.velocity.x *= 0.98;
        this.velocity.y -= 0.025;
        this.velocity.z *= 0.98;       

        if ( this.model.position.y <= 0.05 ) {
            this.model.position.y = 0.05;

            if ( this.bounce > 0) {
                this.bounce--;
                this.velocity.y *= -0.5;
            } else {
                this.model.rotation.x = 0;
                this.model.rotation.y = 2*Math.PI * Math.random();
                this.model.rotation.z = 0;

                //this.model.visible = false;
                this.emitter.onParticleComplete( this, false );
            }            
        }
    }
}