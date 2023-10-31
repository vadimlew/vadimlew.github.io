class IdlePlayerState extends State {
    character;
    idleAnimationName;
    
    constructor(character, idleAnimationName) {
        super();
        this.character = character;        
        this.idleAnimationName = idleAnimationName;        
       
        this.addPredicate( new WalkPlayerPredicate(character) );
        //this.addPredicate( new AttackPlayerPredicate(character) );
    }

    enter() {        
        //this.character.model.animation.set( this.idleAnimationName );
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
        //this.addPredicate( new AttackPlayerPredicate(character) );
    }

    enter() {
        //playSound( 'step_1', true );
        //this.character.model.animation.set( this.runAnimationName );
    }

    update() {
        let vx = this.character.speed * Math.cos(this.character.model.rotation.y);
        let vz = -this.character.speed * Math.sin(this.character.model.rotation.y);       

        this.character.model.position.x += vx;
        this.character.model.position.z += vz;
    }

    exit() {
        //stopSound( 'step_1' );
    }
}


class AttackPlayerState extends State {
    character;
    attackAnimationName;

    constructor(character, attackAnimationName) {
        super();
        this.character = character;
        this.attackAnimationName = attackAnimationName;        
    }

    enter() {        
        //this.character.model.animation.set( this.attackAnimationName );
        this.character.shoot();
        this.stateMachine.set( IdlePlayerState );
    }

    update() {
        
    }

    exit() {
        
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
            return true;
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
            return true;
        }
    }
}


class AttackPlayerPredicate extends Predicate {
    character;
    currentReloadTime = 0;
    shootReloadTime = 10;
    attackTarget;

    constructor(character) {
        super();
        this.character = character;
        this.character.sensor.events.on( VerletBody.EVENT_COLLIDE, this.onCollide );
    }

    onCollide = (body) => {
        if ( body.character && body.character instanceof SkeletonWarior )
            this.attackTarget = body.character;
    }

    check() {   
        if ( this.currentReloadTime > 0 ) {
            this.currentReloadTime--;
        } else if ( this.attackTarget ) {
            this.stateMachine.set( AttackPlayerState, this.attackTarget );
            this.attackTarget = undefined;
            return true;
        }       
    }
}