class ParticleEmitter {
    particles = new Set();
    pool = [];
    particleClass;
    model;

    constructor( particleClass, model ) {
        this.particleClass = particleClass;
        this.model = model;
        app.update.add( this.update );
    }

    add( position, num=1 ) {
        for ( let i=0; i < num; i++ ) {
            let particle;
            
            if ( this.pool.length > 0 ) {
                particle = this.pool.pop() 
            } else {
                particle = new this.particleClass( this );
                if ( this.model ) this.model.add( particle.model );
            } 
           
            particle.model.position.copy( position );
            particle.reset();            

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


class Particle {
    emitter;
    model;
    velocity = new THREE.Vector3();

    reset(){};
    update(){};
}