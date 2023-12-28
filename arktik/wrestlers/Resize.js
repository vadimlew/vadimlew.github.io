//---------------------------------------------------------------------------------
//- Resize

app.resize = function(e) {
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
	
	app.obj2d.main.scale.set(1, 1);

	let isPortraite = app.mainWidth < app.mainHeight;

	app.obj2d.main.scale.set(isPortraite? app.canvasWidth / 720 : app.canvasWidth / 1280);

	if (isPortraite && app.obj2d.main.scale.y * 1280 > app.canvasHeight) {
		app.obj2d.main.scale.set(app.canvasHeight / 1280);
	}

	if (!isPortraite && app.obj2d.main.scale.y * 720 > app.canvasHeight) {
		app.obj2d.main.scale.set(app.canvasHeight / 720);
	}	

	let leftUI = -app.canvasWidth * 0.5 / app.obj2d.main.scale.x;
	let	rightUI = app.canvasWidth * 0.5 / app.obj2d.main.scale.x;
	let	upUI = -app.canvasHeight * 0.5 / app.obj2d.main.scale.y;
	let	downUI = app.canvasHeight * 0.5 / app.obj2d.main.scale.y;	

	if (isPortraite) {
		app.obj2d.soundBtn.x = leftUI + 40;
		app.obj2d.soundBtn.y = downUI - 60;
		app.obj2d.soundBtn.scale.set(0.5);
		
	} else {
		app.obj2d.soundBtn.x = 60 - app.canvasWidth * 0.5 / app.obj2d.main.scale.y;
		app.obj2d.soundBtn.y = -60 + app.canvasHeight * 0.5 / app.obj2d.main.scale.y;
		app.obj2d.soundBtn.scale.set(0.55);

	};

	app.resizes.forEach( resize => resize({ isPortraite, leftUI, rightUI, upUI, downUI }));
};
