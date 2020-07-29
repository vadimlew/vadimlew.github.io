LEV.managers.DisplayManager = function DisplayManager(pixi, props) {	
	var root = new PIXI.Container();
	pixi.stage.addChild(root);
	var layer = new LayerManager();
	var sorter = new DisplaySorterManager();

	if (props) {
		if (props.layers) {
			for (var layerName of props.layers) {
				layer.create(layerName);
			}
		}
	}

	//Public 
	this.root = root;	
	this.layer = layer;	
	this.update = update;
	this.filters = new function() {
		var vintageColorMatrix = new PIXI.filters.ColorMatrixFilter();
		vintageColorMatrix.vintage(true);
		this.vintage = vintageColorMatrix;
		
		var outlineFilter = new PIXI.filters.OutlineFilter(1, 0xffffff, 1);
		this.outline = outlineFilter;
	};	

	function DisplaySorterManager() {
		var entities = [];	
		var updateFlag = true;	

		this.add = function(obj) {
			if (obj.position) obj.position.bind(onPositionUpdate);
			entities.push(obj);
		};

		this.remove = function(obj) {
			var ix = entities.indexOf(obj);			
			if (ix == -1) return;
			entities.splice(ix, 1);
		};

		function onPositionUpdate(pos, objA) {
			updateFlag = true;			
		}

		function displaySort(displayA, displayB) {			
			if (displayA.sortY > displayB.sortY) return 1;
			if (displayB.sortY > displayA.sortY) return -1;
			return 0;
		}

		this.update = function update() {			
			if (updateFlag) game.display.layer.get('game').children.sort(displaySort);
			updateFlag = false;
		}		
	}

	function LayerManager() {
		var layers = {};
		this.create = function(name) {
			if (!layers[name]) {
				layers[name] = new PIXI.Container();
				root.addChild(layers[name]);
			}
			return layers[name];
		}

		this.get = function (name) {
			return layers[name];
		}	

		this.layers = layers;	
	}	

	function update() {
		sorter.update();
	}

	LEV.components.display = function(props) {
		var image;
		switch(typeof props.image) {
			case 'string':
				image = PIXI.Sprite.from(props.image);
				break;

			case 'object':
				if (props.image instanceof PIXI.Container) 
					image = props.image;
				if (props.image instanceof PIXI.Texture) 
					image = PIXI.Sprite.from(props.image);
				break;			
		}

		var display = new PIXI.Container();
		this.display = display;	
		if (image) display.addChild(image);		

		if (image && image.anchor && (props.ax || props.ay)) {
			var ax = props.ax || 0;
			var ay = props.ay || 0;
			image.anchor.set(ax, ay);
		}
		
		display.x = props.x || 0;
		display.y = props.y || 0;
		display.cacheAsBitmap = props.cacheAsBitmap || false;
				
		var px = props.px || 0;
		var py = props.py || 0;
		display.pivot.set(px,py);

		props.sort = props.sort || {y:0};				
		display.sortY = display.y + props.sort.y;
		sorter.add(this);

		if (props.shadow) {
			var shape = new PIXI.Graphics();
			var shadow = new PIXI.Container();	
			shape.beginFill(0x000000, 0.2);			
			shape.drawRect(props.shadow[0], props.shadow[1], props.shadow[2], props.shadow[3]);
			display.shadow = shadow;			
			shadow.addChild(shape);
			shadow.cacheAsBitmap = true;
			display.addChildAt(shadow, 0);
			display.shadow = shadow;
		}

		if (this.position) {
			this.position.bind(onPositionUpdate);
		}		

		function onPositionUpdate(p) {
			display.x = p.x;
			display.y = p.y - p.z;
			display.sortY = display.y + props.sort.y + p.z;
		}

		display.setLayer = function(value) {
			if (typeof value == 'string') {
				value = layer.get(value);
			}			
			value.addChild(display);
		}

		if (props.layer) display.setLayer(props.layer);
		
		this.delete.add(function() {			
			sorter.remove(this);
			if (this.position) this.position.unbind(onPositionUpdate);
			display.destroy();
			delete this.display;
		}.bind(this));		
	}
	
	LEV.components.animation = function (props) {
		var animations = {};		
		var list = props.list;

		for (var i=0; i < list.length; i++) {
			var animObj = list[i];
			var images = [];

			if (animObj.reverse) {
				for (var j=animObj.frames-1; j >= 0; j--) {
					var image = animObj.src + j; //+ '.png';
					images.push(image);
				}	
			} else {
				for (var j=0; j < animObj.frames; j++) {
					var image = animObj.src + j; //+ '.png';
					images.push(image);
				}	
			}

			var animSprite = PIXI.AnimatedSprite.fromImages(images);
			animSprite.pivot.set(animObj.px || 0, animObj.py || 0);
			animSprite.anchor.set(animObj.ax || 0, animObj.ay || 0);
			animSprite.animationSpeed = animObj.speed || 0.2;
			animSprite.gotoAndStop(animObj.goto || 0);
			if (animObj.loop != null) animSprite.loop = animObj.loop;
			
			animSprite.visible = false;			
			animSprite.name = animObj.name;
			this.display.addChild(animSprite);			
			animations[animObj.name] = animSprite;
		}		

		var animation = animations[list[0].name];
		animation.visible = true;		

		Object.defineProperty(this, 'animation', {
			configurable: true,
			get: function() {							
				return animation;
			},
			set: function(name) {				
				animation.visible = false;				
				animation = animations[name];
				animation.visible = true;
			}
		})	

		if (props.autoplay) animation.gotoAndPlay(0);	

		this.delete.add(function() {	
			animation.stop();
			animation.onComplete = null;
			delete this.animation;			
		}.bind(this));
	}

	LEV.components.debug = function (props) {	
		var debug = new PIXI.Container();

		if (!this.display) console.warn("Debug can't be added: entity dont have 'display' components");	

		if (props.phys) {
			if (this.phys && this.display) {			
				var shape = this.phys.shape;			
				var rects = shape.rects;			

				for (var i = 0; i < rects.length; i++) {
					var rect = rects[i];					
					var debugShape = rectShape(rect.x, rect.y, rect.width, rect.height, 0xffff00, 0x000000, 0.5);
					debug.addChild(debugShape);				
				}				
			}	
			if (!this.phys) console.warn("Debug 'phys' can't be added: entity dont have 'phys' components");			
		}

		if (props.origin) {
			if(this.display) {		
				var debugShape = rectShape(-1.5, -1.5, 3, 3, 0x00ff00, 0x000000);
				this.display.addChild(debugShape);			
			} else {
				console.warn("Debug 'origin' can't be added: entity dont have 'display' components");
			}
		}

		if (props.sort) {
			if(this.display) {		
				var debugShape = rectShape(-1.5, -1.5, 3, 3, 0xffff00, 0x000000);
				debugShape.y = this.display.sortY - this.display.y;
				this.display.addChild(debugShape);
			} else {
				console.warn("Debug 'sort' can't be added: entity dont have 'display' or 'sort' components");
			}
		}

		if (props.hitBox && this.hitBox && this.display) {
			var shape = this.hitBox.shape;
			var rects = shape.rects;	
			
			for (var i = 0; i < rects.length; i++) {
				var rect = rects[i];					
				var debugShape = rectShape(rect.x, rect.y, rect.width, rect.height, 0xee0000, 0x000000, 0.65);
				this.display.addChild(debugShape);
			}
			if (!this.hitBox) console.warn("Debug 'hitBox' can't be added: entity dont have 'hitBox' components");					
		}		

		if (this.position) {
			this.position.bind(onPositionUpdate);
		}

		function onPositionUpdate(pos) {
			debug.x = pos.x;
			debug.y = pos.y;
		}
		
		game.display.layer.get('debug').addChild(debug);

		function rectShape(x,y,w,h, fillColor, lineColor, alpha=1) {			
			var debugShape = new PIXI.Graphics();
			if (lineColor != void 0) debugShape.lineStyle(1, lineColor);
			if (fillColor != void 0) debugShape.beginFill(fillColor);
			debugShape.drawRect(x, y, w, h);
			debugShape.alpha = alpha;
			debugShape.endFill();
			return debugShape;
		}

		this.debug = debug;	
		this.delete.add(function() {
			this.debug.destroy();
			delete this.debug;
		}.bind(this));
	}	
}