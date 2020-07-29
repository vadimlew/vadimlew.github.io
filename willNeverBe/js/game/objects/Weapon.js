Factory.module.Weapon = function(factory, entityManager) {

	factory.weapon = {};
	factory.weapon.pistol = function(shooter) {
		return entityManager.create({
			name: 'pistol',
			position: {z:7.5},
			display: {px:2.5, py:7, image:'pistol.png', shadow:[0,10,10,5], layer:'game', sort:{y:0}},
			handgun: {shooter:shooter, bullet_type:'player_bullet'},
			debug: /*debug/*/{sort:0, origin:0, hitBox:0, phys:0}//*/
		});
	}	

	factory.weapon.bullet = function(props) {
		var x = props.x || 0;
		var y = props.y || 0;
		var z = props.z || 0;
		var vx = props.vx || 0;
		var vy = props.vy || 0;
		var damage = props.damage || 0;
		var kick = props.kick || 0;
		var type = props.bullet_type || 'bullet';
		var masks = props.bullet_mask || [];
		var size = props.size || 5;

		var shape = new PIXI.Graphics();		
		shape.beginFill(0xfff74f);
		shape.lineStyle(1.5, 0xff1a1a);
		shape.drawRect(-size/2, -size/2, size, size);
		shape.cacheAsBitmap = true;

		var entity = entityManager.create({
			name:'bullet',
			position: {x:x, y:y, z:z},
			display: {image:shape, layer:'game', sort:{y:0}},	
			phys: {shape:[-size/2, -size/2, size, size], velocity:[vx, vy], mass:1, friction:1, type:type},		
			hitBox: {shape:[-size/2, -size/2, size, size], type:type, masks:masks},
			damage: {value:damage, kick:kick},
			deleteOnHit: true,
			debug: {hitBox:0}
		})		
		return entity;
	}

}