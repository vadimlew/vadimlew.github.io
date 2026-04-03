//---------------------------------------------------------------------------------
//- Resize

function appResize(e) {
	app.mainWidth = window.innerWidth;
	app.mainHeight = window.innerHeight;
	app.canvasWidth = Math.ceil(app.scaleFactor * window.innerWidth);
	app.canvasHeight = Math.ceil(app.scaleFactor * window.innerHeight);

	//- 2D canvas
	app.canvas2d.style.width = app.mainWidth + "px";
	app.canvas2d.style.height = app.mainHeight + "px";
	app.canvas2d.width = app.canvasWidth;
	app.canvas2d.height = app.canvasHeight;

	app.renderer2d.resize(app.canvasWidth, app.canvasHeight);
	app.scene2d.position.set(Math.ceil(app.canvasWidth * 0.5), Math.ceil(app.canvasHeight * 0.5));	

	//- 3D canvas
	app.camera3d.aspect = window.innerWidth / window.innerHeight;
	app.renderer3d.setSize(app.scaleFactor * window.innerWidth, app.scaleFactor * window.innerHeight);

	app.canvas3d.style.width = app.mainWidth + "px";
	app.canvas3d.style.height = app.mainHeight + "px";
	app.canvas3d.width = app.scaleFactor * window.innerWidth;
	app.canvas3d.height = app.scaleFactor * window.innerHeight;	
	
	app.obj2d.ui.scale.set(1, 1);

	app.obj2d.clickArea.hitArea.x = -app.canvasWidth / 2;
	app.obj2d.clickArea.hitArea.y = -app.canvasHeight / 2;
	app.obj2d.clickArea.hitArea.width = app.canvasWidth;
	app.obj2d.clickArea.hitArea.height = app.canvasHeight;

	let leftUi, rightUI, upUI, downUI;

	if (app.mainWidth < app.mainHeight) {	
		app.camera3d.isPortraite = true;

		app.obj2d.ui.scale.set(app.canvasWidth / 720);		

		if (app.obj2d.ui.scale.y * 1280 > app.canvasHeight) {
			app.obj2d.ui.scale.set(app.canvasHeight / 1280);
		}			

		leftUi = -app.canvasWidth * 0.5 / app.obj2d.ui.scale.x;
		rightUI = app.canvasWidth * 0.5 / app.obj2d.ui.scale.x;
		upUI = -app.canvasHeight * 0.5 / app.obj2d.ui.scale.y;
		downUI = app.canvasHeight * 0.5 / app.obj2d.ui.scale.y;

		app.obj2d.downloadBtn.x = 0;
		app.obj2d.downloadBtn.y = downUI - 100;
		app.obj2d.downloadBtn.scale.set(1);

		app.obj2d.soundBtn.x = 60 - app.canvasWidth * 0.5 / app.obj2d.ui.scale.y;
		app.obj2d.soundBtn.y = -60 + app.canvasHeight * 0.5 / app.obj2d.ui.scale.y;
		app.obj2d.soundBtn.scale.set(0.5);	
		
		if (app.stateGame == 'loaded') {
			app.obj2d.joystick.position.set(0, 320);
		}		

		app.obj2d.failScreen.setPortraite(leftUi, rightUI, upUI, downUI);
		app.obj2d.winScreen.setPortraite(leftUi, rightUI, upUI, downUI);

		app.obj2d.helper.x = 0;
		app.obj2d.helper.y = upUI + 90;

		app.obj2d.eatFastFood.x = 0;
		app.obj2d.eatFastFood.y = -250;		
		
		app.camera3d.fov = 60;		
		app.camera3d.updateProjectionMatrix();
	} else {		
		app.camera3d.isPortraite = false;

		app.obj2d.ui.scale.set(app.canvasWidth / 1280);		

		if (app.obj2d.ui.scale.y * 720 > app.canvasHeight) {
			app.obj2d.ui.scale.set(app.canvasHeight / 720);
		}		
		
		leftUi = -app.canvasWidth * 0.5 / app.obj2d.ui.scale.x;
		rightUI = app.canvasWidth * 0.5 / app.obj2d.ui.scale.x;
		upUI = -app.canvasHeight * 0.5 / app.obj2d.ui.scale.y;
		downUI = app.canvasHeight * 0.5 / app.obj2d.ui.scale.y;
		
		app.obj2d.downloadBtn.x = rightUI - 170;
		app.obj2d.downloadBtn.y = downUI - 80;
		app.obj2d.downloadBtn.scale.set(0.9);

		app.obj2d.soundBtn.x = 60 - app.canvasWidth * 0.5 / app.obj2d.ui.scale.y;
		app.obj2d.soundBtn.y = -60 + app.canvasHeight * 0.5 / app.obj2d.ui.scale.y;
		app.obj2d.soundBtn.scale.set(0.55);	

		if (app.stateGame == 'loaded') {
			app.obj2d.joystick.position.set(leftUi + 300, downUI - 170);
		}	

		app.obj2d.failScreen.setLandscape(leftUi, rightUI, upUI, downUI);
		app.obj2d.winScreen.setLandscape(leftUi, rightUI, upUI, downUI);

		app.obj2d.helper.x = 0;
		app.obj2d.helper.y = upUI + 90;

		app.obj2d.eatFastFood.x = 0;
		app.obj2d.eatFastFood.y = -200;		
		
		app.camera3d.fov = 45;		
		app.camera3d.updateProjectionMatrix();
	}	

	app.obj2d.fsCTA.scale.x = 0.1 + app.canvasWidth / 1280 / app.obj2d.ui.scale.x;
	app.obj2d.fsCTA.scale.y = 0.1 + app.canvasHeight / 1280 / app.obj2d.ui.scale.x;	

	app.obj2d.leaderBoard.x = rightUI;
	app.obj2d.leaderBoard.y = upUI;
}