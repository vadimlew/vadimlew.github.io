class FullScreenCTA {
    display;

    constructor ( onClickCallBack ) {
        this.#initDisplay();

        this.display.interactive = true;
        this.display.on( 'pointertap', onClickCallBack );
    }

    #initDisplay () {
        let rectangleShape = new PIXI.Graphics();
        rectangleShape.beginFill( 0x121214, 1 );
        rectangleShape.drawRect( -1280 * 0.5, -1280 * 0.5, 1280, 1280 );
        rectangleShape.endFill();
        rectangleShape.alpha = 0;
        rectangleShape.visible = false;

        this.display = rectangleShape;
    }

    onResize ( leftUI, rightUI, upUI, downUI ) {
        this.display.width = rightUI - leftUI;
        this.display.height = downUI - upUI;
    }
}