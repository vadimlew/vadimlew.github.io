/**************************************
* LEVjs
**************************************/

function LEV(app_width, app_height) {
	const app = new PIXI.Application({
		width: app_width, 
		height: app_height, 
		backgroundColor: 0x000000,
		antialias: true			
	});	

	const stage = app.stage;	

	this.app = app;
	this.mesh = mesh;
	this.sprite = createSprite;
	this.animation = createAnimSprite;
	this.animationJSON = createAnimSpriteFromJSON;	
	this.loopAnimateMesh = loopAnimateMesh;
	this.setTransform = setTransform;
	this.globalPos = getGlobalPos;	
	this.makeDraggable = makeDraggable;
	this.shapeRect = createShapeRect;

	this.resize = new ResizeManager();
	this.mouse = app.renderer.plugins.interaction.mouse;

	function createSprite(texture_name, transform) {
		if (arguments.length == 1 && typeof(arguments[0]) == 'object') {
			transform = arguments[0];
			var sprite = new PIXI.Container();
		} else if (texture_name instanceof PIXI.Texture) {
			var sprite = new PIXI.Sprite(texture_name);
		} else {
			var texture = app.loader.resources[texture_name].texture;
			var sprite = new PIXI.Sprite(texture);
		}
		if (transform) setTransform(sprite, transform);
		return sprite;
	}	

	function createAnimSprite(texture_name, sheet_data, transform) {
		var sprite;			
		var texture = app.loader.resources[texture_name].texture.baseTexture;

		if (sheet_data.hasOwnProperty('row')) {
			var col = sheet_data.col;
			var row = sheet_data.row;				
			var w = texture.width/col;
			var h = texture.height/row;
			var len = col*row;
			sheet_data = {frames:{}, animations:{anim:[]}, meta:{scale:1}};

			for (let i=0; i < len; i++) {
				let name = texture_name + '_frame' + i;				
				let x = w*(i%col);
				let y = h*parseInt(i/col);
				sheet_data.frames[name] = {frame:{x,y,w,h}, sourceSize:{w,h}};
				sheet_data.animations.anim.push(name);
			}
		}

		var sprite_sheet = new PIXI.Spritesheet(texture, sheet_data);
		sprite_sheet.parse(()=>{sprite = new PIXI.AnimatedSprite(sprite_sheet.animations['anim']);});
		if (transform) setTransform(sprite, transform);

		sprite.clone = function() {
			var clone = new PIXI.AnimatedSprite(sprite_sheet.animations['anim']);
			if (transform.autoplay) clone.play();
			if (transform) setTransform(clone, transform);
			return clone;
		}

		if (transform.autoplay) sprite.play();

		return sprite;
	}

	function createAnimSpriteFromJSON(name, anim, transform) {			
		var sprite_sheet = app.loader.resources[name].spritesheet;		
		var	sprite = new PIXI.AnimatedSprite(sprite_sheet.animations[anim]);	
		
		if (transform) setTransform(sprite, transform);
		if (transform.autoplay) sprite.play();

		return sprite;
	}

	function mesh(texture, row, col, transform, debug=false) {
		if (typeof(texture) == 'string') texture = app.loader.resources[texture].texture;			
		var mesh = new PIXI.SimplePlane(texture, row, col);
		if (transform) setTransform(mesh, transform);		 	
		mesh.calculateVertices();
		mesh.calculateUvs();

		if (debug) {				
			var marks = new PIXI.Graphics();				
			stage.addChild(marks);

			app.ticker.add(() => {
				marks.clear();
				marks.beginFill(0x00ffff);
				for (let i=0; i<mesh.vertexData.length; i+=2) {
					var x = mesh.vertexData[i]/stage.scale.x;
					var y = mesh.vertexData[i+1]/stage.scale.y;
					marks.drawRect(x-4, y-0.5, 9, 2);
					marks.drawRect(x-0.5, y-4, 2, 9);
				}
				marks.endFill();
			});
		}

		return mesh;
	}

	function loopAnimateMesh(mesh, data, timeOrTween) {
		var points = []; 
		var displacies = []; 

		for (var point of data.split(',')) {
			var parse = point.split('/');
			var ids = parse[0];				
			var dx = parse[1]? Number(parse[1].match(/-*\d+/)[0]) : 0;
			var dy = parse[2]? Number(parse[2].match(/-*\d+/)[0]) : 0;

			if (ids.includes('all')) {
				var len = mesh.vertexData.length/2;
				points.push(...Array(len).fill().map((el, i)=>{return i}));
				displacies.push(...Array(len).fill([dx,dy]));
			} else if (ids.includes('_')) {
				ids = ids.split('_').map(Number);	
				var len = ids[1]-ids[0]+1;					
				points.push(...Array(len).fill().map((el,i)=>{return ids[0]+i}));
				displacies.push(...Array(len).fill([dx,dy]));
			} else if (ids.includes(' ')) {
				ids = ids.match(/\d+/g).map(Number);
				points.push(...ids);
				displacies.push(...Array(ids.length).fill([dx,dy]));					
			} else {					
				points.push(Number(ids));
				displacies.push([dx,dy]);					
			}
		}

		var prop = {m:0};
		var prevD = 0;			
		var tween_prop = {m:1, repeat:-1, yoyo:true, ease:'power1.inOut', onUpdate};
		if (typeof(timeOrTween) == 'object') {
			Object.assign(tween_prop, timeOrTween);
		} else {
			tween_prop.duration = timeOrTween;
		}
		gsap.to(prop, tween_prop);
		function onUpdate() {
			var n = prop.m - prevD;
			prevD = prop.m;
			for (let i = 0; i < points.length; i++) {
				var ix = points[i]*2;
				var iy = points[i]*2+1;
				mesh.vertexData[ix] += displacies[i][0]*n;
				mesh.vertexData[iy] += displacies[i][1]*n;
			}				
		}						
	}

	function shapeRect(color, size, transform)	{
		var shape = new PIXI.Graphics();
		shape.beginFill(color);
		shape.drawRect(...size);
		if (transform) setTransform(shape, transform);
		return shape;
	}	

	function setTransform(sprite, transform) {
		for (var prop in transform) {
			if (sprite[prop] === void 0) continue;
			if (typeof transform[prop] == 'number' || typeof transform[prop] == 'boolean') sprite[prop] = transform[prop];
			if (sprite[prop] instanceof PIXI.ObservablePoint) {
				if (typeof transform[prop] === 'number') sprite[prop].set(transform[prop]);
				else if (transform[prop] instanceof Array) sprite[prop].set(...transform[prop]);						
				else if (transform[prop] instanceof (PIXI.ObservablePoint, PIXI.Point)) sprite[prop].copyFrom(transform[prop]);
			}
		}
		if (transform.add) transform.add.addChild(sprite);
	}

	function getGlobalPos(sprite) {
		var p = {x:0, y:0};
		while(sprite.parent) {	
			var sx = 1//sprite.parent.scale.x;	
			var sy = 1//sprite.parent.scale.y;	
			var cos = Math.cos(sprite.parent.rotation);
			var sin = Math.sin(sprite.parent.rotation);
			p.x += sprite.x*sx*cos - sprite.y*sy*sin;
			p.y += sprite.x*sx*sin + sprite.y*sy*cos;
			sprite = sprite.parent;
		}
		return p;
	}	

	function makeDraggable(sprite) {
		var dx, dy;
		sprite.interactive = true;
		sprite.on('mousedown', mousedown);			
		sprite.on('mouseup', mouseup);
		sprite.on('mouseupoutside', mouseup);

		function mousedown(e) {
			dx = sprite.x - e.data.global.x;
			dy = sprite.y - e.data.global.y;
			//console.log(e);
			sprite.on('mousemove', mousemove);
		};
		function mousemove(e) {
			sprite.x = e.data.global.x + dx;
			sprite.y = e.data.global.y + dy;
		};
		function mouseup() {
			sprite.off('mousemove', mousemove);
			//console.log('x:' + sprite.x + ', y:' + sprite.y);
		};
	}

	function ResizeManager() {
		var isStart = false;
		var data = {
			portrait:[],
			landscape:[]
		}

		this.start = function(resObj) {
			if (isStart) return;
			isStart = true;

			app.view.style.position = 'absolute';
			app.view.style.display = 'block';
			app.view.style.top = "50%";
			app.view.style.left = "50%";
			app.view.style.transform = "translate(-50%, -50%)";
		
			window.addEventListener('resize', resizeHandler);
			if (resObj) this.add(resObj);
			else resizeHandler();
		}

		this.add = function() {
			if (arguments.length == 1) {
				var resObj = arguments[0];				
				data.portrait.push(...resObj.portrait);
				data.landscape.push(...resObj.landscape);
			}	
			if (arguments.length == 3) {
				var obj = arguments[0];
				var portrait = arguments[1];
				var landscape = arguments[2];
				data.portrait.push([obj, ...portrait]);
				data.landscape.push([obj, ...landscape]);
			}
			resizeHandler();	
		}

		function setOrientation(orient) {
			if (!data[orient]) return;
			for (var item of data[orient]) {
				setTransform(item[0], item[1]);
			}
		}

		function resizeHandler() {
			var iw = window.innerWidth, ih=window.innerHeight;
			if (iw < ih) {
				var w = app_width, h = app_height;
				setOrientation('portrait');
			} else {
				var h = app_width, w = app_height;
				setOrientation('landscape');
			}
			var xRatio=iw/w, yRatio=ih/h, sRatio=1;
			sRatio = Math.min(xRatio, yRatio);
			stage.scale.set(sRatio);
			app.renderer.resize(w*sRatio,h*sRatio);
		}	
	}
}