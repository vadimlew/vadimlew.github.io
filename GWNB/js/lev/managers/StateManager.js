var nullFunction = function(){};

LEV.event.state = {};
LEV.event.state.CHANGE = 'change';
LEV.state.StateManager = function StateManager() { 
	LEV.components.event.call(this);

	var list = {};
	var currState = new LEV.state.State(); 
	var self = this;

	this.add = add; 
	this.set = set; 
	this.handle = handle; 

	Object.defineProperty(this, 'currState', {			
		get: function() {				
			return currState;
		}
	});	

	function add(state, toSet=false) {		
		var name = state.name;
		list[name] = state;
		state.sm = self;
		if (toSet) set(name);
	}	

	function set(name) {			
		if (!name || !list[name]) {
			console.error('Не указано имя state, либо state с таким именем нету - ' + name);
			return;
		}			

		currState.exit();							
		currState = list[name];
		currState.enter();
		
		self.event.dispatch(LEV.event.state.CHANGE, currState);
	} 

	function handle() { 
		currState.handle(); 
	}
}

LEV.state.State = function State() {	
	this.name = this.constructor.name;
	this.sm;
	this.enter = nullFunction;	
	this.handle = nullFunction;
	this.exit = nullFunction;
}

LEV.state.MultiState = function MultiState(...states) {
	State.call(this);

	this.add = function add(state) {
		states.push(state);
	}	

	this.enter = function() {
		states.forEach(function(element) {
			element.enter();
		});
	} 

	this.handle = function() {
		states.forEach(function(element) {
			element.handle();
		});
	} 

	this.exit = function() {
		states.forEach(function(element) {
			element.exit();
		});
	}
}

