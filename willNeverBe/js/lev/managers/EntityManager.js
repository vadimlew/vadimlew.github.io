LEV.managers.EntityManager = function EntityManager() {
	LEV.event.COMPONENT_ADDED = 'component_added';

	var entities = [];

	function Entity() {
		LEV.components.delete.call(this);		
	};	

	function create(components) {		
		var entity = new Entity();			
		
		for (var prop in components) {					
			LEV.components[prop].call(entity, components[prop]);			
		}

		entities.push(entity);
		return entity;
	}

	this.getEntityByName = function(name) {
		var result = [];
		for (var i = 0; i < entities.length; i++) {
			if (entities[i].name == name) 
				result.push(entities[i]);
		}
		return result;
	}

	this.create = create;
}