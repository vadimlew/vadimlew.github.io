export default class FailScreen {
    display;

    constructor() {
        this.display = new PIXI.Container();

        let bg = new PIXI.Graphics();
        bg.beginFill(0xAF4035);
        bg.drawRect(-1024, -1024, 2048, 2048);
        bg.endFill();

        let failText = new PIXI.Text('GAME OVER!', {
            fill: 0xffffff,
            fontSize: 150,
            fontWeight: 'bold',
            fontFamily: 'Roboto'
        });
        failText.y = -200;
        failText.anchor.set(0.5);

        let resultText = new PIXI.Text('RESULT: 0 / 0', {
            fill: 0xbbbbbb,
            fontSize: 100,
            fontWeight: 'bold',
            fontFamily: 'Roboto'
        });
        resultText.y = 0;
        resultText.anchor.set(0.5);
        this.resultText = resultText;
       
        this.display.addChild(bg, failText, resultText);
    }    

    show = (result, total) => {
        this.resultText.text = `RESULT: ${result} / ${total}`;
        gsap.from(this.display, 0.5, {alpha:0});
    }
}