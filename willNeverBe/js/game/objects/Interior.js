Factory.module.Interior = function(factory, entityManager) {
	var debug = {sort:0, origin:0, hitBox:0, phys:0};

	factory.interior = {};
	factory.interior.table = {};
	factory.interior.table.office_brown_horizontal = function(x,y) {
		return entityManager.create({
			name: 'office_brown_horizontal_table',
			position: {x:x, y:y},
			display: {image:'office_brown_horizontal_table.png', layer:factory.layer, shadow:[0,20,60,15], sort:{y:12}},
			phys: {shape:[0,10,60,20], mass:30, friction:0.65, type:'interior', masks:['wall', 'interior', 'equipment']},
			table: {altitude:10},
			//draggable: {},
			debug: debug/*/{origin:0, hitBox:0, phys:0, sort:1}//*/
		});
	}

	factory.interior.table.dining_white_horizontal = function(x,y) {
		return entityManager.create({
			name: 'dining_white_horizontal_table',
			position: {x:x, y:y},
			display: {image:'dining_white_horizontal_table.png', layer:factory.layer, shadow:[0,20,60,15], sort:{y:25}},
			phys: {shape:[0,10,60,20], mass:30, friction:0.65, type:'interior', masks:['wall', 'interior', 'equipment']},
			table: {altitude:10},		
			debug: debug//{origin:0, hitBox:0, phys:0, sort:1}
		});
	}

	factory.interior.table.dining_white_vertical = function(x,y) {
		return entityManager.create({
			name: 'dining_white_vertical_table',
			position: {x:x, y:y},
			display: {image:'dining_white_vertical_table.png', layer:factory.layer, shadow:[0,15,30,40], sort:{y:25}},
			phys: {shape:[0,10,30,40], mass:30, friction:0.65, type:'interior', masks:['wall', 'interior', 'equipment']},
			table: {altitude:10},
			debug: debug//{origin:0, hitBox:0, phys:0, sort:1}
		});
	}

	factory.interior.table.small_brown = function(x,y) {
		return entityManager.create({
			name: 'small_brown_table',
			position: {x:x, y:y},
			display: {image:'small_brown_table.png', layer:factory.layer, shadow:[0,15,30,20], sort:{y:30}},
			phys: {shape:[0,5,30,25], mass:10, friction:0.8, type:'interior', masks:['wall', 'interior', 'equipment']},	
			table: {altitude:10},		
			debug: debug//{origin:0, phys:0, sort:0}
		});
	}

	// Plants
	factory.interior.plants = {};
	factory.interior.plants.cactus = function(x,y,type='0') {
		switch(type) {
			case '0': return entityManager.create({	
				name: 'plants_cactus_1',
				position: {x:x, y:y},
				display: {ax:0.5, ay:1, image:'cactus.png', layer:factory.layer, sort:{y:0}},
				phys: {shape:[-7.5,-10,15,10], mass:8, friction:0.8, gravity:factory.gravity, type:'interior', masks:['wall', 'interior']},
				hitBox: {shape:[-7.5,-40,15,40], type:'object'},
				life: 50,
				destructible: true,
				debug: debug//{hitBox:0, phys:0}
			});	
			case '1': return entityManager.create({	
				name: 'plants_cactus_2',	
				position: {x:x, y:y}, 			
				display: {ax:0.5, ay:1, image:'cactus2.png', layer:factory.layer, sort:{y:0}},
				phys: {shape:[-7.5,-10,15,10], mass:8, friction:0.8, gravity:factory.gravity, type:'interior', masks:['wall', 'interior']},
				hitBox: {shape:[-7.5,-40,15,40], type:'object'},
				life: 50,
				destructible: true,
				debug: debug//{hitBox:0, phys:0}
			});	
		}		
	}	

	factory.interior.plants.flower = function(x,y,type='0') {
		switch(type) {
			case '0': return entityManager.create({	
				name: 'plants_flower',	
				position: {x:x, y:y},	
				display: {ax:0.5, ay:1, image:'flower.png', layer:factory.layer, sort:{y:0} },
				phys: {shape:[-7.5,-10,15,10], mass:5, friction:0.85, gravity:factory.gravity, type:'interior', masks:['wall', 'interior']},
				hitBox: {shape:[-7.5,-15,15,15], type:'object'},				
				life: 50,
				destructible: true,
				debug: debug//{origin:0, hitBox:0, phys:0}
			});	
		}		
	}

	// Seats
	factory.interior.seat = {};
	factory.interior.seat.chair = {};
	factory.interior.seat.stool = {};
	factory.interior.seat.chair.swivel_office_blue = function(x,y) {
		return entityManager.create({ 	
			name: 'swivel_office_blue_chair',			
			position: {x:x, y:y},
			display: {layer:factory.layer, shadow:[0,30,15,15], sort:{y:40}}, 
			animation: { 
				list: [ 
					{name:'spin', src:'chair_dark_spin', frames:4, speed:0.16, goto:0} 
				], 
				autoplay: false 
			}, 
			phys: {shape:[0,25,15,15], mass:12, friction:0.97, type:'interior', masks:['wall', 'interior', 'equipment']},
			hitBox: {shape:[0,5,15,25], type:'object'},				
			life: 200, 
			animateOnHit: {slowDown:true}, 
			destructible: true,			
			debug: /*debug/*/{sort:0, origin:0, hitBox:0, phys:0}//*/
		}); 
	}

	factory.interior.seat.chair.big_red = function(x,y,type='front') {
		switch(type) { 
			case 'front': return entityManager.create({ 
				name: 'chair_red_front',
				position: {x:x, y:y},
				display: {image:'chair_red_front.png', layer:factory.layer, shadow:[0,20,40,25], sort:{y:35}}, 
				phys: {x:x, y:y, shape:[0,20,40,15], mass:30, friction:0.5, type:'interior', masks:['wall', 'interior']}, 
				hitBox: {shape:[0,15,40,20, 5,0,30,15], type:'object'},				
				debug: {origin:0, hitBox:0, phys:0}
			});		

			case 'right': return entityManager.create({	
				name: 'chair_red_right',
				position: {x:x, y:y},			
				display: {image:'chair_red_right.png', layer:factory.layer, shadow:[0,30,30,20], sort:{y:35}}, 
				phys: {x:x, y:y, shape:[0,25,30,15], mass:30, friction:0.5, type:'interior', masks:['wall', 'interior']}, 
				hitBox: {shape:[0,15,30,25, 0,0,10,15], type:'object'},			
				debug: {hitBox:0, phys:0} 
			});		

			case 'left': return entityManager.create({ 	
				name: 'chair_red_left',
				position: {x:x, y:y},	
				display: {image:'chair_red_left.png', layer:factory.layer, shadow:[0,30,30,20], sort:{y:35}}, 
				phys: {x:x, y:y, shape:[0,25,30,15], mass:30, friction:0.5, type:'interior', masks:['wall', 'interior']}, 
				hitBox: {shape:[0,15,30,25, 20,0,10,15], type:'object'},				
				debug: {hitBox:0, phys:0} 
			});			
		} 
	}

	factory.interior.seat.couch = function(x,y,type='0') {
		switch(type) {
			case '0': return entityManager.create({		
				name: 'couch_red_front',
				position: {x:x, y:y},
				display: {image:'couch.png', layer:factory.layer, shadow:[0,25,60,20], sort:{y:35}},
				phys: {shape:[0,20,60,15], mass:80, friction:0.4, type:'interior', masks:['wall', 'interior']},	
				hitBox: {shape:[0,15,60,20, 5,0,50,15], type:'object'},
				debug: {hitBox:0, phys:0}
			});			
		}		
	}


	factory.interior.seat.stool.dining = function(x,y,color,id=1) {
		var hitBoxShape;
		switch(id) {
			case 1:
				hitBoxShape = [0,0,15,25];
				break;
			case 2:
				hitBoxShape = [0,15,15,10, 0,0,5,15];
				break;
			case 3:
				hitBoxShape = [0,0,15,25];
				break;
			case 4:
				hitBoxShape = [0,15,15,10, 10,0,5,15];
				break;
		}

		return entityManager.create({
			name: 'dining_stool_'+color+id,
			position: {x:x, y:y},
			display: {image:'dining_stool_'+color+id+'.png', layer:factory.layer, shadow:[0,20,15,15], sort:{y:30}},			
			phys: {shape:[0,20,15,5], mass:12, friction:0.9, type:'interior', masks:['wall', 'interior', 'equipment']},
			hitBox: {shape:hitBoxShape, type:'object'},
			life: 200,			
			destructible: true,
			debug: {origin:0, hitBox:0, phys:0}
		}); 
	}

	// Equipments
	factory.interior.equipment = {};
	factory.interior.equipment.pc = function(x,y) {
		return entityManager.create({
			name: 'pc',	
			position: {x:x, y:y},			
			display: {image:'comp.png', layer:factory.layer, sort:{y:30, h:15}},
			phys: {shape:[0,15,10,15], mass:5, friction:0.89, gravity:factory.gravity, type:'equipment', masks:['wall', 'equipment']},
			hitBox: {shape:[0,0,10,30], type:'object'},
			life: 100,
			destructible: true,
			debug: debug
		});	
	}

	factory.interior.equipment.monitor = function(x,y) {
		return entityManager.create({	
			name: 'monitor',	
			position: {x:x, y:y},				
			display: {layer:factory.layer, shadow:[0,20,35,5], sort:{y:25, h:25}},
			animation: {
				list: [
					{name:'blink', src:'monitor_blink', frames:2, speed:0.02, goto:0}
				],
				autoplay: true					
			},
			phys: {shape:[0,20,35,5], mass:5, friction:0.89, gravity:factory.gravity, type:'equipment', masks:['wall', 'equipment']},
			hitBox: {shape:[0,0,36,20], type:'object'},
			life: 100,
			destructible: true,
			debug: debug
		});	
	}

	factory.interior.equipment.keyboard = function(x,y) {
		var keyboard =  entityManager.create({
			name: 'keyboard',	
			position: {x:x, y:y},
			display: {image:'keyboard.png', layer:factory.layer, sort:{y:15}},
			phys: {shape:[0,5,25,10], mass:2, friction:0.89, gravity:factory.gravity, type:'equipment', masks:['wall', 'equipment', 'interior']},
			hitBox: {shape:[0,0,25,15], type:'object'},
			life: 10,
			destructible: true,
			debug: /*debug/*/{sort:0, origin:0, hitBox:0, phys:0}//*/
		});
		return keyboard;
	}
}