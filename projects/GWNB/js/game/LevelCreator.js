function LevelCreator(pixi) {
	var display = new PIXI.Container();
	var pointShape = new PIXI.Graphics();
	var roomShape = new PIXI.Graphics();
	var drawFlag = 0;
	var handFlag = 0;

	var rooms = [];
	var points = [];
	var doors = [];
	var walls = [];

	this.rooms = rooms;
	this.points = points;
	this.doors = doors;
	this.walls = walls;
	this.display = display;

	var text_style = new PIXI.TextStyle({fill:0xffffff, fontSize:10});
	pointShape.lineStyle(2, 0xffffff);
	display.addChild(roomShape);
	display.addChild(pointShape);

	function create(width, height, numRooms) {
		for (var i = 0; i < numRooms; i++) {			
			var x = parseInt(width*Math.random());
			var y = parseInt(height*Math.random());
			var point = new PIXI.Point(x,y);
			var count = 0;

			do {
				var displace = findDisplace(point, 300);
				point.x += displace.x;			
				point.y += displace.y;
				if (point.x > width) point.x = point.x - width;	
				if (point.y > height) point.y = point.y - height;	
				if (point.x < 0) point.x = point.x + width;	
				if (point.y < 0) point.y = point.y + height;
				count++;
			} while (count < 100 && displace.x != 0 && displace.y != 0)				

			points.push(point);
			var text = new PIXI.Text(i+1, text_style);
			text.x = point.x;
			text.y = point.y;
			display.addChild(text);			
		}

		walls.push(
			new Wall(0,0,'h',width),
			new Wall(width,0,'v',height),
			new Wall(0,height,'h',width),
			new Wall(0,0,'v',height)
		)

		var room = new Room(0,0,width,height,points);

		if (handFlag) {
			rooms.push(room);
			pixi.view.addEventListener('click', clickCanvas);
		} else {
			separateRoom(room);
			alignDoors();
			drawRooms();
			drawWalls();
			drawDoors();
		}
		
		function clickCanvas() {
			var clone = rooms.concat();
			var len = clone.length;
			for (var i = 0; i < len; i++) {
				var room = clone[i];
				if (room.points.length >= 2) {
					rooms.remove(room);					
					separateRoom(room);
				}
			}
			alignDoors();
			drawRooms();
			drawWalls();
			drawDoors();
		}		
	}

	function separateRoom(room) {
		var summ = 0;			
		orient = room.width > room.height;			

		for (var i = 0; i < room.points.length; i++) {
			var p = room.points[i];
			summ += orient? p.x - room.x : p.y - room.y;
		}				

		var border = parseInt(summ / room.points.length);
		var room1 = new Room(room.x, room.y, (orient? border : room.width), (orient? room.height : border));
		var room2 = new Room((orient? room.x + border : room.x), (orient? room.y : room.y + border), (orient? room.width - border : room.width), (orient? room.height : room.height-border));

		for (var i = 0; i < room.points.length; i++) {
			var p = room.points[i];
			if( (orient? p.x - room.x : p.y - room.y) < border) {
				room1.points.push(p);
			} else {
				room2.points.push(p);
			}
		}	

		for (var i = 0; i < room.doors.length; i++) {
			var door = room.doors[i];				
			if( (orient? door.x - room.x : door.y - room.y) < border) {											
				room1.doors.push(door);
			} else {					
				room2.doors.push(door);
			}				
		}	

		if (orient) {
			var door = new Door(room.x + border, room.y + parseInt(room.height*Math.random()));
			var wall = new Wall(room.x + border, room.y, 'v', room.height, door);
		} else {
			var door = new Door(room.x + parseInt(room.width*Math.random()), room.y + border);
			var wall = new Wall(room.x, room.y + border, 'h', room.width, door);
		}	

		doors.push(door);
		walls.push(wall);
		room1.doors.push(door);			
		room2.doors.push(door);								
		rooms.push(room1, room2);

		if (handFlag) {					
			return;	
		}

		rooms.remove(room);	
		if (room1.points.length > 1) {
			separateRoom(room1);
		} 

		if (room2.points.length > 1) {
			separateRoom(room2);
		}
	}		

	function alignDoors() {	
		for (var i = 0; i < rooms.length; i++) {			
			for (var j = 0; j < rooms[i].doors.length; j++) {
				rooms[i].doors[j].rooms.push(rooms[i]);
			}
		}		

		for (var i = 0; i < doors.length; i++) {
			var door = doors[i];							

			var room1 = door.rooms[0];				
			var room2 = door.rooms[1];	

			var isHorizontal = door.x == room1.x || door.x == room2.x;
			var isVertical = door.y == room1.y || door.y == room2.y;		

			if (isHorizontal) {
				var dy = room1.y - room2.y;
				var dh = dy + room1.height - room2.height;
				var area = room1.height;
				if (dy < 0) area += dy;
				if (dh > 0) area -= dh;
				var startY = dy < 0? room2.y : room1.y;
				door.y = startY + area/2;
			} else if (isVertical) {
				var dx = room1.x - room2.x;
				var dw = dx + room1.width - room2.width;
				var area = room1.width;
				if (dx < 0) area += dx;
				if (dw > 0) area -= dw;
				var startX = dx < 0? room2.x : room1.x;
				door.x = startX + area/2;
			}		
		}	
	}		

	function findDisplace(point, dist) {
		var displace = new PIXI.Point();
		for (var i = 0; i < points.length; i++) {	
			var point2 = points[i];
			var dx = point.x - point2.x;
			var dy = point.y - point2.y;
			var dd = Math.sqrt(dx*dx + dy*dy);
			if (dd < dist) {
				displace.x += dx;
				displace.y += dy;
			}
		}			
		return displace;
	}

	function drawRooms() {
		roomShape.clear();
		for (var i = 0; i < rooms.length; i++) {				
			drawRoom(rooms[i]); 
		}
	}

	function drawRoom(room) {
		roomShape.beginFill( parseInt(0xffffff*Math.random()), 0.25 );
		roomShape.lineStyle(1, 0xcccccc);
		roomShape.drawRect(room.x,room.y,room.width,room.height);			
	}

	function drawDoors() {			
		for (var i = 0; i < doors.length; i++) {				
			drawDoor(doors[i]); 
		}
	}

	function drawDoor(door) {
		roomShape.beginFill( 0xff0000, 0.5 );
		roomShape.lineStyle(1, 0x000000);
		roomShape.drawRect(door.x-5,door.y-5,10,10);
	}

	function drawWalls() {			
		for (var i = 0; i < walls.length; i++) {				
			drawWall(walls[i]); 
		}
	}

	function drawWall(wall) {
		roomShape.beginFill( 0x0000ff, 0.5 );
		roomShape.lineStyle(1, 0x999999);
		var width = wall.direction == 'h'? wall.length : 5;
		var height = wall.direction == 'v'? wall.length : 5;
		roomShape.drawRect(wall.x-2.5,wall.y-2.5,width,height);
	}

	function Room(x,y,width,height,points,doors) {
		this.x = x || 0;
		this.y = y || 0;
		this.width = width || 0;
		this.height = height || 0;
		this.points = points || [];
		this.doors = doors || [];
	}

	function Door(x,y,rooms) {
		this.x = x || 0;
		this.y = y || 0;
		this.rooms = rooms || [];			
	}

	function Wall(x,y,direction,length,door) {
		this.x = x || 0;
		this.y = y || 0;
		this.direction = direction || 'h';
		this.length = length || 0;
		this.door = door;
	}

	this.create = create;
}