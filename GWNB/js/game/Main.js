js.include('lev.Lev');
js.include('game.Factory');
js.include('game.LoadAssets');
js.include('game.GameEngine');
js.include('game.Camera');
js.include('game.LevelCreator');

function Game(width=800, height=600) {	
	var pixi = new PIXI.Application({  width:width, height:height, antialias: true, backgroundColor: 0x111111 });
	pixi.ticker.autoStart = false;

	var factory = new Factory();	
	var input = new LEV.managers.InputManager(pixi);
	var display = new LEV.managers.DisplayManager(pixi);	
	var phys = new LEV.physics.VerletPhysics();	
	var engine = new LEV.game.Engine(pixi);	
	var level = new LevelCreator(pixi);
	var camera;
	var player;

	//public 
	this.pixi = pixi;	
	this.factory = factory;
	this.input = input;
	this.phys = phys;
	this.display = display;

	this.init = function() {
		document.body.appendChild(pixi.view);
		pixi.view.focus();				
		loadAssets(pixi, initGame);	
	}
	
	function initGame() {		
		display.layer.create('floor');
		display.layer.create('garbage');
		display.layer.create('game');
		display.layer.create('debug');

		engine.init();

		pixi.ticker.add(phys.update);
		pixi.ticker.add(display.update);		
		pixi.ticker.start();		
		
		initPlayer();
		createLevel();
		//camera = new Camera(display.root, 0, 0, width, height);
		//camera.followTo(player.display);
	}

	function initPlayer() {
		factory.layer = 'game';
		player = factory.player.designer(100+400-200,150);		
	}

	function createLevel() {
		//level.create(800,600,10);
		//level.create(1600,1200,20);
		//pixi.stage.addChild(level.display);
		//return;

		/*factory.layer = 'floor';
		for (var i = 0; i < level.rooms.length; i++) {
			var room = level.rooms[i];
			var pattern = 'floor_rect_pattern' + (1 + i%3);			
			factory.construct.floor(room.x,room.y,room.width,room.height,pattern);
		}

		factory.layer = 'game';
		for (var i = 0; i < level.walls.length; i++) {
			var wall = level.walls[i];	
			var dx = wall.direction == 'h'? 0 : 5;
			var dy = wall.direction == 'v'? 0 : 5;
			var width = 50;
			var wall_height = 20;

			if (wall.direction == 'h') {
				if (wall.door) {
					var len1 = wall.door.x - wall.x - width/2;
					var len2 = wall.length - len1 - width;
					factory.construct.wall(wall.x, wall.y-dy-wall_height,'h', len1);
					factory.construct.wall(wall.x+len1+width, wall.y-dy-wall_height,'h', len2);
				} else {
					factory.construct.wall(wall.x,wall.y-dy-wall_height,'h',wall.length);
				}
			} else {
				if (wall.door) {
					var len1 = wall.door.y - wall.y - width/2;
					var len2 = wall.length - len1 - width;
					factory.construct.wall(wall.x-dx,wall.y-wall_height,'v',len1);
					factory.construct.wall(wall.x-dx,wall.y+len1+width-wall_height,'v',len2);
				} else {
					factory.construct.wall(wall.x-dx,wall.y-wall_height,'v',wall.length);
				}
			}					
		}*/

		//return;
		factory.layer = 'floor';
		factory.construct.floor(0,0,205,380,'floor_rect_pattern1');
		factory.construct.floor(205,0,195,380,'floor_rect_pattern2');
		factory.construct.floor(0,380,600,220,'floor_rect_pattern3');
		factory.construct.floor(400,0,200,380,'floor_rect_pattern1');
		factory.construct.floor(600,0,200,600,'floor_rect_pattern3');
		
		factory.layer = 'game';
		factory.construct.wall(5,0,'h',800);
		factory.construct.wall(5,355,'h',270);
		factory.construct.wall(330,355,'h',270);
		factory.construct.wall(0,575,'h',800);

		factory.construct.wall(0,0,'v',580);
		factory.construct.wall(200,5,'v',100);
		factory.construct.wall(200,160,'v',200);
		factory.construct.wall(400,5,'v',100);
		factory.construct.wall(400,160,'v',200);
		factory.construct.wall(600,0,'v',450);	
		factory.construct.wall(600,505,'v',75);
		factory.construct.wall(795,0,'v',580);
		
		//factory.interior.door(275,355,'sliding_hor');
		//factory.interior.door(200,105,'sliding_ver');	
		/*factory.construct.door(275,355,'hinged_hor');
		factory.construct.door(200,105,'sliding_ver');
		factory.construct.door(400,105,'sliding_ver');
		factory.construct.door(600,450,'sliding_ver');*/
		//return;
		//room1
		createWorkplace(10, 32);
		createWorkplace(74, 32);
		createWorkplace(137, 32);
		createWorkplace(13, 200);
		createWorkplace(137, 200);
		createWorkplace(13, 290);
		createWorkplace(137, 290);		
		
		//room2
		factory.interior.seat.couch(270,5);		
		factory.interior.seat.chair.big_red(205,40,'right');
		var small_table = factory.interior.table.small_brown(285,55);		
		var flower = factory.interior.plants.flower(300,80);
		small_table.surface.put(flower);
		factory.interior.seat.chair.big_red(370,40,'left');
		
		factory.interior.seat.chair.big_red(30,360,'front');
		var small_table = factory.interior.table.small_brown(80,380);
		var flower = factory.interior.plants.flower(95,405);
		small_table.surface.put(flower);
		factory.interior.seat.chair.big_red(120,360,'front');		

		factory.interior.plants.cactus(220,340,'0');
		factory.interior.plants.cactus(385,340,'1');		

		//room3
		createDinnerТable(445, 180, 'green');
		createDinnerТable(445, 240, 'yellow');
		createDinnerТable(445, 300, 'green');

		createDinnerТable(530, 180, 'yellow');
		createDinnerТable(530, 240, 'green');		
		createDinnerТable(530, 300, 'yellow');

		factory.enemy.mimic_chair(540,380);		
		var small_table = factory.interior.table.small_brown(480,380);
		var flower = factory.interior.plants.flower(495,405);
		small_table.surface.put(flower);
		factory.interior.seat.chair.big_red(430,360,'front');	
		factory.enemy.crab(300,250);
		factory.enemy.crab(150,550);
		factory.enemy.crab(450,550);
	}	

	function createWorkplace(x, y) {
		var dx = parseInt(-2 + 4*Math.random());
		var dy = parseInt(-2 + 4*Math.random());
		var dy2 = 10;

		var table = factory.interior.table.office_brown_horizontal(x,y);		

		var pc = factory.interior.equipment.pc(x+47+dx, y-13+dy+dy2);
		var monitor = factory.interior.equipment.monitor(x+5+dx, y-20+dy+ dy2);	
		var keyboard = factory.interior.equipment.keyboard(x+7+dy, y+7+ dy2);	
		factory.interior.seat.chair.swivel_office_blue(x+24+dy*2, y+25+ dy2);		

		table.surface.put(pc, monitor, keyboard);
	}

	function createDinnerТable(x, y, type) {
		factory.interior.table.dining_white_vertical(x,y);
		factory.interior.seat.stool.dining (x-15,y+15,'green',2); 
		factory.interior.seat.stool.dining (x-15,y-5,'green',2); 
		factory.interior.seat.stool.dining (x+30,y+15,'green',4); 
		factory.interior.seat.stool.dining (x+30,y-5,'green',4);
	}
}

