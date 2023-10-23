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

        this.character.body.events.on( VerletBody.EVENT_COLLIDE, this.onCollide );
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

    onCollide = (body)=>{
        if ( body.character instanceof Player ) {
            this.stateMachine.set( EnemyAttackState, body.character );
        }
    }

    exit() {
        //stopSound( 'step_1' );
        this.character.body.events.off( VerletBody.EVENT_COLLIDE, this.onCollide );
    }   
}


class EnemyAttackState extends State {
    character;
    attackAnimationName;    
    
    constructor(character, attackAnimationName) {
        super();
        this.character = character;
        this.attackAnimationName = attackAnimationName;
        
        this.character.model.animation.action[attackAnimationName].setLoop( THREE.LoopOnce );
    }

    enter( attacked ) {
        this.character.model.animation.set( this.attackAnimationName );
        this.character.model.animation.mixer.addEventListener( 'finished', this.onAnimationFinshed );

        gsap.delayedCall( 0.4, ()=>this.pushBack(attacked) );
    }

    pushBack( attacked ) {
        let dx = attacked.model.position.x - this.character.model.position.x;
        let dz = attacked.model.position.z - this.character.model.position.z;
        let distance = Math.sqrt(dx**2 + dz**2);

        let nx = dx / distance;
        let nz = dz / distance;

        attacked.model.position.x += nx * 0.25;
        attacked.model.position.z += nz * 0.25;
    }

    onAnimationFinshed = () => {
        this.stateMachine.set( EnemyIdleState );
    }

    exit() {
        this.character.model.animation.mixer.removeEventListener( 'finished', this.onAnimationFinshed );
    }
}