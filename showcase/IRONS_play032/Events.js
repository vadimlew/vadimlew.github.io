function appStart() {
	app.scene2d.visible = true;
	document.getElementById('main').style.visibility = "visible";
	document.getElementById('progress').style.display = "none";	

	app.obj3d.followCamera = new FollowCameraHelper( app.camera3d, app.obj3d.podium, [0, 2.8, 5], [0, 0.7, 0] );
	new PlayableController();
	app.obj2d.chooseArmorText.show();
		
	/*marker_init@start*/
	/*marker_init@end*/		
}


function stageDown(e) {
	app.mouse.isDown = true;		

	if (app.isPause) {
		app.isPause = false;
		try{ gsap.globalTimeline.resume() }catch(e){}
	}
	
	if (app.stateGame == app.states.LOADED) {
		app.stateGame = app.states.DRESS;

		if(!app.isActive) {
			app.isActive = true;
			Howler.mute(!app.isSounds);
		}	

		playSound("lobby_song", true);
		fadeSound("lobby_song", 0, assets.sounds["lobby_song"].volume(), 1000);	
		
		app.obj2d.chooseArmorText.hide();
	}

	if (app.stateGame == app.states.DRESS) {
		app.mouse.x = (e.client.x / window.innerWidth)*2 - 1;
		app.mouse.y = -(e.client.y / window.innerHeight)*2 + 1;	

		app.raycaster.setFromCamera(app.mouse, app.camera3d);
		app.intersects.length = 0;
		app.raycaster.intersectObjects(app.upgradeClickObjects, true, app.intersects);		
		if (app.intersects.length > 0) {
			app.events.emit( app.events.PART_CLICK, app.intersects[0].object );	
		}		
	}

	if (app.stateGame === app.states.FIGHT) {
		app.obj2d.tutorialJoystick.display.visible = false;
	}
}

function stageMove(e) {	
	
}

function stageUp(e) {	
	app.mouse.isDown = false;
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
	if (app.stateGame != app.states.END) {
		app.stateGame = app.states.END;
		
		/*marker_endgame@start*/
		/*marker_endgame@end*/				
				
		if(params.fullscreenCta.value){
			gsap.set(app.obj2d.fsCTA, {delay:1.0, overwrite: "none", visible:true});
		}
	}
}
