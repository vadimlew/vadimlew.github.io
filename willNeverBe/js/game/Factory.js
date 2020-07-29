function Factory() {
	var factory = this;
	var entityManager = new LEV.managers.EntityManager();
	
	factory.entityManager = entityManager;
	factory.layer = null;
	factory.gravity = .5;	

	for (var moduleName in Factory.module) {
		Factory.module[moduleName](factory, entityManager);
	}	

	factory.particle = {};	
	factory.particle = function(x,y,z, texture, pw, ph, lifetime) {
		var entity = entityManager.create({
			position: {x:x, y:y, z:z},
			display: {image:texture, layer:'floor', sort:{y:ph, h:ph}},
			phys: {shape:[0,0,pw,ph], friction:0.95, mass:.1, gravity:factory.gravity, type:'trash', masks:['wall']},
			lifeTime: {time: lifetime},
			garbage: true,
			debug: {phys:0}
		});
		return entity;
	}
}

Factory.module = {};
js.include('game.objects.actors.Player');
js.include('game.objects.actors.Enemy');
js.include('game.objects.Interior');
js.include('game.objects.Construct');
js.include('game.objects.Weapon');
js.include('game.objects.Room');