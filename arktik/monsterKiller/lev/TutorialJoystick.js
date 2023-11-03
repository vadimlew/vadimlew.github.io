class TutorialHand {
    tutorialText;
    display;
    hand;
    
    radius = 132;
    angle = 0;

    constructor() {
        this.initDisplay();
        app.scene2d.on('pointerdown', this.stageDownHandler);
        app.update.add( this.update );
    }

    initDisplay() {
        this.display = new PIXI.Container();

        let handAnim = new PIXI.Container();

        let infinitySign = new PIXI.Sprite( assets.textures.pixi['ui_cursor_path'] );
        infinitySign.anchor.set( 0.5 );
        infinitySign.alpha = 0.7;

        let hand = new PIXI.Sprite( assets.textures.pixi['ui_cursor'] );
        hand.anchor.set( 0.15, 0.05 );
        hand.x = -136;

        let tutorialText = PIXIText('Swipe To Move', {
            fontFamily: "font_baloo",
            fontSize: 80,
            color: 0xffffff,
            align: "center",
            valign: "center",
            letterSpacing: -3      
        });

        this.hand = hand;
        this.tutorialText = tutorialText;
        this.handAnim = handAnim;

        handAnim.addChild( infinitySign, hand );
        this.display.addChild( handAnim, tutorialText );        
    }

    stageDownHandler = () => {        
        app.scene2d.off('pointerdown', this.stageDownHandler);
        this.hide();        
    }

    update = () => {
        this.hand.x = this.radius * Math.cos( this.angle );
        this.hand.y = this.hand.x * Math.sin( this.angle );
        this.angle += 5 * Math.PI / 180;

        this.angle %= 2*Math.PI;

        this.hand.angle = this.hand.x / 5;
    }

    onResize( {rightUI, upUI, downUI, orientation} ) {
        if ( orientation === 'portraite' ) {
            this.handAnim.scale.set(1);
            this.handAnim.x = 0;
            this.handAnim.y = downUI - 200;
            this.tutorialText.y = -100;
        } 

        if ( orientation === 'landscape' ) {
            this.handAnim.scale.set(0.6);
            this.handAnim.x = rightUI - 200;
            this.handAnim.y = downUI - 200;
            this.tutorialText.y = -100;
        }
    }

    show() {
        this.display.visible = true;
        gsap.to( this.display, 0.25, {alpha: 1} );
    }

    hide() {        
        gsap.to( this.display, 0.25, {alpha: 0} );
        gsap.set( this.display, {delay: 0.25, visible: false} );
    }
}