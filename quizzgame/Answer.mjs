export default class Answer {
    display;
    width ;
    height;
    round = 8;
    pad = 20;

    constructor({width, height, variants, correctId}) {
        this.width = width;
        this.height = height;        
        this.correctId = correctId;
        this.display = new PIXI.Container();              

        for (let i=0; i<4; i++) {
            let button = this.createAnswerButton(variants[i]);
            button.x = -this.pad/2 - button.width/2 + (i % 2) * (button.width + this.pad);
            button.y = -this.pad/2 - button.height/2 + Math.floor(i / 2) * (button.height + this.pad);
            this.display.addChild(button);
        }        
    }

    createAnswerButton(txt='') {
        let width = this.width/2 - this.pad;
        let height = this.height/2 - this.pad;        

        let button = new PIXI.Graphics();
        button.beginFill(0x227ba2);        
        button.drawRoundedRect(-width/2, -height/2, width, height, this.round);
        button.endFill();        

        let frameGreen = new PIXI.Graphics();
        frameGreen.alpha = 0;
        frameGreen.beginFill(0x00dd00);
        frameGreen.drawRoundedRect(-width/2, -height/2, width, height, this.round);
        button.addChild(frameGreen);

        let frameRed = new PIXI.Graphics();
        frameRed.alpha = 0;
        frameRed.beginFill(0xdd0000);
        frameRed.drawRoundedRect(-width/2, -height/2, width, height, this.round);
        button.addChild(frameRed);

        let text = new PIXI.Text(txt, {
            fontFamily: 'Roboto',
            fill: 0xffffff,
            fontSize: 70
        });
        text.anchor.set(0.5);
        button.addChild(text);

        button.frameGreen = frameGreen;
        button.frameRed = frameRed;

        button.eventMode = 'dynamic';
        button.on('pointertap', this.buttonTapHandler);

        return button;
    }    

    buttonTapHandler = (e) => {
        let button = e.currentTarget;
        let id = this.display.children.indexOf(button);

        for (let i=0; i<4; i++) {
            let button = this.display.children[i];
            button.eventMode = 'none';
        }

        this.display.emit('taped');

        if (id == this.correctId) {            
            gsap.to(button.frameGreen, 0.5, {alpha:1});
            this.display.emit('correct');
        } else {
            let correctButton = this.display.children[this.correctId];
            gsap.to(button.frameRed, 0.5, {alpha:1});
            gsap.to(correctButton.frameGreen, 0.5, {alpha:1, delay:0.5});
            this.display.emit('wrong');
        }
    }
}