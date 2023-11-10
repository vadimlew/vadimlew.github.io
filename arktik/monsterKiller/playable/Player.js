class Player {
    model;
    body;
    sensor;
    stateMachine;
    muzzleR;
    muzzleL;
    lifeBar;

    speed = 0;
    maxSpeed = 0.085;
    bullets = [];
    shootReloadTime = 10;
    currentReloadTime = 0;
    toRotate = 0;
    events = new PIXI.utils.EventEmitter();

    maxLife = 100;
    life = this.maxLife;

    bullets = [];

    constructor() {
        this.#initModel();      
        this.#initPhysBody();
        this.#initStateMachine();       

        app.update.add(this.#update);        
    }

    #initModel() {
        this.model = assets.models.player;
        this.toRotate = Math.PI/2;
        this.model.rotation.y = this.toRotate;
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

        this.model.animation.action['Death'].setLoop( THREE.LoopOnce );
        this.model.animation.action['Shoot'].setLoop( THREE.LoopOnce );

        this.lifeBarPlacer = new THREE.Object3D();
        this.lifeBarPlacer.position.y = 3.5;
        this.model.add( this.lifeBarPlacer );
        this.lifeBar = new LifeBar( this );
    }

    #initPhysBody() {
        let circleBodyShape = new CircleShape(1);
        this.body = app.physics.addModel( this.model, circleBodyShape );
        this.body.drag = 0.6;
        this.body.character = this;

        let ray = new Ray( 8, 0, 0.7 );
        this.sensor = app.physics.addModel( this.model, ray, false, true );
        this.sensor.events.on( VerletBody.EVENT_COLLIDE, this.onSensorCollide );
    }

    onSensorCollide = (body) => {
        if ( body.character && (body.character instanceof SkeletonWarior || body.character instanceof SkeletonMage) ) {           
            let dx = body.model.position.x - this.model.position.x;
            let dz = body.model.position.z - this.model.position.z;
            let angle = Math.atan2(dx, dz) - Math.PI/2;

            this.model.rotation.y = angle;                
            this.shoot();            
        }
    }

    #initStateMachine() {
        this.stateMachine = new StateMachine(
            new IdlePlayerState( this, 'Idle' ),
            new WalkPlayerState( this, 'Run' ),
            new PlayerDeathState( this, 'Death' )
        )
       
        this.stateMachine.set( IdlePlayerState );
    }

    #update = () => {
        this.stateMachine.update();
        if ( this.currentReloadTime > 0 ) this.currentReloadTime--;
        position3dTo2d( this.lifeBarPlacer, this.lifeBar );
    }

    shoot() {        
        if ( this.currentReloadTime <= 0 ) {            
            this.#shoot( this.muzzleR );
            this.#shoot( this.muzzleL );

            playSound( 'shootC_' + randomInteger(0, 2), false );            

            this.currentReloadTime = this.shootReloadTime;
        }
    }

    #shoot( muzzle ) {
        let bullet = this.bullets.length > 0? this.bullets.pop() : new Bullet();

        bullet.onComplete = () => {
            this.bullets.push( bullet );
        }        

        bullet.model.position.set(0, 0, 0);
        muzzle.localToWorld( bullet.model.position );        
        bullet.model.rotation.y = this.model.rotation.y;       

        bullet.velocity.x = 2 * Math.cos( bullet.model.rotation.y ) //* 0.1;
        bullet.velocity.z = -2 * Math.sin( bullet.model.rotation.y ) //* 0.1;

        app.obj3d.main.add( bullet.model );
        bullet.start();
    }

    setDamage( damage ) {
        this.life -= damage;
        this.lifeBar.update();
        if ( this.life <= 0 ) {
            this.life = 0;
            this.stateMachine.set( PlayerDeathState )
        }
    }
}


class Bullet {
    time;
    model;
    velocity = new THREE.Vector3();
    onComplete = ()=>{};

    constructor() {
        this.model = assets.models.bullet.clone();

        this.model.getObjectByName('Trace').material = app.materials.bulletTrace;
        this.model.getObjectByName('Shine').material = app.materials.bulletShine;        

        let circleShape = new CircleShape(0.3);
        this.body = new VerletBody( this.model, circleShape );
        this.body.isSensor = true;
        this.body.events.on( VerletBody.EVENT_COLLIDE, this.onCollide );
    }

    onCollide = (body) => {
        if (body.character && (body.character instanceof SkeletonWarior || body.character instanceof SkeletonMage) ) {     
            body.character.life -= 35;
            
            if (body.character instanceof SkeletonMage) playSound( 'bulletImpact_' + randomInteger(0, 2), false );

            if ( body.character.life <= 0 ) {
                body.character.stateMachine.set( EnemyDeathState );
                app.boneEmitter.add( this.body.model.position, randomInteger(2, 4) );
            } else {
                body.character.stateMachine.set( EnemyReactState );
                app.bloodEmitter.add( this.body.model.position, randomInteger(3, 4) );
            }
        }
    }

    start() {        
        this.time = 10;
        this.model.scale.x = 0;
        this.model.visible = true;
        app.physics.addBody( this.body );
        app.update.add( this.update );
    }

    stop() {
        this.model.visible = false;
        app.physics.removeBody( this.body );
        app.update.delete( this.update );
        this.onComplete();
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