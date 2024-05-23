//---------------------------------------------------------------------------------
//- VALUE

const toRAD = Math.PI/180;

//---------------------------------------------------------------------------------
//- Init HOWLER

function initLibHowler() {
	Howler.mute(true);
}

//---------------------------------------------------------------------------------
//- Init THREE

function initLibThree(){
	app.scene3d = new THREE.Scene();
	//app.scene3d.background = new THREE.Color(0x006a9d);
	app.scene3d.background = assets.textures.three['background'];
	
	app.renderer3d = new THREE.WebGLRenderer({ 
		canvas		: app.canvas3d,
		antialias	: true,
		alpha		: true
	});

	app.renderer3d.shadowMap.enabled = true;
	app.renderer3d.outputEncoding = THREE.sRGBEncoding;
	
	app.renderer3d.setSize( window.innerWidth, window.innerHeight );
}
	
//---------------------------------------------------------------------------------
//- Init PIXI

function initLibPixi(){
	let antialias = true;
	let osVersion = ""+checkVersionIOS();
	
	if (osVersion.indexOf("OS 15.4") != -1) {
		antialias = false;
	}
	
	app.canvasWidth = Math.ceil(window.innerWidth);
	app.canvasHeight = Math.ceil(window.innerHeight);

	app.renderer2d 	= new PIXI.autoDetectRenderer({
		width: app.canvasWidth, 		
		height: app.canvasHeight,
		view: app.canvas2d, 
		backgroundAlpha: 0,
		antialias			 						
	});
	
	app.scene2d = new PIXI.Container();
	app.scene2d.position.set(Math.ceil(app.canvasWidth*0.5), Math.ceil(app.canvasHeight*0.5));			
	app.scene2d.visible = false;	

	app.scene2d.interactive = true;
	app.scene2d.on('pointerdown', stageDown);
	app.scene2d.on('pointermove', stageMove);
	app.scene2d.on('pointerup', stageUp);
	app.scene2d.on('pointerupoutside', stageUp);	

	app.scene2d.hitArea = new PIXI.Rectangle(-1280,-1280,2560,2560);
}


function checkVersionIOS() {
    var agent = window.navigator.userAgent,
    start = agent.indexOf( 'OS' );
    if( ( agent.indexOf( 'iPhone' ) > -1 || agent.indexOf( 'iPad' ) > -1 ) && start > -1 ){
        return agent.replace( '_', '.' );
    }
    return "";
}


//---------------------------------------------------------------------------------
//- MINTEGRAL

let gameCloseMintegral = false;
function appGameEnd(){	
	if(!gameCloseMintegral && adPlatform.value=="mintegral"){
		gameCloseMintegral = true;
		window.gameEnd && window.gameEnd();	
	}				
}

//---------------------------------------------------------------------------------
//- LANGUAGE

let language = getBrowserLanguage();
let li;

if(params.language.value != "auto"){
	language = params.language.value;
}

if(!texts[language]){		
	if(language.indexOf("-") != -1){
		let langeuaeE = language.split('-')[1];
		language = language.split('-')[0];		
		if(language=="zh"){
			if(langeuaeE=="tw"){
				language = "zh_tw";				
			}else{
				language = "zh_cn";
			}		
		}
	}				
	if(!texts[language]){
		language = "en";
	}
}

for(li in texts[language]){
	if(!params[li]){ params[li] = {}; }	
	params[li].value = texts[language][li];					
}

function getBrowserLanguage() {
	let nav = window.navigator,
	browserLanguagePropertyKeys = ['language', 'browserLanguage', 'systemLanguage', 'userLanguage'],
	i,
	language;

	if (Array.isArray(nav.languages)) {
		for(i = 0; i < nav.languages.length; i++) {
			language = nav.languages[i];
			if (language && language.length) {
				return language.toLowerCase();
			}			
		}		
	}

	for (i = 0; i < browserLanguagePropertyKeys.length; i++) {
		language = nav[browserLanguagePropertyKeys[i]];
		if(language && language.length) {
			return language.toLowerCase();
		}
	}
	
	return null;
};

//---------------------------------------------------------------------------------
//- Animation Mixer

function addAnimationMixer(obj3d, animations=obj3d.v_data.animations, loopType=THREE.LoopRepeat) {	
	let anim = {
		name: null,
		mixer: new THREE.AnimationMixer(obj3d),
		action: {},
		set: threeActionSetState,
		seek(time) {
			this.action[this.name].time = time;
		}
	}

	for (let i = 0; i < animations.length; i++) {		
		let animName = animations[i].name;		
		let animationClip = anim.mixer.clipAction(animations[i]);
		anim.action[animName] = animationClip;		
		animationClip.name = animName;
		animationClip.clampWhenFinished = true;
		animationClip.setLoop(loopType);
	}

	app.animations.push(anim.mixer);
	obj3d.anim = anim;
}

function threeActionSetState(name, fadeTime=0.1) {
	if (this.name && this.name != name) {		
		this.action[this.name].fadeOut(fadeTime);
	}
	this.name = name;
	this.action[name].reset();	
	this.action[name].fadeIn(fadeTime);
	this.action[name].play();		
}

//---------------------------------------------------------------------------------
//- playSound

function playSound(name, loop=false, volume, rate){
	if(params.playSounds.value) {
		assets.sounds[name]._loop = loop;
		assets.sounds[name].play();

		if (volume != undefined) 
			assets.sounds[name].volume(volume);

		if (rate != undefined) 
			assets.sounds[name].rate(rate);
	}
}

function playSoundSprite(_name){
	if(params.playSounds.value){
		assets.sounds[_name].play("main");
	}
}

function fadeSound(_name, _from, _to, _tm){
	if(params.playSounds.value){
		assets.sounds[_name].fade(_from, _to, _tm);
	}
}

function stopSound(_name){
	if(params.playSounds.value){
		assets.sounds[_name].stop();
	}
}

//---------------------------------------------------------------------------------
//- distancePointToPoint

function distanceXY(x0, y0, x1, y1) {
	return Math.sqrt((x0-x1)*(x0-x1)+(y0-y1)*(y0-y1));
}

function getDistanceBetween(obj1, obj2) {
    let dx = obj2.position.x - obj1.position.x;
    let dz = obj2.position.z - obj1.position.z;
    let dd = Math.sqrt(dx*dx + dz*dz);
    return dd;
}

function getAngleBetween(obj1, obj2) {
    let dx = obj2.position.x - obj1.position.x;
    let dz = obj2.position.z - obj1.position.z;
    return Math.atan2(dx, dz);
}

//---------------------------------------------------------------------------------
//- sortY

function sortY( a, b ) {
	if ( a.y < b.y ){
		return -1;
	}
	if ( a.y > b.y ){
		return 1;
	}
	return 0;
}

//---------------------------------------------------------------------------------
//- position3dTo2d

function position3dTo2d(obj3d, obj2d) {
	let vector = position3dTo2d.vector;

	obj3d.updateMatrixWorld();
	vector.setFromMatrixPosition(obj3d.matrixWorld);
	vector.project(app.camera3d);

	obj2d.x = vector.x * app.canvasWidth * 0.5 / obj2d.parent.scale.y;
	obj2d.y = -vector.y * app.canvasHeight * 0.5 / obj2d.parent.scale.y;
};
//position3dTo2d.vector = new THREE.Vector3();

//---------------------------------------------------------------------------------
//- 

function randomInteger(min, max) {
	let rand = min + Math.random() * (max + 1 - min);
	return Math.floor(rand);
}

function getRandomItem(arr) {
	let idx = Math.floor(arr.length * Math.random());
	return arr[idx];
}

function removeFromArray(item, arr) {
	let idx = arr.indexOf(item);
	if (idx != -1) arr.splice(idx, 1);
}

function mixArray(array) {
	let currentIndex = array.length, temporaryValue, randomIndex;

	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

//---------------------------------------------------------------------------------
//- RAF

let raf_lastTime = 0;
let raf_vendors = ['ms', 'moz', 'webkit', 'o'];
for(let x = 0; x < raf_vendors.length && !window.requestAnimationFrame; ++x) {
	window.requestAnimationFrame = window[raf_vendors[x]+'RequestAnimationFrame'];
	window.cancelAnimationFrame = window[raf_vendors[x]+'CancelAnimationFrame'] || window[raf_vendors[x]+'CancelRequestAnimationFrame'];
} 
if (!window.requestAnimationFrame){
	window.requestAnimationFrame = function(callback, element) {
		let currTime = new Date().getTime();
		let timeToCall = Math.max(0, 16 - (currTime - raf_lastTime));
		let id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
		raf_lastTime = currTime + timeToCall;
		return id;
	};
}	
if (!window.cancelAnimationFrame){
	window.cancelAnimationFrame = function(id) {
		clearTimeout(id);
	};
}

//---------------------------------------------------------------------------------
//- ENTER FRAME

function initAppEventEnterFrame() {
	let timeCurrent = 0;
	let timeOld = 0;
	let timeResize = 0;
	let timeResizeMax = 10;

	function enterFrame() {
		timeCurrent = performance.now();				
		if(timeCurrent - timeOld > app.frameDuratioMs) {
			if(!app.isPause) {
				timeOld = timeCurrent;	
				app.enterFrame();
			}				
			
			//app.renderer3d.render(app.scene3d, app.camera3d);
			app.renderer2d.render(app.scene2d);					
			
			timeResize++;
			if(timeResize >= timeResizeMax){
				timeResize = 0;				
				if(app.mainWidth != Math.ceil(window.innerWidth) || app.mainHeight != Math.ceil(window.innerHeight)) {
					app.resize();
				}
			}
		}		
		
		window.requestAnimationFrame(enterFrame);
	}

	enterFrame();
}

//---------------------------------------------------------------------------------
//- RESIZE

function initWindowEventResize(){
	app.resize();
	window.addEventListener('resize', app.resize);
}

//---------------------------------------------------------------------------------
//- GLOBAL TOUCH

function initWindowEventTouch(){
	if(params.modeClicks.value != 0){
		window.addEventListener('touchstart', function(e) {
			app.numClicks++;
			if(app.numClicks >= params.modeClicks.value){				
				clickAd();	
			}
		});
	}
}

//---------------------------------------------------------------------------------
//- FOCUS

let hidden, state, visibilityChange; 
if (typeof document.hidden !== "undefined") {
	hidden = "hidden";
	visibilityChange = "visibilitychange";
	state = "visibilityState";
} else if (typeof document.mozHidden !== "undefined") {
	hidden = "mozHidden";
	visibilityChange = "mozvisibilitychange";
	state = "mozVisibilityState";
} else if (typeof document.msHidden !== "undefined") {
	hidden = "msHidden";
	visibilityChange = "msvisibilitychange";
	state = "msVisibilityState";
} else if (typeof document.webkitHidden !== "undefined") {
	hidden = "webkitHidden";
	visibilityChange = "webkitvisibilitychange";
	state = "webkitVisibilityState";
}

function initWindowEventFocus(){
	window.addEventListener(visibilityChange, documentVisibilityChange, false);
	window.addEventListener('blur', windowOnBlur);
	window.addEventListener('focus', windowOnFocus);
	if(adPlatform.value == "vungle"){
		window.addEventListener('ad-event-pause', windowOnBlur);
		window.addEventListener('ad-event-resume', windowOnFocus);
	}
}

function documentVisibilityChange(){    
	if(document[hidden] || document[state]=="hidden"){	
		app.isPause = true;
		
		try{ Howler.mute(true); }catch(e){}	
		try{ gsap.globalTimeline.pause() }catch(e){}	
	}else{
		if(adPlatform.value != "ironsource_dapi"){
			app.isPause = false;		
			try{ gsap.globalTimeline.resume(); }catch(e){}	 
			
			if(app.isSounds){
				try{ Howler.mute(false); }catch(e){}
			}
		} 
	}
}

function windowOnBlur(){    
	app.isPause = true;
	
	try{ Howler.mute(true); }catch(e){}	 	
	try{ gsap.globalTimeline.pause() }catch(e){}	
}

function windowOnFocus(){    
	if(adPlatform.value != "ironsource_dapi"){
		app.isPause = false;
		try{ gsap.globalTimeline.resume(); }catch(e){}	

		if(app.isSounds){
			try{ Howler.mute(false); }catch(e){}	
		}
	}	 
}

