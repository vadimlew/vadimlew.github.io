js.include('lev.collision.2d.shape.Shape');

function ShapeTest(pixi) {	
	var display = new PIXI.Graphics();
	pixi.stage.addChild(display);

	var ox = 100;
	var oy = 200;

	console.log('___________________________________< ShapeTest >_____________________________________');
	var shape1 = LEV.shapes.Shape.fromArray([-15,-15,10,10, 15,-15,10,10, 15,15,10,10, -15,15,10,10]);
	var shape2 = LEV.shapes.Shape.fromArray([-5,-5,10,10, 3,6,7,14]);
	console.log('shape1: ', shape1);
	console.log('shape2: ', shape2);	
	shape1.x = 0;
	shape1.y = 0;
	shape2.x = 20;
	shape2.y = -2;
	drawShape(shape1, 0x000099);
	drawShape(shape2, 0x009900);
	console.log('shape1 intersect shape2: ', shape1.isIntersect(shape2));
	console.log('shape2 intersect shape1: ', shape2.isIntersect(shape1));

	var resolveObj = new ResolveObject();
	var shape3 = LEV.shapes.Shape.fromArray([-10,-10,20,20]);
	var shape4 = LEV.shapes.Shape.fromArray([-2.5,-5,30,10]);
	
	ox += 100;
	resetPositions();
	drawShape(shape3, 0x000099);
	drawShape(shape4, 0x009900);
	
	console.log('shape3 collision shape4: ', shape3.collision(shape4, resolveObj), resolveObj);
	ox += 100;	
	shape4.x += resolveObj.dx;	
	drawShape(shape3, 0x000099);
	drawShape(shape4, 0x009900);

	resetPositions();
	console.log('shape4 collision shape3: ', shape4.collision(shape3, resolveObj), resolveObj);
	ox += 100;
	shape3.x += resolveObj.dx;	
	drawShape(shape3, 0x000099);
	drawShape(shape4, 0x009900);

	ox = 200;
	oy += 100;	
	resetPositions();	
	drawShape(shape3, 0x000099);
	drawShape(shape4, 0x009900);
	
	shape3.collision(shape4, resolveObj);
	ox += 100;	
	shape4.y += resolveObj.dy;	
	drawShape(shape3, 0x000099);
	drawShape(shape4, 0x009900);

	resetPositions();	
	shape4.collision(shape3, resolveObj);
	ox += 100;
	shape3.y += resolveObj.dy;	
	drawShape(shape3, 0x000099);
	drawShape(shape4, 0x009900);	
	console.log('_____________________________________________________________________________________________');

	function ResolveObject() {
		this.dx = 0;
		this.dy = 0;		

		this.reset = function() {
			this.dx = 0;
			this.dy = 0;			
		}

		this.solve = function(dx, dy, widthA, heightA, widthB, heightB) {
			var dx1 = widthA - dx;
			var dx2 = widthB + dx;
			var dy1 = heightA - dy;
			var dy2 = heightB + dy;			
			dx = dx1 < dx2? dx1 : -dx2;
			dy = dy1 < dy2? dy1 : -dy2;			

			if (Math.abs(dx) < Math.abs(dy)) {
				this.dx += dx;
			} else {
				this.dy += dy;
			}
		}
	}

	function resetPositions() {
		shape3.x = 0;
		shape3.y = 0;
		shape4.x = -20;
		shape4.y = -2;
	}

	function drawShape(shape, color=0x000000) {	
		//origin
		display.lineStyle(1, 0xff0000);
		display.drawRect(ox-1,oy-1,2,2);
		pixi.stage.addChild(display);

		//shape
		display.lineStyle(1, color);		
		for (var i = 0; i < shape.rects.length; i++) {				
			var rect = shape.rects[i];
			display.drawRect(ox + shape.x + rect.x, oy + shape.y + rect.y, rect.width, rect.height);
		}		
	}
}