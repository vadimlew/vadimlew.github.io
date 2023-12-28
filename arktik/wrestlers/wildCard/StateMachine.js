class State {
    predicates = [];
    stateMachine;
    enter(){};
    update(){};
    exit(){};
}

class Predicate {
    toState;
    check() {};
}

class StateMachine {
    states = {};
    current = new State();

    update = () => {        
        this.current.update();
        this.current.predicates.forEach(predicate => {
            if ( predicate.check(this.current) ) this.set( predicate.toState );
        });
    }

    set(stateName) {
        let state = this.states[ stateName ];

        if (!state) {
            console.warn('Такого State не существует');
            return;
        }

        this.current.exit();
        this.current = state;
        this.current.enter();
    }

    add() {
        for (let state of arguments) {
            if (state instanceof State) {
                state.stateMachine = this;
                this.states[ state.constructor.name ] = state;
            }            
        }        
    }
}


class IdleState extends State {
    constructor(character) {
        super();
        this.character = character;       
    }

    enter() {        
        this.character.anim.set('Idle');
    }    

    update() {
        this.character.fightTime--;
        if (this.character.fightTime < 0) this.character.fightTime = 0;
    }
}

let locPos = new CANNON.Vec3();
class WalkState extends State {
    constructor(character) {
        super();
        this.character = character;
    }

    enter() {
        this.character.anim.set('Walk');
        if (this.character.name == 'hero') playSound('waterStart');
        this.soundTimer = 10;
    }

    update() { 
        this.character.rotation.y %= 2*Math.PI;

        let dr = this.character.toRotate - this.character.rotation.y;
        if (dr > Math.PI) dr -= 2*Math.PI;
        if (dr < -Math.PI) dr += 2*Math.PI;

        if (Math.abs(dr) > 0.3 && this.soundTimer <= 0) {
            playSound('waterTurn');
            this.soundTimer = 5 + Math.floor(5*Math.random());
        }
        this.soundTimer--;

        this.character.rotation.y += dr / 4;        

        let vx = this.character.speed * Math.sin(this.character.rotation.y);
        let vz = this.character.speed * Math.cos(this.character.rotation.y);       

        this.character.body.velocity.x = vx*25;
        this.character.body.velocity.z = vz*25;         
        
        this.character.shoot();
    }
}


class IdlePredicate extends Predicate {
    constructor(character) {
        super();
        this.character = character;
        this.toState = 'IdleState';
    }

    check() {
        return this.character.speed == 0;
    }
}


class WalkPredicate extends Predicate {
    constructor(character) {
        super();
        this.character = character;
        this.toState = 'WalkState';
    }

    check() {
        return this.character.speed > 0;
    }
}