var assetManager, canvas, context;
var particles = [];
var TO_RADIANS = Math.PI/180; 
var fov = 1000;
var originX = 0;
var originY = 0;
var dt = 1/10;
var mouseX=0;
var mouseY=0;
var globYRot=0;
var globXRot=0;
var cameraXRot=0;
var cameraYRot=0;
var isDrag = false;

window.onload = init;
window.onresize = function () {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	originX = canvas.width / 2;
	originY = canvas.height / 2;
}

if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (function() {
        return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback, element) {
            window.setTimeout(callback, 1000 / 60)
        }
    })()
}

function init() {
	console.log(isPalindrome('Do geese >*see God?'));
	initCanvas();
	initAssets();
}

function isPalindrome(str) {
    str = str.replace(/\s+|[1234567890.,?<>*-+=!]+/g, '');    
    var len = parseInt(str.length/2);
    for (let i=0; i < len; i++) {
        var l1 = str[i].toUpperCase();       
        var l2 = str[str.length-i-1].toUpperCase();
        if (l1 != l2) return false;
    }
    return true;
}

function initCanvas() {
	canvas = document.getElementById('canvas');	
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvas.addEventListener('mousemove', canvasMouseMoveHandler);
	canvas.addEventListener('mouseup', canvasMouseUpHandler);
	canvas.addEventListener('mousedown', canvasMouseDownHandler);
	context = canvas.getContext('2d');
	originX = canvas.width / 2;
	originY = canvas.height / 2;	
}

function canvasMouseMoveHandler(e)
{
	if (isDrag) {		
		cameraYRot -= .5*(e.clientX - mouseX)*TO_RADIANS;
	}
	mouseX = e.clientX;
	mouseY = e.clientY;		
}

function canvasMouseUpHandler(e)
{
	isDrag = false;		
}

function canvasMouseDownHandler(e)
{
	isDrag = true;		
}

function initAssets() {
	assetManager = new AssetManager();
	assetManager.addToQueue('p0', 'images/particles/0.png');
	assetManager.addToQueue('p1', 'images/particles/1.png');
	assetManager.addToQueue('p2', 'images/particles/2.png');
	assetManager.addToQueue('p3', 'images/particles/3.png');
	assetManager.addToQueue('p4', 'images/particles/4.png');
	assetManager.addToQueue('d0', 'images/dust/dust0.png');
	assetManager.addToQueue('d1', 'images/dust/dust1.png');
	assetManager.addToQueue('d2', 'images/dust/dust2.png');
	assetManager.addToQueue('ray1', 'images/rays/ray1.png');
	assetManager.loadAll(imgLoadCallBack);
}

function imgLoadCallBack() {			
	generateParticlesSphere();	
	generateSpaceDust();
	update();
}

function generateParticlesSphere() {
	var points = generateSphere(30, 50, 100);	
	var sprites = assetManager.getAssets('p0','p1','p2','p3','p4');
	var ddx = 0;
	for (var i=0; i < points.length; i++)
	{		
		var p = points[i];	
		p.sprite = sprites[parseInt(Math.random()*sprites.length)];		
		createParticle(p);
		
		p.rotation = Math.random()*360*TO_RADIANS;
		p.angSpeed = 2*Math.random()*TO_RADIANS;
		p.scale = 0.1;		
		
		p.dx = -2+Math.random()*4;
		p.dy = -2+Math.random()*4;
		p.vx = -.2+Math.random()*.4;
		p.vy = -.2+Math.random()*.4;			
		
		p.behavior = function() {
			var p = this;			
			var d = Math.sqrt(p.dx*p.dx + p.dy*p.dy);			
			if (d != 0) {				
				p.vx -= .005*(d - 0)*p.dx/d;
				p.vy -= .005*(d - 0)*p.dy/d;
				if (d > 4) {
					p.vx *= .96;				
					p.vy *= .96;
				}				
			}	
			p.dx += p.vx;
			p.dy += p.vy;				
			p.x += p.dx;
			p.y += p.dy;			
			p.rotation += p.angSpeed;
			
			var alpha = .7*(1 - (p.z+100)/100);	
			if (alpha < .1) alpha = .1;
			var dx = p.x - mouseX + originX;
			var dy = p.y - mouseY + originY;
			var dd = Math.sqrt(dx*dx + dy*dy);
			if (dd < 150) alpha += .5 * (150 - dd)/150;	
			p.alpha = alpha;
			
			if (dd < 40) {								
				p.vx = .3*(40-dd)*dx/dd;
				p.vy = .3*(40-dd)*dy/dd;
			}
		}
		particles.push(p);
	}	
}

function createParticle(p) {
	p.ox = p.sprite.width/2;
	p.oy = p.sprite.height/2;
	p.hx = p.x;
	p.hy = p.y;
	p.hz = p.z;	
	p.alpha = 1;	
}

function generateSpaceDust() {	
	var points = generateRandomSphere(100, 100, 1500);
	var sprites = assetManager.getAssets('d0','d1','d2');
	for (var i=0; i < points.length; i++)
	{		
		var p = points[i];	
		p.sprite = sprites[parseInt(Math.random()*sprites.length)];
		p.hx = p.x;
		p.hy = p.y;
		p.hz = p.z;	
		p.rotation = 0;
		p.angSpeed = .2 * Math.random()*TO_RADIANS;
		p.scale = 0.4 * Math.random();
		p.alpha = 1;
		
		p.ox = p.sprite.width/2;
		p.oy = p.sprite.height/2;
		
		p.dx = 5-10+Math.random()*20;
		p.dy = 5-10+Math.random()*20;	
		p.dz = 5-10+Math.random()*20;	
		p.vx = -10 + Math.random()*20;
		p.vy = -10 + Math.random()*20;
		p.vz = -10 + Math.random()*20;
		p.radius = 20 + Math.random()*60;
		
		p.behavior = function() {
			var p = this;			
			var d = Math.sqrt(p.dx*p.dx + p.dy*p.dy + p.dz*p.dz);
			if (d > p.radius) {
				var nx = p.dx/d;
				var ny = p.dy/d;
				var nz = p.dz/d;
				p.vx -= dt * nx;
				p.vy -= dt * ny;				
				p.vz -= dt * nz;				
			}			
			p.dx += dt * p.vx;
			p.dy += dt * p.vy;
			p.dz += dt * p.vz;
			p.x += p.dx;
			p.y += p.dy;
			p.z += p.dz;
			p.rotation += p.angSpeed;
		}
		particles.push(p);
	}	
}

function update() {	
	requestAnimationFrame(update);	
	updateCamera();
	render();	
}

function updateCamera() {
	var toXRot = (originY-mouseY) / canvas.height * Math.PI/2;
	var toYRot = (mouseX-originX) / canvas.width * Math.PI/2;
	globXRot += (toXRot - globXRot) / 5;
	globYRot += (toYRot - globYRot) / 5;
	var matrixX = getXRotate(globXRot + cameraXRot);
	var matrixY = getYRotate(globYRot + cameraYRot);
	var matrix = matrixMulti(matrixX, matrixY)
	applyMatrix(particles, matrix);	
	particles.sort(sortByScreenZ);	
}

function render() {
	//context.clearRect(0,0,canvas.width,canvas.height);
	var isFlower = false;
	var grd=context.createRadialGradient(originX,originY,5,originX,originY,canvas.width*.3);
	grd.addColorStop(0,"rgba(6,29,47,1)");
	grd.addColorStop(1,"rgba(5,24,39,1)");
	context.fillStyle = grd; //'rgba(5,16,39,0.4)';
	context.fillRect(0,0,canvas.width,canvas.height);
	var ray = assetManager.getAsset('ray1');	
	rotateAndDrawImage( context, ray, .05+(globXRot-globYRot) / 30, -400, -400, 0, 0, canvas.width, canvas.height, 1.4, .6 );	
	for (var i=0; i < particles.length; i++)
	{		
		var p = particles[i];
		p.behavior();
		
		var scale = fov/Math.max(10, fov+p.z);
		var x2d = p.x * scale + originX;
		var y2d = p.y * scale + originY;
		
		rotateAndDrawImage( context, p.sprite, p.rotation, x2d, y2d, p.ox, p.oy, p.sprite.width, p.sprite.height, p.scale * scale, p.alpha );		
		if(!isFlower && p.z <= 0) {
			drawFlovers();
			isFlower = true;
		}
	}	
	drawFlovers();
}

function rotateAndDrawImage ( context, image, angleInRad , posX=0, posY=0, oX=0, oY=0, w=0, h=0, scale = 1, alpha = 1 ) {
	context.translate( posX, posY );
	context.rotate( angleInRad );
	context.save();
	context.globalAlpha = alpha;
	canvas.globalCompositeOperation = "lighten";
	context.drawImage( image, -oX*scale, -oY*scale, w*scale, h*scale );
	context.restore();	
	context.rotate( -angleInRad );
	context.translate( -posX, -posY );
}

var flowers = [{hx:0,hy:15,hz:0}, {hx:0,hy:250,hz:-50}, {hx:20,hy:500,hz:50}, {hx:-20,hy:750,hz:0}];
function drawFlovers()
{
	var matrixX = getXRotate(globXRot + cameraXRot);
	var matrixY = getYRotate(globYRot + cameraYRot);
	var matrix = matrixMulti(matrixX, matrixY);
	applyMatrix(flowers, matrix);
	
	var scale = fov/(fov+flowers[3].z);	
	var x0 = flowers[0].x * scale + originX;
	var y0 = flowers[0].y * scale + originY;
	
	scale = fov/(fov+flowers[1].z);
	var x1 = flowers[1].x * scale + originX;
	var y1 = flowers[1].y * scale + originY;
	
	scale = fov/(fov+flowers[2].z);
	var x2 = flowers[2].x * scale + originX;
	var y2 = flowers[2].y * scale + originY;
	
	scale = fov/(fov+flowers[3].z);
	var x3 = flowers[3].x * scale + originX;
	var y3 = flowers[3].y * scale + originY;	
	
	context.save();
	context.globalAlpha = .7;	
	
	context.shadowColor = '#C2CFE2';
    context.shadowBlur = 10;
	context.beginPath();
	
	var grad = context.createLinearGradient(x0, y0, x3, y3);
	grad.addColorStop(0, "rgba(194,207,226,1)");
	grad.addColorStop(.5, "rgba(194,207,226,1)");
	grad.addColorStop(1, "rgba(194,207,226,0)");
	context.strokeStyle = grad;
	context.lineWidth = 8;
	context.moveTo(x0,y0);
	context.bezierCurveTo(x1,y1,x2,y2,x3,y3);
	context.stroke();	
	context.closePath();
	
	var grad2 = context.createRadialGradient(x0, y0-15, 20, x0, y0-15, 30);
	grad2.addColorStop(0, "rgba(194,207,226,1)");	
	grad2.addColorStop(1, "rgba(194,207,226,0)");
	context.fillStyle = grad2;//'rgba(194,207,226,1)';
	context.beginPath();	
	context.arc(x0,y0-15,30,0,2*Math.PI);
	//context.stroke();
	context.fill();	
	context.restore();	
	
	context.shadowColor = 'transparent';
}




