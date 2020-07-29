function LevelGenerator() {	
	const cell = 128;	

	const plans = [
		[0,0,1,0],
		[0,0,1,0,0,1,1,1],
		[0,0,1,0,2,0],
		[0,0,1,0,2,0,0,1,1,1,2,1,0,2,1,2,2,2],
		[0,0],
		[0,0,0,1,1,1],
		[0,0,1,0,1,1],
		[0,0,1,0,0,-1],
		[0,0,1,0,-1,0,0,1,0,-1],
		[0,0,1,0,2,0,3,0],
		[0,0,0,1],
		[0,0,0,1,0,2],
		[0,0,1,0,2,0,3,0,4,0,2,1,2,-1],
		[0,0,0,1,0,2,0,3],
		[0,0,1,0,2,0,0,1,2,1,0,2,1,2,2,2]
	]

	var currentLevel;

	this.create = create;

	function create(num_rooms, player) {
		createWalls(num_rooms);

		/*var room = new Room(plans[3]);
		room.move(1,1);
		room.generateWalls();
		drawWallsAndFloor(room.walls, [room]);*/
	}

	function createWalls(num_rooms) {
		var rooms = [];
		var generated = [];		
		var walls = [];
		var count = 0;	

		addRoom();

		while(count < 1000 && !placeTogether(rooms[0])) {
			count++;
			generated.length = 0;
		}	

		for (var room of generated) {
			room.generateWalls();
			Array.prototype.push.apply(walls, room.walls);
		}		

		for (var w1 of walls) {			
			for (var w2 of walls) {
				if (w1 != w2 && w1.x == w2.x && w1.y == w2.y) {
					w1.isDoor = (w1.room.parent == w2.room || w2.room.parent == w1.room);
					walls.remove(w2);
				}
			}
		}		

		//debugDraw(walls);
		drawWallsAndFloor(walls, generated);

		function addRoom(room) {	
			if (rooms.length >= num_rooms) return;
			
			if (!room) {
				var room = new Room(plans.rand());
				//room.move(15,6);
				rooms.push(room);				
			}
			
			var num = 1+parseInt(3*Math.random());
			for (var i=0; i < num; i++) {
				var new_room = new Room(plans.rand());
				rooms.push(new_room);
				room.childs.push(new_room);
				new_room.parent = room;
			}		
			
			for (var child of room.childs) {
				addRoom(room.childs.rand());
			}		
		}

		function generateLinks(room) {
			var links = [];
			for (var a of room.anchors) {
				links.push(new PIXI.Point(a.x+1,a.y));
				links.push(new PIXI.Point(a.x-1,a.y));
				links.push(new PIXI.Point(a.x,a.y+1));
				links.push(new PIXI.Point(a.x,a.y-1));
			}	
			
			links.forEach(link1 => {
				links.forEach(link2 => {
					if (link1 != link2 && link1.x == link2.x && link1.y == link2.y) {
						links.remove(link1);
					}			
				})		
			})
			
			for (var i = 0; i < generated.length; i++) {			
				for (var a of generated[i].anchors) {
					for (var link of links) {
						if (link.x == a.x && link.y == a.y) {
							links.remove(link);
						}
					}			
				}
			}
			
			links.shuffle();

			return links;			
		}

		function placeTogether(room) {	
			if (generated.length == 0) generated.push(room);

			var links = generateLinks(room);			
			
			for (var child of room.childs) {					
				var link = links.next();	
				child.anchors.current = 0;
				
				do {			
					var anchor = child.anchors.next();		
					if (!anchor) {
						link = links.next();
						anchor = child.anchors.next(0);
					}
					if (!link) {
						trace('комната не смогла :)');
						//reset();
						return false;
					}
					var dx = link.x - anchor.x;
					var dy = link.y - anchor.y;	
					if (isNaN(dx) || isNaN(dy)) {
						trace('dx,dy', dx, dy);
						trace('link', link, link.x, link.y);
						trace('anchor', anchor, anchor.x, anchor.y);
					}
					child.move(dx,dy);
					var flag = hitTest(child);					
				} while(flag && link)		
								
				generated.push(child);
			}
			
			var succes_flag = true;	
			for (var child of room.childs) {
				if (!placeTogether(child)) succes_flag = false;	
			}
			return succes_flag;
		}

		function hitTest(room1) {
			for (var i = 0; i < generated.length; i++) {
				var room2 = generated[i];
				if (room1 == room2) continue;
				if (room1.hitTest(room2)) return true;
			}
			return false;
		}
	}

	function debugDraw(walls) {
		var layer = game.display.layer.create('rooms');
		var shape = new PIXI.Graphics();
		layer.addChild(shape);
		shape.lineStyle(2, 0xffffff, 0.5)

		for (var w of walls) {		
			shape.moveTo(w.x1, w.y1);
			shape.lineTo(w.x2, w.y2);				
			if (w.isDoor) shape.drawRect(w.x-2, w.y-2, 4, 4);
		}
	}

	function drawWallsAndFloor(walls, rooms) {
		game.factory.layer = 'floor';
		for (var room of rooms) {
			var pattern = 'floor_rect_pattern' + parseInt(1 + Math.random()*3);	
			for (var a of room.anchors) {	
				game.factory.construct.floor(a.x*cell-cell/2+5,a.y*cell-cell/2+25,cell,cell,pattern);
			}
		}

		game.factory.layer = 'game';
		for (var w of walls) {	
			var direction = w.x1 == w.x2? 'v':'h';
			var len = w.x2 - w.x1 + w.y2 - w.y1;
			if (direction == 'v') len += 10;	
			if (w.isDoor) {
				len = len/2 - 25;
				var dx = direction == 'h'? len + 50:0;
				var dy = direction == 'v'? len + 50:0;
				game.factory.construct.wall(w.x1, w.y1,direction, len);
				game.factory.construct.wall(w.x1+dx, w.y1+dy,direction, len);
			} else {
				game.factory.construct.wall(w.x1, w.y1,direction, len);
			}			
		}
	}
		
	function Room(plan) {
		var anchors = [];	
		var walls = [];
		for (var i=0; i < plan.length; i+=2) {
			var x = plan[i];
			var y = plan[i+1];
			anchors.push(new PIXI.Point(x,y));
		}	
		
		var self = this;
		this.childs = [];	
		this.anchors = anchors;	
		this.walls = walls;	
		this.hitTest = hitTest;
		this.generateWalls = generateWalls;
		this.move = move;
		this.parent;
		
		function move(dx,dy) {
			anchors.forEach(a => {	
				a.x += dx;
				a.y += dy;
			})			
		}	
				
		function hitTest(room) {
			var flag = false;		
			room.anchors.forEach(a1 => {
				anchors.forEach(a2 => {
					if (a1.x == a2.x && a1.y == a2.y) flag = true;
				})
			})		
			return flag;
		}

		function generateWalls() {
			var pool = [];
			var d = cell/2;			

			for (var a of anchors) {
				var x = a.x*cell;
				var y = a.y*cell;
				var p1 = new Wall(x-d, y, x-d, y-d, x-d, y+d);
				var p2 = new Wall(x+d, y, x+d, y-d, x+d, y+d);
				var p3 = new Wall(x, y-d, x-d, y-d, x+d, y-d);
				var p4 = new Wall(x, y+d, x-d, y+d, x+d, y+d);
				pool.push(p1,p2,p3,p4);
			}

			walls.length = 0;
			for (var p1 of pool) {
				var count = 0;
				for (var p2 of pool) {
					if (p1.x == p2.x && p1.y == p2.y) {
						count++;
					}
				}
				if (count%2 != 0) walls.push(p1);
			}					
		}

		function Wall(x,y,x1,y1,x2,y2) {
			this.x = x || 0;
			this.y = y || 0;
			this.x1 = x1 || 0;
			this.y1 = y1 || 0;
			this.x2 = x2 || 0;
			this.y2 = y2 || 0;
			this.isDoor = false;
			this.room = self;
		}		
	}
}