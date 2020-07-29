js.include('lev.Lev');
js.include('game.Factory');
js.include('game.LoadAssets');
js.include('game.GameEngine');
js.include('game.Camera');
js.include('game.LevelGenerator');

function Game(width=800, height=600) {	
	var pixi = new PIXI.Application({  width:width, height:height, antialias: true, backgroundColor: 0x111111 });
	pixi.ticker.autoStart = false;

	var factory = new Factory();	
	var input = new LEV.managers.InputManager(pixi);
	var display = new LEV.managers.DisplayManager(pixi, {layers:['floor', 'garbage', 'game', 'debug']});	
	var phys = new LEV.physics.VerletPhysics();	
	var gameEngine = new LEV.game.Engine(pixi);	
	//var level = new LevelCreator(pixi);
	var level = new LevelGenerator();
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
		gameEngine.init();

		pixi.ticker.add(phys.update);
		pixi.ticker.add(display.update);		
		pixi.ticker.start();		
		
		initPlayer();
		createLevel();
		camera = new Camera(display.root, 0, 0, 800, 600);
		camera.followTo(player.display);

		//display.root.x = 150;
	}

	function initPlayer() {
		factory.layer = 'game';
		player = factory.player.designer(100+400-200,150);		
	}

	function createLevel() {		
        //level.create(20, player);
        //factory.room.workplace(100, 320);
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
		factory.room.workplace(10, 32);
		factory.room.workplace(74, 32);
		factory.room.workplace(137, 32);
		factory.room.workplace(13, 200);
		factory.room.workplace(137, 200);
		factory.room.workplace(13, 290);
		factory.room.workplace(137, 290);		
		
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
		factory.room.kitchen.dinnerТable(445, 180, 'green');
		factory.room.kitchen.dinnerТable(445, 240, 'yellow');
		factory.room.kitchen.dinnerТable(445, 300, 'green');

		factory.room.kitchen.dinnerТable(530, 180, 'yellow');
		factory.room.kitchen.dinnerТable(530, 240, 'green');		
		factory.room.kitchen.dinnerТable(530, 300, 'yellow');

		factory.enemy.mimic_chair(540,380);		
		var small_table = factory.interior.table.small_brown(480,380);
		var flower = factory.interior.plants.flower(495,405);
		small_table.surface.put(flower);
		factory.interior.seat.chair.big_red(430,360,'front');	
		factory.enemy.crab(300,250);
		factory.enemy.crab(150,550);
		factory.enemy.crab(450,550);
	}	
}

