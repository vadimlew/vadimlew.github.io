class State {    
    stateMachine;
    enter(){};
    update(){};
    exit(){};
}

class StateMachine {
    states = {};
    current = new State();

    update = () => {        
        this.current.update();
    }

    set(stateName, parameters) {
        let state = this.states[stateName];

        if (!state) {
            console.warn('Такого State не существует', stateName.name);
            return;
        }

        this.current.exit();
        this.current = state;
        this.current.enter(parameters);
    }

    add() {
        for (let state of arguments) {
            if (state instanceof State) {
                state.stateMachine = this;
                this.states[ state.constructor ] = state;
            }            
        }        
    }
}