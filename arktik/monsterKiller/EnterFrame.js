//---------------------------------------------------------------------------------
//- ENTER FRAME

app.enterFrame = function () {
	app.animations.forEach(anim => anim.update(app.animSpeed));
	app.update.forEach(update => update());	
}