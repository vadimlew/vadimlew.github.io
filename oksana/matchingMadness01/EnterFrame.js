//---------------------------------------------------------------------------------
//- ENTER FRAME

app.enterFrame = function () {	
	app.update.forEach(update => update());	
}