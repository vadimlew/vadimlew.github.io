LEV.utils = new (function Utilities() {	
	this.addPolyMethod = addPolyMethod;

	function addPolyMethod(object, name, fn) {
	    var old = object[name];	    
	    object[name] = old? function() {
	    	old.apply(this, arguments);
	    	fn.apply(this, arguments);	    	
	    } : fn;
	}	
})


