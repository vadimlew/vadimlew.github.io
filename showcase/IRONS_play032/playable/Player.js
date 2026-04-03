class Player {
    model;
    body;
    stateMachine;

    speed = 0;
    maxSpeed = 5;
    attackSpeed = 2;

    constructor() {
       this.#initModel();
    }

    startFightPhase() {
        this.#initPhysBody();
        this.#initStateMachine();

        app.update.add(this.#update);
    }

    stopFightPhase() {     
        this.stateMachine.set(IdlePlayerState);   
        app.update.delete(this.#update);
    }

    #initModel() {
        this.model = assets.models.hero;
        this.model.position.y = 0.1;

        this.model.getObjectByName('Armature').children.forEach((obj) => {
            if (obj.type == 'Bone') {
                //console.log( obj.name);
                return;
            }
    
            obj.material = app.materials.hero;
            obj.castShadow = true;
            obj.receiveShadow = true;

            obj.visible = false;
        });	
        
        /*this.model.getObjectByName('Body_Morales').visible = true;
        this.model.getObjectByName('Left_Arm_Morales').visible = true;
        this.model.getObjectByName('Right_Arm_Morales').visible = true;
        this.model.getObjectByName('Head_Morales').visible = true;
        this.model.getObjectByName('Left_Leg_Morales').visible = true;
        this.model.getObjectByName('Right_Leg_Morales').visible = true;*/

        addAnimationMixer( this.model );
        this.model.anim.set( 'Idle' );

        this.model.anim.action['Head'].setLoop( THREE.LoopOnce );
        this.model.anim.action['Arms'].setLoop( THREE.LoopOnce );
        this.model.anim.action['Leg'].setLoop( THREE.LoopOnce );
        this.model.anim.action['Kick_Hero'].setLoop( THREE.LoopOnce );

        this.trailPoint = this.model.getObjectByName('mixamorigRightFoot');        
    }

    #initPhysBody() {
        this.body = new CANNON.Body({
            mass: 10,
            position: new CANNON.Vec3(this.model.position.x, this.model.position.y, this.model.position.z),
            material: app.cannon.frictionMaterial,
            fixedRotation: true	
        });	
        this.body.addShape( new CANNON.Cylinder(0.45, 0.45, 2, 6), new CANNON.Vec3(0, 1, 0) );    
        this.body.character = this;   

        /*let geometry = new THREE.CylinderGeometry( 0.45, 0.45, 2, 6 ); 
        let material = new THREE.LineBasicMaterial( {color: 0xffff00} ); 
        let cylinder = new THREE.Line( geometry, material );
        cylinder.wireframe = true;
        cylinder.position.y = 1;
        this.model.add(cylinder);*/

        app.cannon.world.addBody(this.body);
    }

    #initStateMachine() {
        let idleState = new IdlePlayerState(this, 'Idle');
        let walkState = new WalkPlayerState(this, 'Run_Hero');
        let fightState = new FightPlayerState(this, 'Kick_Hero');

        let stateMachine = new StateMachine( idleState, walkState, fightState );
        stateMachine.set(IdlePlayerState);

        this.stateMachine = stateMachine;
    }

    #update = () => {
        this.body.position.y = 0;
        this.model.position.lerp( this.body.position, 0.5 );
        this.stateMachine.update();

        if (this.model.position.z <= -23) {
            app.events.emit( app.events.PLAYER_SHOW_BOSS );
        }
    }

    dressUp(part) {
        this.model.attach(part);

        part.rotation.x = 0;
        part.rotation.z = 0;

        gsap.killTweensOf( part.position );

        gsap.to( part.rotation, 0.5, {y:0, ease:'sine.out'});
        gsap.to( part.scale, 0.5, {x:1, y:1, z:1, ease:'sine.out'});
        gsap.to( part.position, 0.5, {x:0, y:part.placeY, z:0, ease:'sine.out'});

        gsap.delayedCall( 0.5, () => {
            part.visible = false; 
            this.#setReaction(part);
        });
    }   

    #setReaction(part) {
        part.partNames.forEach( partName => this.model.getObjectByName(partName).visible = true );
        
        if ( part.name.includes('Arm') ) {
            this.model.anim.set('Arms', 0.5);
            this.model.anim.mixer.addEventListener( 'finished', this.#onAnimationFinished );
        }

        if ( part.name.includes('Head') ) {
            this.model.anim.set('Head', 0.5);
            this.model.anim.mixer.addEventListener( 'finished', this.#onAnimationFinished );
        }

        if ( part.name.includes('Leg') ) {
            this.model.anim.set('Leg', 0.5);
            this.model.anim.mixer.addEventListener( 'finished', this.#onAnimationFinished );
            this.model.anim.mixer.addEventListener( 'finished', this.#dressComplete );
        }
    }

    #onAnimationFinished = () => {
        this.model.anim.set('Idle', 0.5);
        this.model.anim.mixer.removeEventListener( 'finished', this.#onAnimationFinished );
    }

    #dressComplete = () => {
        app.events.emit( app.events.PLAYER_DRESSED );
        this.model.anim.mixer.removeEventListener( 'finished', this.#dressComplete );
    }
}


class IdlePlayerState extends State {
    character;
    idleAnimationName;
    
    constructor(character, idleAnimationName) {
        super();
        this.character = character;        
        this.idleAnimationName = idleAnimationName;     

        this.addPredicate( new WalkPlayerPredicate(character) );
        this.addPredicate( new FightPlayerPredicate(character) );
    }

    enter() {        
        this.character.model.anim.set( this.idleAnimationName );
    }    
}


class WalkPlayerState extends State {
    character;
    runAnimationName;

    constructor(character, runAnimationName) {
        super();
        this.character = character;
        this.runAnimationName = runAnimationName;

        this.addPredicate( new IdlePlayerPredicate(character) );
        this.addPredicate( new FightPlayerPredicate(character) );
    }

    enter() {
        this.character.model.anim.set( this.runAnimationName );
    }

    update() {
        let vx = this.character.speed * Math.sin(this.character.model.rotation.y);
        let vz = this.character.speed * Math.cos(this.character.model.rotation.y);       

        this.character.body.velocity.x = vx;
        this.character.body.velocity.z = -vz;
    }
}


class FightPlayerState extends State {
    enemyBodies = [];
    fightAnimationName;

    constructor( character, fightAnimationName ) {
        super();
        this.character = character;        
        this.fightAnimationName = fightAnimationName;        
    }

    enter( enemyBodies ) {       

        for ( let enemyBody of enemyBodies ) {
            enemyBody.character.isHit = true;
            this.enemyBodies.push( enemyBody );
        }

        this.character.model.anim.set( this.fightAnimationName );
        this.character.model.anim.mixer.addEventListener( 'finished', this.onAnimationFinished );

        gsap.delayedCall(0.35, this.onEnemyHit);
       
        gsap.ticker.add( addTrail );
    }

    onEnemyHit = () => {
        playSound('kick body', false, 1, 0.75 + Math.random() * 0.5);
        app.obj3d.followCamera.shake();            

        for ( let enemyBody of this.enemyBodies ) {
            let vx = 4 * Math.sin(enemyBody.character.model.rotation.y);
            let vz = 4 * Math.cos(enemyBody.character.model.rotation.y);   

            addBlood(enemyBody.character.model.position, 0xee7500, -vx/60, -vz/60);

            enemyBody.velocity.x -= vx;
            enemyBody.velocity.y += 0.8;
            enemyBody.velocity.z -= vz;
            enemyBody.character.stateMachine.set( DeathEnemyState );
        }   
        
        this.enemyBodies.length = 0;
    }

    onAnimationFinished = () => {
        this.stateMachine.set( IdlePlayerState );
    }

    update() {
        //let dx = this.enemyBodies.position.x - this.character.body.position.x;
        //let dz = this.enemyBodies.position.z - this.character.body.position.z;

        //this.character.model.rotation.y = Math.atan2(dx, -dz);

        let vx = this.character.attackSpeed * Math.sin(this.character.model.rotation.y);
        let vz = this.character.attackSpeed * Math.cos(this.character.model.rotation.y);       

        this.character.body.velocity.x = vx;
        this.character.body.velocity.z = -vz;
    }

    exit() {
        gsap.ticker.remove( addTrail );
        this.character.model.anim.mixer.removeEventListener( 'finished', this.onAnimationFinished );
    }
}


class IdlePlayerPredicate extends Predicate {
    character;
    
    constructor(character) {
        super();
        this.character = character;        
    }

    check() {        
        if ( this.character.speed === 0 ) {
            this.stateMachine.set( IdlePlayerState );
        }
    }
}


class WalkPlayerPredicate extends Predicate {
    character;

    constructor(character) {
        super();
        this.character = character;        
    }

    check() {        
        if ( this.character.speed > 0 ) {
            this.stateMachine.set( WalkPlayerState );
        }
    }
}


class FightPlayerPredicate extends Predicate {
    character;
    bodies = new Set();

    constructor(character) {
        super();
        this.character = character;        
        this.character.body.addEventListener( CANNON.Body.COLLIDE_EVENT_NAME, this.onBodyCollide );
    }

    onBodyCollide = ({body}) => {        
        if ( body.character?.constructor === Enemy && !body.character.isHit ) {
            this.bodies.add(body);
        }        
    }

    check() {
        for ( let body of this.bodies ) {
            if (body.character.isHit) {
                this.bodies.delete( body );
            }
        }

        if ( this.bodies.size > 0 ) {
            this.stateMachine.set( FightPlayerState, this.bodies );
            this.bodies.clear();
        }
    }
}