export default class WinScreen {
    display;

    constructor() {
        this.display = new PIXI.Container();

        let bg = new PIXI.Graphics();
        bg.beginFill(0x5fd1a5);
        bg.drawRect(-1024, -1024, 2048, 2048);
        bg.endFill();

        let winText = new PIXI.Text('YOU WIN!', {
            fill: 0xffffff,
            fontSize: 150,
            fontWeight: 'bold',
            fontFamily: 'Roboto'
        });
        winText.y = -200;
        winText.anchor.set(0.5);

        let resultText = new PIXI.Text('RESULT: 0 / 0', {
            fill: 0x777777,
            fontSize: 100,
            fontWeight: 'bold',
            fontFamily: 'Roboto'
        });
        resultText.y = 0;
        resultText.anchor.set(0.5);
        this.resultText = resultText;
       
        this.display.addChild(bg, winText, resultText);
    }    

    show = (result, total) => {
        this.resultText.text = `RESULT: ${result} / ${total}`;
        gsap.from(this.display, 0.5, {alpha:0});
    }
}