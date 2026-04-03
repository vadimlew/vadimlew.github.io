//---------------------------------------------------------------------------------
//- ENTER FRAME

app.enterFrame = function () {
	app.animations.forEach(anim => anim.update(app.animSpeed));
	app.update.forEach(update => update());	

	let hero = app.obj3d.hero;
	hero.speed += (hero.toSpeed - hero.speed) / 2;
	if (hero.speed < 0.001) hero.speed = 0;

	if (app.stateGame === 'game') {
		app.camera3d.posTo.set( hero.position.x - 0.6 - hero.speed*12, hero.position.y + 0.8 + hero.speed*12, hero.position.z );		
		app.camera3d.lookTo.copy( hero.position );

		app.camera3d.position.lerp(app.camera3d.posTo, 0.15);
		app.camera3d.lookNow.lerp(app.camera3d.lookTo, 0.15);	
		app.camera3d.lookAt(app.camera3d.lookNow);	
	}	

	app.obj3d.main.position.x *= 0.95;
	app.obj3d.main.position.y *= 0.95; 
	app.obj3d.main.position.z *= 0.95;	
}