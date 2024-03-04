function appStart() {
	app.scene2d.visible = true;
	document.getElementById('main').style.visibility = "visible";
	document.getElementById('progress').style.display = "none";

	let stateMachine = new StateMachine();
	let followState = new CameraFollowState({camera: app.camera3d, target: app.obj3d.player, offset: new THREE.Vector3(-2.5, 2.5, 0)});	
	stateMachine.add(followState);
	stateMachine.set(CameraFollowState);

	app.camera3d.followState = followState;
	app.camera3d.stateMachine = stateMachine;
	app.update.push(stateMachine.update);	
		
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
		app.stateGame = 'game';
		
		if(!app.isActive) {
			app.isActive = true;
			Howler.mute(!app.isSounds);	
		}

		playSound("sBg", true, 0.4);
		fadeSound("sBg", 0, assets.sounds["sBg"].volume(), 1000);

		gsap.to(app.obj2d.helper, 0.5, {alpha: 0});
		gsap.to(app.obj2d.progressbar, 0.5, {alpha: 1, delay: 0.5});
		gsap.killTweensOf(app.obj2d.helper.scale);

		//playSound("sCity", true);
		//fadeSound("sCity", 0, assets.sounds["sCity"].volume(), 1000);
		
		app.obj2d.downloadBtn.visible = true;
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
	if (app.stateGame != 'game_end') {
		app.stateGame = 'game_end';
		
		/*marker_endgame@start*/
		/*marker_endgame@end*/				
				
		if(params.fullscreenCta.value){
			gsap.set(app.obj2d.fsCTA, {delay:1.0, overwrite: "none", visible:true});
		}
	}
}
