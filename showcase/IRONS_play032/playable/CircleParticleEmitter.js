class BlueSpriteParticle {
    velocity = new THREE.Vector3();
    sprite3d;

    constructor() {
        this.sprite3d = new THREE.Sprite( app.materials.blueCircle );
        this.sprite3d.visible = false;
    }

    update(rules, reset) {
        if (this.sprite3d.visible) {
            this.velocity.y *= 0.99;
            this.sprite3d.position.y += this.velocity.y;

            this.sprite3d.scale.x = this.sprite3d.scale.y = this.sprite3d.scale.z *= 0.98;

            if (rules(this)) this.sprite3d.visible = false;
        } else {

            this.sprite3d.visible = true;
            this.velocity.y = 0.006 + 0.015 * Math.random();

            this.sprite3d.scale.x = this.sprite3d.scale.y = this.sprite3d.scale.z = 0.04 + 0.03 * Math.random();

            reset(this);
        }
    }
}


class YellowSpriteParticle {
    velocity = new THREE.Vector3();
    sprite3d;

    constructor() {
        this.sprite3d = new THREE.Sprite( app.materials.yellowCircle );
        this.sprite3d.visible = false;
    }

    update(rules, reset) {
        if (this.sprite3d.visible) {
            this.velocity.y *= 0.99;
            this.sprite3d.position.y += this.velocity.y;

            this.sprite3d.scale.x = this.sprite3d.scale.y = this.sprite3d.scale.z *= 0.98;

            if (rules(this)) this.sprite3d.visible = false;
        } else {

            this.sprite3d.visible = true;
            this.velocity.y = 0.004 + 0.015 * Math.random();

            this.sprite3d.scale.x = this.sprite3d.scale.y = this.sprite3d.scale.z = 0.08 + 0.08 * Math.random();

            reset(this);
        }
    }
}


class CircleParticleEmitter {
    model = new THREE.Group();
    particles = [];
    
    constructor ( particleClass, radius = 0.2, num=10, maxDist = 0.6 ) {
        this.radius = radius;
        this.maxDist = maxDist;
        
        this.initParticles(particleClass, num);
        app.update.add( this.update );
    }

    initParticles(particleClass, num) {
        for (let index = 0; index < num; index++) {
            let particle = new particleClass();           
            this.model.add( particle.sprite3d );
            this.particles.push( particle );
        }
    }

    update = () => {
        for ( let particle of this.particles ) {
            particle.update( this.particleRules, this.particleReset );
        }		
	}

    particleRules = ( particle ) => {
        return particle.sprite3d.position.y > this.maxDist; 
    }

    particleReset = ( particle ) => {
        let angle = 2*Math.PI * Math.random();
        particle.sprite3d.position.set( this.radius * Math.cos(angle), 0, this.radius * Math.sin(angle) );
    }

    stopEmit() {
        app.update.delete( this.update );
    }
}