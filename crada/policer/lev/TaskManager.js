function TaskManager(isLoop=false) {
    let tasks = [];
    let args = [];   
    let currId = 0;
	let currentTask;

    function add(task) {
        tasks.push(task);
        args.push(Array.prototype.slice.call(arguments, 1));
    }

    function start() {		
        next();
    }	

	function next() {		
		if (currId >= tasks.length) {
			currId = 0;
            if (!isLoop) return;
        }

		let arg = args[currId];
		currentTask = new tasks[currId](...arg);

        currId++;

		if (currentTask.isAsync) currentTask.done = next;
		else next();
	}	

	function reset() {
		currId = 0;
	}

	function goto(idx, autoStart = true) {
		if (currentTask) currentTask.done = function(){};
		currId = idx;
		if (autoStart) next();		
	}

	function clear() {
		currId = 0;
		tasks.length = 0;
		args.length = 0;
		isLoop = false;
	}			

	this.start = start;
	this.reset = reset;
	this.next = next;
	this.goto = goto;
	this.add = add;
	this.clear = clear;
}

function Task(isAsync=false) {
	this.isAsync = isAsync;
	if (isAsync) this.done = function(){};
}


function PauseTask() {
    Task.call(this, true);
}


function WaitTask(time) {
	Task.call(this, true);
	gsap.delayedCall(time, ()=>this.done());
}


function FuncTask({func, args=[], isAsync=false}) {
	Task.call(this, isAsync);	
	func.bind(this)(...args);
}


function AnimTask({obj3d, state, finishState, isAsync=true}) {		
	Task.call(this, isAsync);	

	let animFinishHandler = () => {
		obj3d.mixer.removeEventListener('finished', animFinishHandler);
		if (finishState) obj3d.setState(finishState);
		if (isAsync) this.done();
	}

	obj3d.mixer.addEventListener('finished', animFinishHandler);
	obj3d.setState(state);
}


function LookTask({obj3d, lookAt, time=0.3, isAsync=true}) {
    Task.call(this, isAsync);	

	let dx = lookAt.x - obj3d.position.x;
	let dz = lookAt.z - obj3d.position.z;
	let angle = Math.atan2(dx, dz);
	if (Math.abs(angle - obj3d.rotation.y) > Math.PI) angle -= 2*Math.PI;
		
	gsap.to(obj3d.rotation, time, {y:angle, onComplete: ()=>this.done()});
}


function MoveTask({obj3d, moveTo, time=1, percent=1, isAsync=true}) {
    Task.call(this, isAsync);	

	let dx = moveTo.x - obj3d.position.x;
	let dz = moveTo.z - obj3d.position.z;

	let x = obj3d.position.x + dx * percent;
	let z = obj3d.position.z + dz * percent;
	
	gsap.to(obj3d.position, time, {x, z, ease:'sine.inOut', onComplete: ()=>this.done()});
}


function HideTask({obj, isAsync=false}) {
	Task.call(this, isAsync);

	obj.visible = false;
}
