//---------------------------------------------------------------------------------
//- ENTER FRAME

app.enterFrame = function () {
	app.animations.forEach(anim => anim.update(app.animSpeed));
	app.update.forEach(update => update());		
	app.phys.update();
	app.update2.forEach(update => update());	
	
	let hero = app.obj3d.hero;

	app.camera3d.posTo.copy(hero.position);
	app.camera3d.lookTo.copy(hero.position);

	if (app.stateGame === 'loaded') {		
		app.camera3d.posTo.y += 25 //- 10;
		app.camera3d.posTo.z += 10 //- 5;
		if (!app.camera3d.isPortraite) {
			app.camera3d.lookTo.z -= 5;
		}
	}
	
	if (app.stateGame == 'game' || app.stateGame == 'win') {		
		app.camera3d.posTo.y += 20 //- 10;
		app.camera3d.posTo.z += 10 //- 5;
	} 

	if (app.stateGame == 'fail') {		
		app.camera3d.posTo.y += 20 ;
		app.camera3d.posTo.x -= 10 * Math.sin(app.camera3d.angle);
		app.camera3d.posTo.z += 10 * Math.cos(app.camera3d.angle);
		app.camera3d.angle += 0.01;
	} 
	
	app.camera3d.position.lerp(app.camera3d.posTo, 0.15);
	app.camera3d.lookNow.lerp(app.camera3d.lookTo, 0.15);
	app.camera3d.lookAt(app.camera3d.lookNow);

	//app.controls.update(1/4);	
}