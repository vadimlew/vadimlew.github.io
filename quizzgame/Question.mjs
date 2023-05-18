import TextParser from "./TextParser.mjs";

export default class Question {
    display;
    width;
    height;
    round = 0//8;

    constructor(width = 300, height = 512, questionString) {
        this.width = width;
        this.height = height;
        this.display = new PIXI.Container();

        let textColors = TextParser.parse(questionString);        

        let bg = new PIXI.Graphics();
        bg.beginFill(0x222222);        
        bg.drawRoundedRect(-width/2, -height/2, width, height, this.round);
        bg.endFill();
        this.display.addChild(bg);

        let text = new PIXI.Text(questionString, {
            fontFamily: 'Roboto',
            fill: 0xffffff,
            fontSize: 60,
            colors: textColors
        });
        text.anchor.set(0.5);
        this.display.addChild(text);
        window.text = text;
    }    
}