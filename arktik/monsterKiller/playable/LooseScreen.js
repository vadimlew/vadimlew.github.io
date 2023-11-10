class LooseScreen extends PIXI.Container {
    constructor() {
        super();
        this.initDisplay();
        this.visible = false;
    }

    initDisplay() {
        this.solid = new PIXI.Graphics();
        this.solid.beginFill(0x444444, 0.5);
        this.solid.drawRect(-720, -720, 1440, 1440);

        this.veniete = new PIXI.Sprite( assets.textures.pixi.veniete );
        this.veniete.anchor.set(0.5);
        this.veniete.alpha = 0.8;

        this.initLogo();

        this.defeatTxt = new PIXI.Sprite( assets.textures.pixi.defeatText );
        this.defeatTxt.anchor.set(0.5);

        this.playNowBtn = new PIXI.Sprite( assets.textures.pixi.playNowBtn );
        this.playNowBtn.anchor.set(0.5);
        this.playNowBtn.interactive = true;
        this.playNowBtn.on( 'pointerdown', clickAd );

        this.addChild( this.solid, this.veniete, this.logo, this.defeatTxt, this.playNowBtn );
    }

    initLogo() {
        this.logo = new PIXI.Container(); 
        this.logo.scale.set(0.85);       

        this.logoBg = new PIXI.Sprite( assets.textures.pixi.logoBg );
        this.logoBg.anchor.set(0.5);

        this.pistolRight = new PIXI.Sprite( assets.textures.pixi.pistolRight );
        this.pistolRight.anchor.set(0.5);
        this.pistolRight.x = 50;
        this.pistolRight.y = 25;

        this.pistolLeft = new PIXI.Sprite( assets.textures.pixi.pistolLeft );
        this.pistolLeft.anchor.set(0.5);
        this.pistolLeft.x = -50;
        this.pistolLeft.y = 25;

        this.logoText = new PIXI.Sprite( assets.textures.pixi.logoText );
        this.logoText.anchor.set(0.5);
        this.logoText.y = 25;

        this.shine = new PIXI.Sprite( assets.textures.pixi.shine );
        this.shine.anchor.set(0.5);
        this.shine.angle = 55;
        this.shine.x = -500;

        let mask = new PIXI.Sprite( assets.textures.pixi.logoText );       
        mask.y = 25;
        mask.anchor.set(0.5);
        this.shine.mask = mask;

        this.logoText.addChild( this.shine );

        this.logo.addChild( this.logoBg, this.pistolRight, this.pistolLeft, this.logoText, mask );        
    }    

    show() {
        playSound( 'lose' );
        let delay = 0.5;
        this.visible = true;

        gsap.from( this.solid, 0.5, { alpha: 0} );
        gsap.from( this.veniete, 0.5, { alpha: 0} );

        gsap.from( this.logo.scale, 0.5, { x: 0.0, y: 0.0, ease: 'back.out', delay: delay } );
        gsap.from( this.pistolLeft, 0.5, { x: -150.0, y: 100.0, alpha: 0, ease: 'back.out', delay: delay+0.2 } );
        gsap.from( this.pistolRight, 0.5, { x: 150.0, y: 100.0, alpha: 0, ease: 'back.out', delay: delay+0.3 } );

        gsap.from( this.logoText, 0.5, { alpha: 0, delay: delay+0.5 } );
        gsap.from( this.logoText.scale, 0.5, { x: 2.0, y: 2.0, ease: 'back.out', delay: delay+0.5 } );
        gsap.to( this.shine, 1.5, { x: 550, repeat: -1, repeatDelay: 0.5, delay: delay+1.0 } );

        gsap.from( this.defeatTxt, 1.0, { alpha: 0, delay: 0.0 } );

        gsap.from( this.playNowBtn.scale, 0.5, { x: 0.0, y: 0.0, ease: 'back.out', delay: delay+0.5 } );
        gsap.to( this.playNowBtn.scale, 0.5, { x: 0.9, y: 0.9, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: delay+1.0 } );
    }

    onResize( {leftUI, rightUI, upUI, downUI, orientation} ) {
        if ( orientation === 'portraite' ) {
            this.logo.scale.set(0.9);

            this.logo.x = 0;
            this.logo.y = upUI + 300;

            this.defeatTxt.x = 0;
            this.defeatTxt.y = 75;
           
            this.playNowBtn.x = 0;
            this.playNowBtn.y = downUI - 200;
        } 

        if ( orientation === 'landscape' ) {
            this.logo.scale.set(0.8);

            this.logo.x = -300;
            this.logo.y = 0;

            this.defeatTxt.x = 300;
            this.defeatTxt.y = -60;
            
            this.playNowBtn.x = 300;
            this.playNowBtn.y = 110;
        }

        this.veniete.width = rightUI - leftUI;
        this.veniete.height = upUI - downUI;

        this.solid.width = rightUI - leftUI;
        this.solid.height = upUI - downUI;
    }
}