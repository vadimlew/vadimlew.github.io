class EnemyIdleState extends State {
    character;
    idleAnimationName;
    
    constructor(character, idleAnimationName) {
        super();
        this.character = character;
        this.idleAnimationName = idleAnimationName;
    }

    enter() {
        this.character.model.animation.set( this.idleAnimationName );
        this.character.sensor.events.on( VerletBody.EVENT_COLLIDE, this.onCollide );
    }

    onCollide = (body)=>{
        if ( body.character instanceof Player ) {
            this.stateMachine.set( FollowCharacterState, body.character );
        }
    }

    exit() {
        this.character.sensor.events.off( VerletBody.EVENT_COLLIDE, this.onCollide );
    }
}


class FollowCharacterState extends State {
    character;
    targetCharacter;
    runAnimationName;

    constructor(character, runAnimationName) {
        super();
        this.character = character;
        this.runAnimationName = runAnimationName;
    }

    enter( targetCharacter ) {
        //playSound( 'step_1', true );
        this.targetCharacter = targetCharacter;
        this.character.model.animation.set( this.runAnimationName );
        this.character.model.animation.action[this.runAnimationName].time = Math.random() * 0.3;

        this.character.body.events.on( VerletBody.EVENT_COLLIDE, this.onBodyCollide );
        this.character.sensor.events.on( VerletBody.EVENT_COLLIDE, this.onSensorCollide );
    }

    update() {
        let dx = this.targetCharacter.model.position.x - this.character.model.position.x;
        let dz = this.targetCharacter.model.position.z - this.character.model.position.z;

        this.character.model.rotation.y = Math.atan2(dx, dz);

        this.character.speed += (this.character.maxSpeed - this.character.speed) * 0.5;
        let vx = this.character.speed * Math.sin( this.character.model.rotation.y );
        let vz = this.character.speed * Math.cos( this.character.model.rotation.y );

        this.character.model.position.x += vx;
        this.character.model.position.z += vz;
    }

    onBodyCollide = (body)=>{
        if ( body.character instanceof Player ) {
            this.stateMachine.set( EnemyAttackState, body.character );
        }
    }

    onSensorCollide = (body)=>{
        if ( body.character instanceof SkeletonWarior && body.character.stateMachine.current instanceof EnemyIdleState ) {
            body.character.stateMachine.set( FollowCharacterState, this.targetCharacter );
        }
    }

    exit() {
        //stopSound( 'step_1' );
        this.character.body.events.off( VerletBody.EVENT_COLLIDE, this.onBodyCollide );
        this.character.sensor.events.off( VerletBody.EVENT_COLLIDE, this.onSensorCollide );
    }   
}


class EnemyAttackState extends State {
    character;
    hitTime;
    attackAnimationName;  
    attacked; 
    isHit = false; 
    
    constructor(character, attackAnimationName, hitTime) {
        super();
        this.character = character;
        this.attackAnimationName = attackAnimationName;
        this.hitTime = hitTime;
        
        this.character.model.animation.action[attackAnimationName].setLoop( THREE.LoopOnce );
    }

    enter( attacked ) {
        this.isHit = false;
        this.attacked = attacked;
        this.character.model.animation.set( this.attackAnimationName );
        this.character.model.animation.mixer.addEventListener( 'finished', this.onAnimationFinshed );
        this.character.model.animation.action[this.attackAnimationName].time = Math.random() * 0.5;

        //gsap.delayedCall( 0.4, ()=>this.pushBack(attacked) );
    }

    update() {        
        if( !this.isHit && this.character.model.animation.action[this.attackAnimationName].time >= this.hitTime ) {
            this.pushBack( this.attacked );
        }
    }

    pushBack( attacked ) {
        this.isHit = true;

        let dx = attacked.model.position.x - this.character.model.position.x;
        let dz = attacked.model.position.z - this.character.model.position.z;
        let distance = Math.sqrt(dx**2 + dz**2);

        let nx = dx / distance;
        let nz = dz / distance;

        attacked.model.position.x += nx * 0.25;
        attacked.model.position.z += nz * 0.25;

        attacked.setDamage(5);
    }

    onAnimationFinshed = () => {
        this.stateMachine.set( EnemyIdleState );
    }

    exit() {
        this.character.model.animation.mixer.removeEventListener( 'finished', this.onAnimationFinshed );
    }
}


class EnemyReactState extends State {
    character;
    reactAnimationName;
    isReact = false;
    
    constructor(character, reactAnimationName) {
        super();
        this.character = character;
        this.reactAnimationName = reactAnimationName;

        this.character.model.animation.action[reactAnimationName].setLoop( THREE.LoopOnce );
    }

    enter() {
        if ( this.isReact ) return;
        this.isReact = true;

        this.character.model.animation.set( this.reactAnimationName );
        this.character.model.animation.mixer.addEventListener( 'finished', this.onAnimationFinshed );        
    }    

    onAnimationFinshed = () => {
        this.stateMachine.set( EnemyIdleState );
    }

    exit() {
        this.isReact = false;
        this.character.model.animation.mixer.removeEventListener( 'finished', this.onAnimationFinshed );
    }
}


class EnemyDeathState extends State {
    character;
    deathAnimationName;
    isDeath = false;
    
    constructor(character, deathAnimationName) {
        super();
        this.character = character;
        this.deathAnimationName = deathAnimationName;

        this.character.model.animation.action[deathAnimationName].setLoop( THREE.LoopOnce );        
    }

    enter() {
        if ( this.isDeath ) return;
        this.isDeath = true;
        this.character.model.animation.set( this.deathAnimationName );
        app.physics.removeBody( this.character.body );

        gsap.to( this.character.model.position, 1, {y: '-=2', ease: 'sine.in', delay: 1} );        
    }   
}