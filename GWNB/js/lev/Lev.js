var LEV = window.LEV || {};
LEV.event = {};
LEV.managers = {};
LEV.components = {};
LEV.physics = {};
LEV.state = {};
LEV.game = {};

LEV.components.name = function(name) {
	this.name = name;
	this.delete.add(()=>{
		trace('delete', this.name)			
		delete this.name;
	});
}

LEV.event.DELETE = 'delete';
LEV.components.event = function() {
	var event = {};
	var events = {};
	var isEmpty = true;

	event.on = function(eventName, callback) {
		if (!events[eventName]) {
			events[eventName] = [];
		}
		events[eventName].push(callback);	
		isEmpty = false;		
	}

	event.off = function(eventName, callback) {
		if (!events[eventName]) {
			return;
		}
		var ix = events[eventName].indexOf(callback);
		if (ix != -1) events[eventName].splice(ix, 1);	
		if (events[eventName].length == 0) delete events[eventName];	
		if (Object.keys(events).length == 0) isEmpty = true;
	}

	event.clear = function() {		
		for (var key in events) { 			
			events[key].length = 0;			
    		delete events[key];
    	}
		isEmpty = true;
	}

	event.dispatch = function(eventName, ...params) {
		if (isEmpty) return;	
		//trace('dispatch ', eventName);	
		if (events[eventName]) {			
			var funcs = events[eventName];
			for (var i=0; i < funcs.length; i++) {
				funcs[i](...params);
			}			
		}
	}

	this.event = event;

	if (!this.delete) return;
	this.delete.add(function() {
		events = {};
		delete event.on;
		delete event.off;
		delete event.dispatch;
		delete this.event;
	}.bind(this));
}

LEV.components.delete = function() {
	var funcs = [];
	var entity = this;

	entity.delete = function() {
		entity.delete.event.dispatch(LEV.event.DELETE, entity);		
		for (var i = 0; i < funcs.length; i++) {
			funcs[i]();
		}
		delete entity.delete;			
	}
	
	LEV.components.event.call(entity.delete);

	entity.delete.add = function(func) {
		if (typeof func != 'function') {
			console.error('param had to be a function');
			return;
		}		
		funcs.push(func);
	}		

	entity.delete.remove = function(func) {
		if (typeof func != 'function') {
			console.error('param had to be a function');
			return;
		}
		var ix = funcs.indexOf(func);		
		if (ix != -1) funcs.splice(ix, 1);
	}	
}

//js.include('lev.shapes.Shapes');
//js.include('lev.managers.CollisionManager');
js.include('lev.display.DisplayManager');
js.include('lev.managers.StateManager');
js.include('lev.managers.EntityManager');
js.include('lev.managers.InputManager');
//js.include('lev.managers.TimeManager');
js.include('lev.phys.VerletPhysics');
