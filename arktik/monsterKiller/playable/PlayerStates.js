class IdlePlayerState extends State {
    character;
    idleAnimationName;
    
    constructor(character, idleAnimationName) {
        super();
        this.character = character;        
        this.idleAnimationName = idleAnimationName;        
       
        this.addPredicate( new WalkPlayerPredicate(character) );
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
    }

    enter() {
        //playSound( 'step_1', true );
        this.character.model.animation.set( this.runAnimationName );
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