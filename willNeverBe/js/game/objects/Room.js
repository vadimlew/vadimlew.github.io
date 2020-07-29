Factory.module.Room = function(factory, entityManager) {
	/*'workplace',
	'kitchen',
	'toilet',
	'cabinet',
	'shed',
	'game room',
	'conference hall',
	'meeting room',
	'security room',
	'changing room',
	'store room',
	'server room',
	'smoking room',
	'reception',
	'elevator room',
	'fire ladder'*/

	factory.room = {};
	factory.room.kitchen = {};

	factory.room.workplace = function(x, y) {
		var dx = parseInt(-2 + 4*Math.random());
		var dy = parseInt(-2 + 4*Math.random());
		var dy2 = 10;

		var table = factory.interior.table.office_brown_horizontal(x,y);
		var pc = factory.interior.equipment.pc(x+47+dx, y-13+dy+dy2);
		var monitor = factory.interior.equipment.monitor(x+5+dx, y-20+dy+ dy2);	
		var keyboard = factory.interior.equipment.keyboard(x+7+dy, y+7+ dy2);	
		factory.interior.seat.chair.swivel_office_blue(x+24+dy*2, y+25+dy2);		

		table.surface.put(pc, monitor, keyboard);
	}

	factory.room.kitchen.dinnerТable = function(x, y, type) {
		factory.interior.table.dining_white_vertical(x,y);
		factory.interior.seat.stool.dining (x-15,y+15,'green',2); 
		factory.interior.seat.stool.dining (x-15,y-5,'green',2); 
		factory.interior.seat.stool.dining (x+30,y+15,'green',4); 
		factory.interior.seat.stool.dining (x+30,y-5,'green',4);
	}
}
