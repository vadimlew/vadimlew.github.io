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
        this.character.model.animation.set( this.idleAnimationName );
    }
}


class WalkPlayerState extends State {
    character;
    runAnimationName;
    stepTimer = 0;

    constructor(character, runAnimationName) {
        super();
        this.character = character;
        this.runAnimationName = runAnimationName;

        this.addPredicate( new IdlePlayerPredicate(character) );
        //this.addPredicate( new AttackPlayerPredicate(character) );
    }

    enter() {
        this.stepTimer = 0;
        this.character.model.animation.set( this.runAnimationName );
    }

    update() {
        // this.character.moveRotation = this.character.toRotate;
        this.character.model.rotation.y = this.character.moveRotation;

        let vx = this.character.speed * Math.cos( this.character.toRotate );
        let vz = -this.character.speed * Math.sin( this.character.toRotate );       

        this.character.model.position.x += vx;
        this.character.model.position.z += vz;

        this.stepTimer--;
        if ( this.stepTimer <= 0 ) {
            this.stepTimer = 14;
            playSound( 'step_' + randomInteger(0, 2), false );
        }        
    }

    // exit() {
    //     stopSound( 'step_0' );
    // }
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
        this.character.shoot();
        this.stateMachine.set( IdlePlayerState );
    }   
}


class PlayerDeathState extends State {
    character;
    deathAnimationName;

    constructor(character, deathAnimationName) {
        super();
        this.character = character;
        this.deathAnimationName = deathAnimationName;        
    }

    enter() {        
        this.character.model.animation.set( this.deathAnimationName );
        app.obj2d.joystick.stop();
        gsap.to( app.obj3d.player.lifeBar, 0.5, { alpha: 0 } );

        gsap.delayedCall( 1, ()=>{
            app.obj2d.looseScreen.show();
            appEndGame();
        });	    
       
        app.physics.removeBody( this.character.body );
        app.physics.removeBody( this.character.sensor );      
        
        this.character.events.emit('death');

        fadeSound("music", 0.3, 0.0, 1000);
        playSound('death');
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