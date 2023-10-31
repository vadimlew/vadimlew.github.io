function appStart() {
	app.scene2d.visible = true;
	document.getElementById('main').style.visibility = "visible";
	document.getElementById('progress').style.display = "none";	
		
	/*marker_init@start*/
	/*marker_init@end*/		
}


function stageDown(e) {
	if (app.isPause) {
		app.isPause = false;
		try{ gsap.globalTimeline.resume() }catch(e){}
	}
	
	if (app.stateGame == Application.STATES.LOADED) {
		app.stateGame = Application.STATES.START;

		if(!app.isActive) {
			app.isActive = true;
			Howler.mute(!app.isSounds);
		}	

		playSound("music", true, 0.4);
		fadeSound("music", 0, 0.5, 1000);		
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
	if (app.stateGame != Application.STATES.END) {
		app.stateGame = Application.STATES.END;		
		
		/*marker_endgame@start*/
		/*marker_endgame@end*/				
				
		if(params.fullscreenCta.value){
			gsap.set(app.obj2d.fsCTA.display, {delay:1.0, overwrite: "none", visible:true});
		}
	}
}
