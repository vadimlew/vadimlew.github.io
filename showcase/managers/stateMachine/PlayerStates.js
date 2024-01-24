class IdlePlayerState extends State {
    character;
    idleAnimationName;
    idleAnimationName2;
    
    constructor(character, idleAnimationName, idleAnimationName2) {
        super();
        this.character = character;        
        this.idleAnimationName = idleAnimationName;
        this.idleAnimationName2 = idleAnimationName2;
       
        this.addPredicate( new WalkPlayerPredicate(character) );
    }

    enter() {        
        let animationName = this.character.papers.length > 0 ? this.idleAnimationName2 : this.idleAnimationName;
        this.character.model.anim.set( animationName );
    }
}


class WalkPlayerState extends State {
    character;
    runAnimationName;
    runAnimationName2;

    stepSoundTimer = 0;

    constructor(character, runAnimationName, runAnimationName2) {
        super();
        this.character = character;
        this.runAnimationName = runAnimationName;
        this.runAnimationName2 = runAnimationName2;

        this.addPredicate( new IdlePlayerPredicate(character) );
    }

    enter() {        
        let animationName = this.character.papers.length > 0 ? this.runAnimationName2 : this.runAnimationName;
        this.character.model.anim.set( animationName );
    }

    update() {
        let vx = this.character.speed * Math.sin(this.character.model.rotation.y);
        let vz = this.character.speed * Math.cos(this.character.model.rotation.y);

        this.character.model.position.x += vx;
        this.character.model.position.z += vz;

        this.stepSoundTimer++;
        if ( this.stepSoundTimer >= 10 ) {
            this.stepSoundTimer = 0;
            let stepSoundName = 'step_' + randomInteger(1, 4);
            playSound( stepSoundName );
        }
    }

    exit() {
        // stopSound( 'step_1' );
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