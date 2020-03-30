(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 930,
	height: 300,
	fps: 30,
	color: "#FFFFFF",
	manifest: []
};



// symbols:



(lib.back = function() {
	this.spriteSheet = ss["Deffchonki_CatsGame_930x300_atlas_"];
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.box = function() {
	this.spriteSheet = ss["Deffchonki_CatsGame_930x300_atlas_"];
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.bubble = function() {
	this.spriteSheet = ss["Deffchonki_CatsGame_930x300_atlas_"];
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.bubble2 = function() {
	this.spriteSheet = ss["Deffchonki_CatsGame_930x300_atlas_"];
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.cat1 = function() {
	this.spriteSheet = ss["Deffchonki_CatsGame_930x300_atlas_"];
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.cat2 = function() {
	this.spriteSheet = ss["Deffchonki_CatsGame_930x300_atlas_"];
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.cat3 = function() {
	this.spriteSheet = ss["Deffchonki_CatsGame_930x300_atlas_"];
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.cat4 = function() {
	this.spriteSheet = ss["Deffchonki_CatsGame_930x300_atlas_"];
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.deff_cats_logo = function() {
	this.spriteSheet = ss["Deffchonki_CatsGame_930x300_atlas_"];
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.final_img = function() {
	this.spriteSheet = ss["Deffchonki_CatsGame_930x300_atlas_"];
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.girl1 = function() {
	this.spriteSheet = ss["Deffchonki_CatsGame_930x300_atlas_"];
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.girl_cats_img = function() {
	this.spriteSheet = ss["Deffchonki_CatsGame_930x300_atlas_"];
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.play_btn = function() {
	this.spriteSheet = ss["Deffchonki_CatsGame_930x300_atlas_"];
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.star = function() {
	this.spriteSheet = ss["Deffchonki_CatsGame_930x300_atlas_"];
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.tnt2 = function() {
	this.spriteSheet = ss["Deffchonki_CatsGame_930x300_atlas_"];
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.PlayBtn = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("rgba(255,255,255,0.098)").s().p("AxsHgQjIAAiPiOQgsgsgegyQZADQX6jQQgeAygtAsQiNCOjJAAgA5TgJQgQi+C+iYQBKg7BWgkQBQghA1AAMAj3AAAQDJAACOCNQBDBEAdAlQA9BQghAYQhtBPg5gjQgRgLgbggQgdgjgSgNQhihHmhgOQmhgPnpgPQnrgPlrAhQlsAhg1BkQg/B1hHApQghATgdAAQguAAgmgug");
	this.shape.setTransform(-1.9,-0.5);
	this.shape._off = true;

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1).to({_off:false},0).wait(1));

	// Layer 1
	this.instance = new lib.play_btn();
	this.instance.setTransform(-191,-69);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(2));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-191,-69,382,138);


(lib.girl2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.final_img();
	this.instance.setTransform(-259.5,-150);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-259.5,-150,519,300);


(lib.bubble2_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.bubble2();
	this.instance.setTransform(0,-212);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-212,379,212);


(lib.Star = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.star();
	this.instance.setTransform(-20.5,-21);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-20.5,-21,41,42);


(lib.line = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.lf(["#FFFAEB","rgba(255,247,204,0.502)","rgba(255,246,202,0)"],[0,0.627,1],-252.2,-3.4,288.2,-3.4).s().p("EgnVAJnIgBgFIgHgvIgEgaMBONgR/IA1TNg");
	this.shape.setTransform(252.6,-59);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.4,-120.5,506,123.2);


(lib.girl1_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.girl1();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,180,288);


(lib.Cats = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = null;


(lib.cat_outline = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("rgba(254,254,254,0.996)").s().p("AjSEkQgSgEgNgHIgWgMQgigVgIgoQgDgmgFgJQhFhwAch4QAPg+AehBQgNh0A5gEQAQgBAiAKQAhAKALgBQAngJA+gFIAugCQAwgDA0AMQA1ALAQgGQCjhLgSCqQAlA7AcBYQAQA2gPA7QgTBOhDBLQgIAngQATQgfAnhGADQg0Akh1giQg4ASgqAAQg5AAgfgig");

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-36.3,-32.6,72.8,65.4);


(lib.bubble_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.bubble();
	this.instance.setTransform(0,-143);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-143,258,143);


(lib.box_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.box();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,930,300);


(lib.blind = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("rgba(0,0,0,0.2)").s().p("EhIpAXbMAAAgu2MCRSAAAMAAAAu2g");
	this.shape.setTransform(465,150);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,930,300);


(lib.tnt_logo = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.tnt2();
	this.instance.setTransform(-111,-68.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-111,-68.5,222,137);


(lib.girl_cat_img = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.girl_cats_img();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,344,300);


(lib.deffch_logo = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.deff_cats_logo();
	this.instance.setTransform(-215,-105.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-215,-105.5,430,211);


(lib.shine = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 2
	this.instance = new lib.line();
	this.instance.setTransform(0.4,0.1,1,1,-100.7,0,0,1.5,0.1);

	this.instance_1 = new lib.line();
	this.instance_1.setTransform(0.4,0.1,1,1,-123.5,0,0,1.4,0.1);

	this.instance_2 = new lib.line();
	this.instance_2.setTransform(0.4,0,1,1,-77.2,0,0,1.4,0.1);

	this.instance_3 = new lib.line();
	this.instance_3.setTransform(0.4,0,1,1,-53.7,0,0,1.4,0);

	this.instance_4 = new lib.line();
	this.instance_4.setTransform(0.4,0.1,1,1,-29.7,0,0,1.4,0.1);

	this.instance_5 = new lib.line();
	this.instance_5.setTransform(0.4,0,1,1,-148.8,0,0,1.4,0.1);

	this.instance_6 = new lib.line();
	this.instance_6.setTransform(0.3,0.1,1,1,-173.3,0,0,1.4,0);

	this.instance_7 = new lib.line();
	this.instance_7.setTransform(0.4,0.1,1,1,18.7,0,0,1.4,0);

	this.instance_8 = new lib.line();
	this.instance_8.setTransform(0.4,0.1,1,1,42.2,0,0,1.4,0.1);

	this.instance_9 = new lib.line();
	this.instance_9.setTransform(0.3,0.1,1,1,66.2,0,0,1.4,0.1);

	this.instance_10 = new lib.line();
	this.instance_10.setTransform(0.4,0.1,1,1,89.8,0,0,1.4,0);

	this.instance_11 = new lib.line();
	this.instance_11.setTransform(0.4,0.1,1,1,114.3,0,0,1.4,-0.1);

	this.instance_12 = new lib.line();
	this.instance_12.setTransform(0.4,0.1,1,1,138.5,0,0,1.4,0.1);

	this.instance_13 = new lib.line();
	this.instance_13.setTransform(0.3,0,1,1,163.7,0,0,1.4,0.1);

	this.instance_14 = new lib.line();
	this.instance_14.setTransform(0.4,0.1,1,1,-5.5,0,0,1.4,0);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_14},{t:this.instance_13},{t:this.instance_12},{t:this.instance_11},{t:this.instance_10},{t:this.instance_9},{t:this.instance_8},{t:this.instance_7},{t:this.instance_6},{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-514.4,-518.3,1031,1027.4);


(lib.Screen2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_94 = function() {
		this.stop();
		
		var cats = [];
		var self = this;
		var box = [95,0, 92,178, 115,235, 281,217, 654,219, 820,243, 840,178, 837,0];
		var isStartChoice = false;
		var choice = [];
		var life = 3;
		var showTime = 600;
		var countDown = showTime;
		
		var frequency = 30;
		stage.enableMouseOver(frequency);
		
		function verlet()
		{
			var vx = this.x - this.prevX;
			var vy = this.y - this.prevY;	
			this.prevX = this.x;
			this.prevY = this.y;	
			this.x += vx;
			this.y += vy;
			this.rotation += this.vr;
		}
		
		var rad = 60;
		function initCats(num)
		{
			for (var i=0; i < num; i++)
			{		
				var id = Math.floor(1 + Math.random()*4);
				var cat = eval( 'new lib.Cat' + id + '()' );	
				cat.id = id;
				cat.outline.visible = false;	
				cat.x = 130 + (i%11)*(rad+6) + Math.random()*5;
				cat.y = -rad - Math.floor(i/11) * rad;
				cat.rotation = 360 * Math.random();
				cat.prevX = cat.x;
				cat.prevY = cat.y;
				cat.vr = 0;		
				cat.verlet = verlet;		
				cats.push(cat);
				self.Cats.addChild(cat);
				cat.addEventListener('mouseover', catOverHandler);
				cat.addEventListener('mouseout', catOutHandler);		
			}	
		}
		
		function catOverHandler(e)
		{
			countDown = showTime;
			var cat = e.currentTarget;
			if (choice.length == 0)	{
				cat.outline.visible = true;
				choice.push(cat);
				return;
			}	
			if (cat.id == choice[0].id)	{
				if (!inChoice(cat) && isTouchToChoiceCats(cat))	{
					cat.outline.visible = true;
					self.Cats.setChildIndex (cat, self.Cats.numChildren-1);
					choice.push(cat);
				}		
			} else {
				if (choice.length >= 3)	{
					deleteChoiceCats();
				} else {
					for (var i=0; i < choice.length; i++)
						choice[i].outline.visible = false;					
				}
				cat.outline.visible = true;		
				choice.length = 0;
				choice.push(cat);
			}
		}
		
		function catOutHandler(e)
		{
			countDown = showTime;
			var cat = e.currentTarget;
			if (inChoice(cat)) return;		
			cat.outline.visible = false;
		}
		
		this.addEventListener('tick', update);
		function update()
		{	
			for (var i=0; i < cats.length; i++)
			{
				var cat = cats[i];
				cat.y += .5;		
				for (var j=0; j < 20; j++) 
				{
					collision(cat);
					boxCollision(cat);
				}
				cat.verlet();
			}
			if (choice.length > 0 && catsDistance() > rad+10)
			{
				if (choice.length >= 3)	{
					deleteChoiceCats();
				} else {
					for (var i=0; i < choice.length; i++)
						choice[i].outline.visible = false;					
				}
				choice.length = 0;
			}
			countDown--
			if (countDown < 0) endGame();
		}
		
		function collision(cat1)
		{
			for (var i=0; i < cats.length; i++)
			{
				var cat2 = cats[i];
				if (cat1 == cat2) continue;
				var dx = cat1.x - cat2.x;
				var dy = cat1.y - cat2.y;
				var dd = Math.sqrt(dx*dx+dy*dy);
				if (dd < rad) 
				{
					var nx = dx/dd;
					var ny = dy/dd;
					var dist = 0.4 * (rad - dd);
					nx *= dist;
					ny *= dist;
					cat1.x += nx;
					cat1.y += ny;
					cat2.x -= nx;
					cat2.y -= ny;			
					var vr1 = cat1.vr;
					var vr2 = cat2.vr;
					cat1.vr -= (vr1 + vr2) * .05;
					cat2.vr -= (vr1 + vr2) * .05;			
				}
			}
		}
		
		function boxCollision(cat)
		{
			if (cat.y < -rad) return;
			for (var i=0; i < box.length-2; i+=2)
			{
				var dx = box[i+2] - box[i+0];
				var dy = box[i+3] - box[i+1];
				var dd = Math.sqrt(dx*dx+dy*dy);
				var nx = dx/dd;
				var ny = dy/dd;
				var dx1 = cat.x - box[i+0];
				var dy1 = cat.y - box[i+1];
				var vec = dx * dy1 - dy * dx1;
				var scalar = (dx * dx1 + dy * dy1)/dd;		
				if (vec >= 0 && scalar >= -5 && scalar <= dd+5) 
				{
					var scalar = nx*dx1 + ny*dy1;
					cat.x = box[i+0] + scalar*nx;
					cat.y = box[i+1] + scalar*ny;
					var vx = cat.x - cat.prevX;
					var vy = cat.y - cat.prevY;
					// friction
					var scalar2 = nx*vx + ny*vy;
					cat.vr = Math.atan(scalar2/rad) * 180/Math.PI;
					scalar2 *= .05;
					cat.x -= scalar2*nx;
					cat.y -= scalar2*ny;
				}
			}	
		 }
		 
		 function inChoice(cat)
		 {
			 return choice.indexOf(cat) != -1;
		 }
		 
		 function catsDistance()
		 {
			 var minDist = 1000000;	
			 for (var i=0; i < choice.length; i++)
			 {
				 var cat = choice[i];
				 var dx = stage.mouseX - cat.x;
				 var dy = stage.mouseY - cat.y;
				 var dd = Math.sqrt(dx*dx+dy*dy);
				 if (minDist > dd) minDist = dd;
			 }
			 return minDist;
		 }
		 
		 function deleteChoiceCats()
		 {
			 for (var i=0; i < choice.length; i++)
			 {
				 var cat = choice[i];
				 var idx = cats.indexOf(cat);
				 cats.splice(idx, 1);
				 self.Cats.removeChild(cat);
			 }
			 var getPoints = new lib.GetPoints();
			 self.addChild(getPoints);
			 life--;
			 if (life <= 0) endGame();
		 }
		 
		 function endGame()
		 {
			 self.mouseChildren = false;
			 self.mouseEnabled = false;
			 self.play();
		 }
		 
		 function isTouchToChoiceCats(cat)
		 {
			 var minDist = rad + 15;
			 for (var i=0; i < choice.length; i++)
			 {
				 var chCat = choice[i];
				 var dx = chCat.x - cat.x;
				 var dy = chCat.y - cat.y;
				 var dd = Math.sqrt(dx*dx+dy*dy);
				 if (dd <= minDist) return true;
			 }
			 return false;
		 }
		 
		 initCats(60);
	}
	this.frame_147 = function() {
		this.stop();
		var screen3 = new lib.Screen3();
		showScreen(screen3);
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(94).call(this.frame_94).wait(53).call(this.frame_147).wait(1));

	// bubble
	this.instance = new lib.bubble_1("synched",0);
	this.instance.setTransform(511,204.3,0.214,0.214,0,0,0,41.1,-6.8);
	this.instance.alpha = 0;
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(19).to({_off:false},0).to({regX:40.9,regY:-6.7,scaleX:1.1,scaleY:1.1,alpha:1},10,cjs.Ease.get(1)).to({regX:41,regY:-6.8,scaleX:1,scaleY:1,y:204.2},5,cjs.Ease.get(-1)).wait(45).to({startPosition:0},0).to({alpha:0},10).to({_off:true},1).wait(58));

	// girl
	this.instance_1 = new lib.girl1_1("synched",0);
	this.instance_1.setTransform(335,152,1,1,0,0,0,90,144);
	this.instance_1.alpha = 0;
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(9).to({_off:false},0).to({x:420,alpha:1},10,cjs.Ease.get(1)).to({x:408},5,cjs.Ease.get(-1)).wait(55).to({startPosition:0},0).to({alpha:0},10).to({_off:true},1).wait(58));

	// cats
	this.Cats = new lib.Cats();

	this.timeline.addTween(cjs.Tween.get(this.Cats).wait(134).to({alpha:0},13).wait(1));

	// box
	this.instance_2 = new lib.box_1("synched",0);
	this.instance_2.setTransform(465,150,1,1,0,0,0,465,150);
	this.instance_2.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).to({alpha:1},14).wait(120).to({startPosition:0},0).to({alpha:0},13).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,930,300);


(lib.Cat4 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// cat
	this.instance = new lib.cat3();
	this.instance.setTransform(-32,-30.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// outline
	this.outline = new lib.cat_outline();

	this.timeline.addTween(cjs.Tween.get(this.outline).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-36.3,-32.6,72.8,65.4);


(lib.Cat3 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// cat
	this.instance = new lib.cat1();
	this.instance.setTransform(-32,-30.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// outline
	this.outline = new lib.cat_outline();

	this.timeline.addTween(cjs.Tween.get(this.outline).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-36.3,-32.6,72.8,65.4);


(lib.Cat2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// cat
	this.instance = new lib.cat2();
	this.instance.setTransform(-32,-30.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// outline
	this.outline = new lib.cat_outline();

	this.timeline.addTween(cjs.Tween.get(this.outline).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-36.3,-32.6,72.8,65.4);


(lib.Cat1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// cat
	this.instance = new lib.cat4();
	this.instance.setTransform(-32,-30.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// outline
	this.outline = new lib.cat_outline();

	this.timeline.addTween(cjs.Tween.get(this.outline).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-36.3,-32.6,72.8,65.4);


(lib.Screen1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_111 = function() {
		var screen2 = new lib.Screen2();
		showScreen(screen2);
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(111).call(this.frame_111).wait(1));

	// tnt logo
	this.instance = new lib.tnt_logo("synched",0);
	this.instance.setTransform(828,70,0.76,0.76);
	this.instance.alpha = 0;
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(14).to({_off:false},0).to({rotation:10,alpha:1},5,cjs.Ease.get(-1)).to({rotation:0},5,cjs.Ease.get(-1)).wait(75).to({startPosition:0},0).to({alpha:0},12).wait(1));

	// deffcats logo
	this.instance_1 = new lib.deffch_logo("synched",0);
	this.instance_1.setTransform(528,159,0.149,0.149);
	this.instance_1.alpha = 0;
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(4).to({_off:false},0).to({scaleX:1.08,scaleY:1.08,alpha:1},10,cjs.Ease.get(1)).to({scaleX:1,scaleY:1},5,cjs.Ease.get(-1)).to({rotation:5},40).to({rotation:0},40).to({alpha:0},12).wait(1));

	// girl
	this.instance_2 = new lib.girl_cat_img("synched",0);
	this.instance_2.setTransform(-187.6,150,1,1,0,0,0,172,150);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).to({x:226},9,cjs.Ease.get(1)).to({x:206},5,cjs.Ease.get(-1)).wait(85).to({startPosition:0},0).to({alpha:0},12).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-359.6,0,344,300);


(lib.PlayBtn_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_0 = function() {
		//stage.enableMouseOver(30);
		//this.cursor = 'pointer';
		//this.mouseChildren = false;
		this.btn.addEventListener("mouseover", btnMouseOverHandler.bind(this));
		this.btn.addEventListener("mouseout", btnMouseOutHandler.bind(this));
		
		function btnMouseOverHandler()
		{
			createjs.Tween.removeTweens(this.btn);
			createjs.Tween.get(this.btn).to({scaleX:1.05,scaleY:1.05}, 200);	
		}
		
		function btnMouseOutHandler()
		{
			createjs.Tween.removeTweens(this.btn);
			createjs.Tween.get(this.btn).to({scaleX:1,scaleY:1}, 200);	
		}
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

	// Layer 1
	this.btn = new lib.PlayBtn();
	new cjs.ButtonHelper(this.btn, 0, 1, 1);

	this.timeline.addTween(cjs.Tween.get(this.btn).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-191,-69,382,138);


(lib.Screen3 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_0 = function() {
		this.playBtn.addEventListener('click', clickBtnHandler);
		function clickBtnHandler(e)
		{
			window.open(adfox.link1,adfox.target);
		}
	}
	this.frame_240 = function() {
		var screen1 = new lib.Screen1();
		showScreen(screen1);
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(240).call(this.frame_240).wait(1));

	// logo tnt
	this.instance = new lib.tnt_logo("synched",0);
	this.instance.setTransform(801,80);
	this.instance.alpha = 0;
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(29).to({_off:false},0).to({rotation:5,alpha:1},5,cjs.Ease.get(1)).to({rotation:0},5,cjs.Ease.get(-1)).wait(190).to({startPosition:0},0).to({alpha:0},11).wait(1));

	// play btn
	this.playBtn = new lib.PlayBtn_1();
	this.playBtn.setTransform(710,381.3);
	this.playBtn._off = true;

	this.timeline.addTween(cjs.Tween.get(this.playBtn).wait(19).to({_off:false},0).to({y:206.1},10,cjs.Ease.get(1)).to({y:225},5,cjs.Ease.get(-1)).wait(195).to({alpha:0},11).wait(1));

	// bubble
	this.instance_1 = new lib.bubble2_1("synched",0);
	this.instance_1.setTransform(341,162.8,0.257,0.257,0,0,0,47.9,-16.1);
	this.instance_1.alpha = 0;
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(9).to({_off:false},0).to({regX:48,regY:-16.3,scaleX:1.1,scaleY:1.1,y:162.7,alpha:1},10,cjs.Ease.get(1)).to({regY:-16.2,scaleX:1,scaleY:1,y:162.8},5,cjs.Ease.get(-1)).wait(205).to({startPosition:0},0).to({alpha:0},11).wait(1));

	// girl
	this.instance_2 = new lib.girl2("synched",0);
	this.instance_2.setTransform(259.5,150);
	this.instance_2.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).to({alpha:1},14).wait(215).to({startPosition:0},0).to({alpha:0},11).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,519,300);


(lib.ShineAnim = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.shine("synched",0);
	this.instance.alpha = 0.699;

	this.timeline.addTween(cjs.Tween.get(this.instance).to({rotation:360},149).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-509.1,-513.1,1020.7,1017.4);


(lib.GetPoints = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_0 = function() {
		var stars = [];
		var angle = 0;
		var len = 9 + Math.floor(Math.random()*8);
		for (var i=0; i < len; i++)
		{
			var star = new lib.Star();
			star.x = 465;
			star.y = 150;
			star.scaleX = star.scaleY = .7 + Math.random()*.3;
			this.addChild(star);
			var v = 3 + 5 * Math.random();
			star.vx = v * Math.cos(angle);
			star.vy = v * Math.sin(angle);
			star.vr = 4 + 4 * Math.random();
			stars.push(star);
			angle += Math.PI*2 / len;
		}
		
		this.addEventListener('tick',update);
		function update()
		{
			for (var i=0; i < len; i++)
			{
				var star = stars[i];
				star.x += star.vx;
				star.y += star.vy;		
				star.rotation += star.vr;
			}
		}
	}
	this.frame_39 = function() {
		this.stop();
		this.parent.removeChild(this);
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(39).call(this.frame_39).wait(1));

	// shine
	this.instance = new lib.ShineAnim();
	this.instance.setTransform(465,150);
	this.instance.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance).to({alpha:1},9).wait(20).to({alpha:0},10).wait(1));

	// blind
	this.instance_1 = new lib.blind("synched",0);
	this.instance_1.setTransform(120,200,1,1,0,0,0,120,200);
	this.instance_1.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({alpha:1},9).wait(20).to({startPosition:0},0).to({alpha:0},10).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-49.4,-368.3,1031,1027.4);


// stage content:



(lib.Deffchonki_CatsGame_930x300 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_0 = function() {
		var screen1 = new lib.Screen1();
		var currentScreen;
		var self = this;
		
		showScreen = function (screen)
		{
			self.removeChild(currentScreen);
			self.addChild(screen);
			currentScreen = screen;
		}
		
		showScreen(screen1);
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

	// back
	this.instance = new lib.back();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(465,150,930,300);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, createjs, ss;