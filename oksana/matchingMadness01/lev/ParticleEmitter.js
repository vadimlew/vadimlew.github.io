class ParticleEmitter {
    particles = new Set();
    pool = [];
    particleClass;
    display;

    constructor( particleClass, display ) {
        this.particleClass = particleClass;
        this.display = display;
        app.update.add( this.update );
    }

    add( x, y, tint, num=1 ) {
        for ( let i=0; i < num; i++ ) {
            let particle;
            
            if ( this.pool.length > 0 ) {
                particle = this.pool.pop() 
            } else {
                particle = new this.particleClass( this );
                if ( this.display ) this.display.addChild( particle.display );
            } 
                       
            particle.reset( x, y, tint );

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
    display;
    velocity = new PIXI.Point();

    reset(){};
    update(){};
}