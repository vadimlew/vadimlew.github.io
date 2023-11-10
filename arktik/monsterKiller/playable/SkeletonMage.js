class SkeletonMage {
    model;
    body;
    sensor;
    handPlace;
    firePosition = new THREE.Vector3();
    fire;

    speed = 0;
    maxSpeed = 0.13;
    life = 10000000000;
    bullets = [];

    constructor() {
        this.#initModel();
        this.#initPhysBody();
        this.#initStateMachine();

        this.fire = new ParticleEmitter( Fire );

        this.handPlace.localToWorld( this.firePosition );  
        this.fire.add( this.firePosition, 20 );

        app.update.add(this.#update);        
    }

    #initModel() {
        this.model = assets.models.skeletonMage;
        this.model.scale.setScalar(1.2);

        this.model.traverse( obj => {
            if (obj.type == 'Bone') return;

            obj.castShadow = true;           
        });        

        this.model.getObjectByName('SkeletonMage').material = app.materials.skeletonMage;       
        this.handPlace = this.model.getObjectByName('HandPlace');   

        addAnimationMixer( this.model );
        this.model.animation.set('Attack');
    }

    #initPhysBody() {
        let circleShape = new CircleShape( 1.6 );
        this.body = app.physics.addModel( this.model, circleShape );
        this.body.isStatic = true;
        this.body.character = this;

        let sensorCircleShape = new CircleShape(12);
        this.sensor = app.physics.addModel( this.model, sensorCircleShape, false, true );
    }

    #initStateMachine() {      
        this.stateMachine = new StateMachine(
            new MageIdleState( this, 'Idle' ),            
            new MageAttackState( this, 'Attack', 0.5 )           
         );

        this.stateMachine.set( MageIdleState );
    }

    shoot() {
        let bullet = this.bullets.length > 0? this.bullets.pop() : new FireBullet();

        bullet.onComplete = () => {
            this.bullets.push( bullet );
        }

        bullet.position.set(0, 0, 0);
        this.handPlace.localToWorld( bullet.position );

        bullet.velocity.x = 0.8 * Math.sin( this.model.rotation.y );
        bullet.velocity.z = 0.8 * Math.cos( this.model.rotation.y );
        
        bullet.start();
    }

    #update = () => {
        this.stateMachine.update();

        this.firePosition.setScalar(0);
        this.handPlace.localToWorld( this.firePosition ); 
        this.fire.add( this.firePosition, 2 );
    }
}


class FireBullet {
    time = 0;
    position = new THREE.Vector3();
    velocity = new THREE.Vector3();
    fire = new ParticleEmitter( Fire );
    onComplete = ()=>{};

    constructor() {
        let circleShape = new CircleShape(0.1);
        
        this.body = new VerletBody( this, circleShape );
        this.body.isSensor = true;
        this.body.events.on( VerletBody.EVENT_COLLIDE, this.onCollide );
    }

    onCollide = (body) => {
        if ( !body.isSensor && !(body.character? body.character instanceof SkeletonMage : false) ) this.stop();

        if (body.character && body.character instanceof Player ) {     
            body.character.setDamage( 25 );              
        }
    }

    start() {        
        this.time = 15;       
        app.physics.addBody( this.body );
        app.update.add( this.update );
    }

    stop() {        
        app.physics.removeBody( this.body );
        app.update.delete( this.update );
        this.onComplete();
    }

    update = () => {
        this.position.x += this.velocity.x;
        this.position.z += this.velocity.z;

        this.fire.add( this.position, 5 );
        
        this.time--;
        if ( this.time <= 0 ) {
            this.stop();
        }
    }
}