function appStart() {
	app.scene2d.visible = true;
	document.getElementById('main').style.visibility = "visible";
	document.getElementById('progress').style.display = "none";
			
	/*marker_init@start*/
	/*marker_init@end*/		

	gsap.delayedCall(7, failGame);
	
	//appEndGame();
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

		playSound('sBg', true);
		fadeSound('sBg', 0, 0.5, 1000);

		startFood(40);
		startGame();	

		gsap.killTweensOf(failGame);
	}
}


function startGame() {
	gsap.to(app.obj2d.helper, 0.25, { alpha: 0 });
	gsap.to(app.obj2d.eatFastFood, 0.25, { alpha: 1, delay: 0.25 });
	gsap.to(app.obj2d.eatFastFood, 0.25, { alpha: 0, delay: 2 });

	gsap.delayedCall(0.25, app.obj2d.leaderBoard.show);

	app.enemies.forEach(enemy => enemy.speed = 0.15);

	app.update.push(enemyAI);
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
	//if (app.stateGame != 'game_end') {
		//app.stateGame = 'game_end';
		
		/*marker_endgame@start*/
		/*marker_endgame@end*/				
				
		if(params.fullscreenCta.value){
			gsap.set(app.obj2d.fsCTA, {delay:1.0, visible:true});
		}
	//}
}
