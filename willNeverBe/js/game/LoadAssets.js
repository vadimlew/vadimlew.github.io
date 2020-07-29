function loadAssets(pixi, onComplete) {
	var loader = PIXI.Loader.shared;
	
	var preloadScreen = PIXI.Sprite.from('assets/preload/preload.png');
	pixi.stage.addChild(preloadScreen);

	var bar = new PIXI.Graphics();
	bar.beginFill(0xb44346);
	bar.drawRect(0, 0, 249, 24);
	bar.x = 501;
	bar.y = 551;
	bar.scale.x = 0;
	preloadScreen.addChild(bar);

	//>>>>> PLAYER
	loadAnimation('player_walk_back', 'assets/player/player_walk_back_', 6);       
	loadAnimation('player_walk_front', 'assets/player/player_walk_front_', 6);        
	loadAnimation('player_jump_front', 'assets/player/player_jump_front_', 9); 
	loadAnimation('player_jump_back', 'assets/player/player_jump_back_', 9);
	loadAnimation('player_jump_front_side', 'assets/player/player_jump_front_side_', 9);        
	loadAnimation('player_jump_back_side', 'assets/player/player_jump_back_side_', 9);

	//>>>>> ENEMY       
	loadAnimation('enemy_crab_walk', 'assets/enemy/enemy_robot_crab_walk_', 6);       
	loadAnimation('enemy_robot_chair_show', 'assets/enemy/mimic/enemy_robot_chair_show_', 8);       
	loadAnimation('enemy_robot_chair_walk', 'assets/enemy/mimic/enemy_robot_chair_walk_', 8);
	loader.add('enemy_robot_chair_head_front.png', 'assets/enemy/mimic/enemy_robot_chair_head_front.png');
	loader.add('enemy_robot_chair_head_right.png', 'assets/enemy/mimic/enemy_robot_chair_head_right.png');
	loader.add('enemy_robot_chair_head_left.png', 'assets/enemy/mimic/enemy_robot_chair_head_left.png');
	loader.add('enemy_robot_chair_arm_right.png', 'assets/enemy/mimic/arm_right.png');
	loader.add('enemy_robot_chair_arm_left.png', 'assets/enemy/mimic/arm_left.png');

    //>>>>> GUN
    loader.add('pistol.png', 'assets/gun/pistol.png');
    loader.add('yoyo.png', 'assets/gun/yoyo.png');
    loader.add('stapler.png', 'assets/gun/stapler.png');

	//>>>>> INTERIER

    //tables
    loader.add('office_brown_horizontal_table.png', 'assets/interior/table/office_brown_horizontal_table.png');
    loader.add('dining_white_horizontal_table.png', 'assets/interior/table/dining_white_horizontal_table.png');
    loader.add('dining_white_vertical_table.png', 'assets/interior/table/dining_white_vertical_table.png');
    loader.add('small_brown_table.png', 'assets/interior/table/small_brown_table.png');

    loader.add('flower.png', 'assets/stuff/flower.png');
    loader.add('comp.png', 'assets/stuff/comp.png');
    loader.add('keyboard.png', 'assets/stuff/keyboard.png');
    loader.add('cactus.png', 'assets/stuff/cactus.png');
    loader.add('cactus2.png', 'assets/stuff/cactus2.png');
    loader.add('couch.png', 'assets/stuff/couch.png');
    loader.add('chair_red_front.png', 'assets/stuff/chair_red_front.png');
    loader.add('chair_red_right.png', 'assets/stuff/chair_red_right.png');
    loader.add('chair_red_left.png', 'assets/stuff/chair_red_left.png');   
    
    loader.add('dining_stool_red1.png', 'assets/stuff/dining_stool_red1.png');
    loader.add('dining_stool_red2.png', 'assets/stuff/dining_stool_red2.png');
    loader.add('dining_stool_red3.png', 'assets/stuff/dining_stool_red3.png');
    loader.add('dining_stool_red4.png', 'assets/stuff/dining_stool_red4.png');
    loader.add('dining_stool_green1.png', 'assets/stuff/dining_stool_green1.png');
    loader.add('dining_stool_green2.png', 'assets/stuff/dining_stool_green2.png');
    loader.add('dining_stool_green3.png', 'assets/stuff/dining_stool_green3.png');
    loader.add('dining_stool_green4.png', 'assets/stuff/dining_stool_green4.png');
    loader.add('dining_stool_yellow1.png', 'assets/stuff/dining_stool_yellow1.png');
    loader.add('dining_stool_yellow2.png', 'assets/stuff/dining_stool_yellow2.png');
    loader.add('dining_stool_yellow3.png', 'assets/stuff/dining_stool_yellow3.png');
    loader.add('dining_stool_yellow4.png', 'assets/stuff/dining_stool_yellow4.png');      

    loader.add('floor_rect_pattern1', 'assets/construct/floor/rect_pattern.png');
    loader.add('floor_rect_pattern2', 'assets/construct/floor/rect_pattern2.png');
    loader.add('floor_rect_pattern3', 'assets/construct/floor/rect_pattern3.png');

    loadAnimation('chair_red_spin', 'assets/stuff/chair_', 4);
    loadAnimation('chair_dark_spin', 'assets/stuff/chair_dark_spin_', 4);
    loadAnimation('monitor_blink', 'assets/stuff/monitor_', 2);
    loadAnimation('door_sliding_horizontal', 'assets/construct/doors/door_sliding_horizontal_', 4);
    loadAnimation('door_sliding_vertical', 'assets/construct/doors/door_sliding_vertical_', 4);
    loadAnimation('door_hinged_horizontal', 'assets/construct/doors/door_hinged_horizontal_', 7);
    loadAnimation('door_hinged_vertical', 'assets/construct/doors/door_hinged_vertical_', 7);

    loader.onProgress.add(function(param) {
      	bar.scale.x = param.progress/100;        
    });  

    function loadComplete() {
        pixi.stage.removeChild(preloadScreen);
        onComplete();
    }

    loader.load(loadComplete);

    function loadAnimation(idName, file, len) {
       	for (var i = 0; i < len; i++) {
       		loader.add(idName+i, file + i +'.png');
       	}
    }
}
