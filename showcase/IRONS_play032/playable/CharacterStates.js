
class IdleState extends State {
    character;
    idleAnimationName;
    
    constructor(character, idleAnimationName) {
        super();
        this.character = character;        
        this.idleAnimationName = idleAnimationName;        
        this.predicates.push( new WalkPlayerPredicate(character) );
    }

    enter() {        
        this.character.model.anim.set( this.idleAnimationName );
    }    
}

class WalkState extends State {
    character;
    runAnimationName;

    constructor(character, runAnimationName) {
        super();
        this.character = character;
        this.runAnimationName = runAnimationName;
        this.predicates.push( new IdlePlayerPredicate(character) );
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


class FightState extends State {
    constructor(character) {
        super();
        this.character = character;
        //this.predicates.push( new IdlePredicate(character) );
    }

    enter() {
        this.character.model.anim.set('Run_Hero');
    }

    update() {
        let vx = this.character.speed * Math.sin(this.character.model.rotation.y);
        let vz = this.character.speed * Math.cos(this.character.model.rotation.y);       

        this.character.body.velocity.x = vx;
        this.character.body.velocity.z = -vz;
    }
}



class IdlePredicate extends Predicate {
    constructor(character) {
        super();
        this.character = character;
        this.toState = IdlePlayerState;
    }

    check() {        
        return this.character.speed == 0;
    }
}


class WalkPredicate extends Predicate {
    constructor(character) {
        super();
        this.character = character;
        this.toState = WalkPlayerState;
    }

    check() {
        return this.character.speed > 0;
    }
}

class FightPredicate extends Predicate {
    constructor(character) {
        super();
        this.character = character;
        this.toState = WalkPlayerState;
    }

    check() {
        return this.character.speed > 0;
    }
}