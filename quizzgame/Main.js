import Space from './Space.mjs';
import Question from './Question.mjs';
import Answer from './Answer.mjs';
import {questionsData} from './DataQuestion.mjs';
import WinScreen from './WinScreen.js';
import FailScreen from './FailScreen.js';

let app = new PIXI.Application({
	backgroundColor: 0x111111, // 0x ff 00 00 
	antialias: true,
	resizeTo: window
});
document.body.appendChild(app.view);

let main = new PIXI.Container();
app.stage.addChild(main);

let space = new Space(500, 1000);
space.display.on('gameover', gameOver);
main.addChild(space.display);

let questionPlace = new PIXI.Container();
let answerPlace = new PIXI.Container();
main.addChild(questionPlace);
main.addChild(answerPlace);

let winScreen = new WinScreen();
let failScreen = new FailScreen();

let score = 0;
let total = questionsData.length;
let questions = [];
let answers = [];
let questionId = 0;

for (let data of questionsData) {
	let question = new Question(1000, 1000, data.text);
	let answer = new Answer({width:1000, height:450, variants:data.variants, correctId:data.correctId});

	questions.push(question);
	answers.push(answer);
}

function show() {
	questionPlace.removeChildren();
	answerPlace.removeChildren();	

	let question = questions[questionId].display;
	let answer = answers[questionId].display;
	questionPlace.addChild(question);
	answerPlace.addChild(answer);
	
	gsap.from(question, 0.5, {alpha:0, ease:'sine.out'});
	answer.children.forEach((btn, i) => {
		gsap.from(btn.scale, 0.25, {x:0, y:0, ease:'sine.out', delay:i*0.05});
	})

	answer.on('taped', answerTapHandler);
	answer.on('correct', correctAnswer);
}

function correctAnswer() {
	score++;
	space.blastAsteroid();
}

function gameOver() {
	hide();
	//gsap.delayedCall(1, ()=>{
		main.addChild(failScreen.display);
		failScreen.show(score, total);
	//});
}

function hide() {
	let question = questions[questionId].display;
	let answer = answers[questionId].display;

	answer.off('taped', answerTapHandler);
	answer.off('correct', correctAnswer);

	gsap.to(question, 0.25, {alpha:0, ease:'sine.out'});
	answer.children.forEach((btn, i) => {
		gsap.to(btn.scale, 0.25, {x:0, y:0, ease:'sine.out', delay:i*0.05});
	})

	questionId++;
}

show();

function answerTapHandler() {
	gsap.delayedCall(1.5, hide);	

	if (questionId+1 >= questions.length) {		
		gsap.delayedCall(2, ()=>{
			main.addChild(winScreen.display);
			winScreen.show(score, total)
		});		
	} else {
		gsap.delayedCall(2, show);
	}	
}

window.addEventListener('resize', resizeHandler);
function resizeHandler() {
	let width = window.innerWidth;
	let height = window.innerHeight;

	main.x = width/2;
	main.y = height/2;		

	let isPortraite = width <= height;

	if (isPortraite) {
		let scale = Math.min(width/1024, height/2048);
		main.scale.set(scale);

		questionPlace.x = 0;
		questionPlace.y = -500;
		
		space.display.angle = 90;
		space.display.x = 0;
		space.display.y = 750;
		
		answerPlace.x = 0;
		answerPlace.y = 250;
	} else {		
		let scale = Math.min(width/2048, height/1024);
		main.scale.set(scale);

		questionPlace.x = -500;
		questionPlace.y = 0;

		space.display.angle = 90;
		space.display.x = 510;
		space.display.y = -250;
		
		answerPlace.x = 510;
		answerPlace.y = 280;
	}	
}
resizeHandler();


function gameLoop() {
	space.update();
	requestAnimationFrame(gameLoop);
}
gameLoop();

/*async function loadQuestions() {
	let response = await fetch("questions.json");
    let json = await response.json();
    console.log(json);	
} 
loadQuestions();*/


function createAnimSprite(texture, sheetData) {
	if (sheetData.hasOwnProperty('row')) {
		let col = sheetData.col;
		let row = sheetData.row;
		let w = texture.width/col;
		let h = texture.height/row;
		let len = col*row;
		sheetData = {frames:{}, animations:{anim:[]}, meta:{scale:1}};

		for (let i=0; i < len; i++) {
			let name = 'sheet_frame' + i;
			let x = w*(i%col);
			let y = h*parseInt(i/col);
			sheetData.frames[name] = {frame:{x,y,w,h}, sourceSize:{w,h}};
			sheetData.animations.anim.push(name);
		}
	}	

	let spriteSheet = new PIXI.Spritesheet(texture, sheetData);
	spriteSheet.parse(()=>{});	
	
	let animSprite = new PIXI.AnimatedSprite(spriteSheet.animations['anim']);
	animSprite.animationSpeed = 0.3;
	//animSprite.play();

	return animSprite;
}

globalThis.app = app;
app.createAnimSprite = createAnimSprite;