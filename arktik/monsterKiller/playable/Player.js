class Player {
    model;
    body;
    sensor;
    stateMachine;
    muzzleR;
    muzzleL;

    speed = 0;
    maxSpeed = 0.075;
    bullets = [];
    shootReloadTime = 10;
    currentReloadTime = 0;

    constructor() {
        this.#initModel();      
        this.#initPhysBody();
        this.#initStateMachine();       

        app.update.add(this.#update);        
    }

    #initModel() {
        this.model = assets.models.player;
        this.model.rotation.y = Math.PI/2;   
        this.model.scale.setScalar(1.3);     
        this.model.name = 'player';

        this.model.traverse( obj => {
            if (obj.type == 'Bone') return;

            obj.castShadow = true;
            obj.receiveShadow = true;
        });

        let playerBodyMaterial = new THREE.MeshLambertMaterial({
            map: assets.textures.three['playerBody']
        });	

        let playerCoatMaterial = new THREE.MeshLambertMaterial({
            map: assets.textures.three['playerCoat']
        });	

        let gunMaterial = new THREE.MeshLambertMaterial({
            map: assets.textures.three['dualRevolvers']
        });	               

        this.model.getObjectByName('Van_Helsing_Castle_Body').material = playerBodyMaterial;
        this.model.getObjectByName('Van_Helsing_Castle_Boots').material = playerCoatMaterial;
        this.model.getObjectByName('Van_Helsing_Castle_Coat').material = playerCoatMaterial;        

        this.model.getObjectByName('Dual_RevolverR').material = gunMaterial;
        this.model.getObjectByName('Dual_RevolverL').material = gunMaterial;    
        
        this.muzzleR = this.model.getObjectByName('muzzleR');
        this.muzzleL = this.model.getObjectByName('muzzleL');

        addAnimationMixer( this.model );
        this.model.animation.set( 'Run' );
    }

    #initPhysBody() {
        let circleShape = new CircleShape(1);
        this.body = app.physics.addModel( this.model, circleShape );
        this.body.drag = 0.6;
        this.body.character = this;

        let ray = new Ray(8);
        this.ray = app.physics.addModel( this.model, ray );

        this.ray.events.on( VerletBody.EVENT_COLLIDE, (body)=>{
            if ( body.character && body.character instanceof SkeletonWarior ) {
                this.shoot();
            }
        });
    }

    #initStateMachine() {
        let idleState = new IdlePlayerState( this, 'Run' );
        let walkState = new WalkPlayerState( this, 'Run' );
       
        let stateMachine = new StateMachine( idleState, walkState );
        stateMachine.set( IdlePlayerState );

        this.stateMachine = stateMachine;
    }

    #update = () => {
        this.stateMachine.update();
        if ( this.currentReloadTime > 0 ) this.currentReloadTime--;
    }

    shoot() {        
        if ( this.currentReloadTime <= 0 ) {
            this.#shoot( this.muzzleR );
            this.#shoot( this.muzzleL );

            this.currentReloadTime = this.shootReloadTime;
        }
    }

    #shoot( muzzle ) {
        let bullet = new Bullet();

        muzzle.localToWorld( bullet.model.position );        
        bullet.model.rotation.y = this.model.rotation.y;

        bullet.velocity.x = 2 * Math.cos( bullet.model.rotation.y ) //* 0.1;
        bullet.velocity.z = -2 * Math.sin( bullet.model.rotation.y ) //* 0.1;

        app.obj3d.main.add( bullet.model );
        bullet.start();
    }
}


class Bullet {
    time;
    model;
    velocity = new THREE.Vector3();

    constructor() {
        this.model = assets.models.bullet.clone();

        this.model.getObjectByName('Trace').material = app.materials.bulletTrace;
        this.model.getObjectByName('Shine').material = app.materials.bulletShine;        

        let circleShape = new CircleShape(0.2);
        let body = app.physics.addModel( this.model, circleShape, false, true );

        body.events.on( VerletBody.EVENT_COLLIDE, ( body ) => {
            if (body.character && body.character instanceof SkeletonWarior ) {     
                body.character.life -= 25;
                if ( body.character.life <= 0 ) {
                    body.character.stateMachine.set( EnemyDeathState );
                } else {
                    body.character.stateMachine.set( EnemyReactState );
                }
            }                
        }); 

        this.body = body;
    }

    start() {
        this.time = 10;
        this.model.scale.x = 0;
        app.update.add( this.update );
    }

    stop() {
        this.model.visible = false;
        app.physics.removeBody( this.body );
        app.update.delete( this.update );
    }

    update = () => {
        if ( this.model.scale.x < 2 ) this.model.scale.x += 0.5;
        this.model.position.x += this.velocity.x;
        this.model.position.z += this.velocity.z;

        this.time--;
        if ( this.time <= 0 ) {
            this.stop();
        }
    }
}