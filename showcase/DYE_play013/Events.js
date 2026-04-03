function appStart() {
	app.scene2d.visible = true;
	document.getElementById('main').style.visibility = "visible";
	document.getElementById('progress').style.display = "none";

	app.obj2d.choiceScreen.on('iconChoiced', onColorChoiced);
		
	/*marker_init@start*/
	/*marker_init@end*/		
}


function stageDown(e) {
	app.mouse.isDown = true;		

	if (app.isPause) {
		app.isPause = false;
		try{ gsap.globalTimeline.resume() }catch(e){}
	}
	
	if (app.stateGame == 'loaded') {
		app.stateGame = 'started';

		if(!app.isActive) {
			app.isActive = true;
			Howler.mute(!app.isSounds);
		}	

		playSound("music", true, 0.4);
		fadeSound("music", 0, assets.sounds["music"].volume(), 1000);
	}
			
	if (app.stateGame == 'colorChoised') {
		app.stateGame = 'game';

		startGame();
	}		
}


function stageMove(e) {	
	
}


function stageUp(e) {	
	app.mouse.isDown = false;
}

function onColorChoiced( colorIndex ) {
	app.stateGame = 'colorChoised';
	app.obj2d.ui.addChildAt(app.obj2d.joystick, 0);
	
	//app.obj2d.downloadBtn.visible = true;
	//gsap.to( app.obj2d.downloadBtn, 0.5, {alpha: 1} );

	setColorForCharacter( app.obj3d.hero, colorIndex );	

	app.enemies.forEach( (enemy) => {		
		setColorForCharacter( enemy, 0 );	
	});
}

function startGame() {
	app.obj3d.hero.lifeBarUI.show();
	for (let enemy of app.enemies) {
		enemy.lifeBarUI.show();
	}

	//app.obj2d.downloadBtn.visible = true;
	//gsap.to( app.obj2d.downloadBtn, 0.5, {alpha: 1} );

	app.obj2d.killAllText.hide();
	app.obj2d.timeBar.show();
	app.update.push( enemyAI );
}

function winGame() {
	appEndGame();

	app.obj2d.timeBar.hide();

	let idx1 = app.update.indexOf( app.phys.update );
	if (idx1 != -1) app.update.splice( idx1, 1 );

	let idx2 = app.update.indexOf( enemyAI );
	if (idx2 != -1) app.update.splice( idx2, 1 );

	app.obj2d.blind.show( () => {
		showSecondIsland();
		app.obj2d.blind.hide();
	});
}

function timeOut() {
	playSound('fail');
	
	app.obj3d.hero.die();
	app.obj3d.hero.visible = true;

	while (app.enemies.length > 0) {
		let enemy = app.enemies[0];
		enemy.die();
		enemy.visible = true;		
	}

	winGame();
}

function showSecondIsland() {
	let hero = app.obj3d.hero;

	app.obj3d.world.ground.visible = false;
	app.obj3d.world.ground2.visible = true;	

	app.camera3d.posTo.set( hero.position.x - 0.6, hero.position.y + 1.0, hero.position.z );		
	app.camera3d.lookTo.copy( hero.position );
	app.camera3d.lookTo.x += 0.2;

	app.camera3d.position.copy(app.camera3d.posTo);
	app.camera3d.lookNow.copy(app.camera3d.lookTo);
	app.camera3d.lookAt(app.camera3d.lookNow);	

	hero.visible = true;
	hero.rotation.y = Math.PI/2;
	hero.position.set( -0.5, -0.1, 0);

	hero.anim.set('Idle');

	app.obj2d.fakeJoystick.visible = true;

	app.obj2d.killAllText.show();

	for (let i=0; i < 3; i++) {
		let enemy = app.obj3d.main.getObjectByName('enemy' + i);
		enemy.visible = true;
		enemy.position.copy( enemy.startPosition );
		enemy.rotation.y = enemy.startPosition.rotation;
		enemy.anim.set('Idle');
	}
}

//---------------------------------------------------------------------------------
//- clickAd

function clickAd() {
	/*marker_click@start*/
	
	try{
		if((/iphone|ipad|ipod/i).test(window.navigator.userAgent.toLowerCase())) {						
			window.open( params.linkIOS.value );
		}else{
			window.open( params.linkAndroid.value );
		}
	}catch(e){}
	
	/*marker_click@end*/
}

//-----------------------------------------------------

function appEndGame() {
	if (app.stateGame != 'game_end') {
		app.stateGame = 'game_end';
		
		/*marker_endgame@start*/
		/*marker_endgame@end*/				
				
		if(params.fullscreenCta.value){
			gsap.set(app.obj2d.fsCTA, {delay:1.0, overwrite: "none", visible:true});
		}
	}
}
