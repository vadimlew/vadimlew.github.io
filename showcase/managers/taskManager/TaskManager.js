class TaskManager {
    #isLoop;

    #tasks = [];   
    #currId = 0;
	#currentTask;

    constructor({ tasks, isLoop=false }) {
		this.#isLoop = isLoop;
		if (tasks) this.add( ...tasks );        
    }

    add( ...tasks ) {
        this.#tasks.push( ...tasks );		
    }

    #next = () => {		
		if ( this.#currId >= this.#tasks.length ) {
			this.#currId = 0;
            if ( !this.#isLoop ) return;
        }
		
		if ( this.#currentTask ) this.#currentTask.onComplete = Task.EMPTY_FUNCTION;
		this.#currentTask = this.#tasks[ this.#currId ];
		this.#currentTask.onComplete = this.#next;
        this.#currId++;

		this.#currentTask.do();
	}	

	start() {		
        this.#next();
    }	

	reset() {
		this.#currId = 0;
	}

    goto( idx, autoStart = true ) {
		if ( this.#currentTask ) this.#currentTask.onComplete = ()=>{};
		this.#currId = idx;
		if ( autoStart ) this.#next();
	}

	clear() {
		this.#currId = 0;
		this.#tasks.length = 0;		
		this.#isLoop = false;
	}			
}

class Task {
	static EMPTY_FUNCTION = ()=>{};
    isAsync = false;
    onComplete = Task.EMPTY_FUNCTION;
    do() {};
}