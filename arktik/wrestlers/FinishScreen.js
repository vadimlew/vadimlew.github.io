class FinishScreen extends Screen {
    display;
    background;
    choiceCards;
    mainScene;
    speechCaption;
    fireAnim;

    firstPlayer;
    secondPlayer;
    downloadBtn;

    constructor() {
        super();
        this.initScreen();
        app.resizes.add( this.onResize );        
    }

    initScreen() {
        this.display = new PIXI.Container();

        this.background = new PIXI.Sprite( assets.textures.pixi.finishStage );
        this.background.anchor.set( 0.5, 0.5 );
        this.display.addChild( this.background );
        
        this.mainScene = new PIXI.Container();
        this.display.addChild( this.mainScene );
        
        this.speechCaption = new PIXI.Container();
        this.mainScene.addChild( this.speechCaption );
        this.speechCaption.visible = false;      
        
        let speechBaloon = new PIXI.Sprite( assets.textures.pixi.speechBaloon );
        speechBaloon.anchor.set( 0.5, 1 );
        speechBaloon.scale.set( 0.4, 0.35 );
        speechBaloon.visible = true;
        
        let speech = new PIXI.Sprite( assets.textures.pixi.speech );
        speech.anchor.set( 0.5, 1 );
        speech.scale.set( 0.4, 0.35 );
        speech.visible = true;

        this.speechCaption.addChild( speechBaloon, speech );

        this.fireAnim = createAnimSprite( assets.textures.pixi['fire'], fireSheetData, 'fire' );	
	    this.fireAnim.anchor.set(0.5, 0.5);
        this.fireAnim.scale.set(3, 3);
        this.fireAnim.visible = false;
        this.mainScene.addChild( this.fireAnim );        

        this.firstPlayer = new PIXI.Sprite( assets.textures.pixi.characterChris )
        this.firstPlayer.anchor.set( 0.5, 0.5 );
        this.firstPlayer.scale.set( 0.85, 0.85 );
        this.firstPlayer.visible = false;
        this.mainScene.addChild( this.firstPlayer );

        this.secondPlayer = new PIXI.Sprite( assets.textures.pixi.characterMjf )
        this.secondPlayer.anchor.set( 0.5, 0.5 );
        this.secondPlayer.scale.set( 0.85, 0.85 );
        this.secondPlayer.visible = false;
        this.mainScene.addChild( this.secondPlayer );

        this.downloadBtn = new PIXI.Sprite(assets.textures.pixi.downloadBtn);
        this.mainScene.addChild( this.downloadBtn );
        this.downloadBtn.anchor.set( 0.5, 0.5 );	
        this.downloadBtn.interactive = true;
        this.downloadBtn.on( 'pointertap', clickAd );        	

    }

    enter( object ) {
        console.log('enter from finish screen');

        switch (object.playerName ) {
            case 'Chris':
                this.firstPlayer.visible = true;
                gsap.from( this.firstPlayer, 0.5, {alpha: 0} );
                gsap.from( this.firstPlayer.scale, 0.5, {x:0, y:0, ease: "back.out"} );

                this.fireAnim.visible = true;
                this.fireAnim.play();                
                gsap.from( this.fireAnim, 0.7, {alpha: 0, repeat: 1, yoyo: true});       
                gsap.delayedCall( 1, () => {
                    gsap.from( this.speechCaption.scale, 0.8, {x:0, y:0, ease: "back.out"} );
                    this.speechCaption.visible = true;
                    gsap.from( this.speechCaption, 1, {alpha: 0, ease: "back.out"});
                })
                break;

            case 'MJF':
                this.secondPlayer.visible = true;
                gsap.from( this.secondPlayer, 0.5, {alpha: 0} );
                gsap.from( this.secondPlayer.scale, 0.5, {x:0, y:0, ease: "back.out"} );

                this.fireAnim.visible = true;
                this.fireAnim.play();                
                gsap.from( this.fireAnim, 0.7, {alpha: 0, repeat: 1, yoyo: true});       
                gsap.delayedCall( 1, () => {
                    gsap.from( this.speechCaption.scale, 0.8, {x:0, y:0, ease: "back.out"} );
                    this.speechCaption.visible = true;
                    gsap.from( this.speechCaption, 1, {alpha: 0, ease: "back.out"});
                })            
                break;
        }
    }

    exit() {
        console.log('exit from finish screen')
    }
    
    onResize = ({ isPortraite, leftUI, rightUI, upUI, downUI }) => {               
        if (isPortraite) {
            this.background.height = downUI - upUI;
            this.background.width = 1917 * this.background.height/3000;

            this.firstPlayer.x = 30;
            this.firstPlayer.y = 0;
            this.secondPlayer.x = 30;
            this.secondPlayer.y = 0;

            this.downloadBtn.x = 0;
            this.downloadBtn.y = downUI - 120;

            this.speechCaption.x = 0;
            this.speechCaption.y = this.firstPlayer.x - 400;

            this.fireAnim.x = 30;
            this.fireAnim.y = this.firstPlayer.x - 360;
        } else {            
            this.background.width = rightUI - leftUI;
            this.background.height = 3000 * this.background.width/1917;
            
            this.firstPlayer.x = 30;
            this.firstPlayer.y =  240;
            this.secondPlayer.x = 20;
            this.secondPlayer.y = 240;

            this.downloadBtn.x = rightUI - 210;
            this.downloadBtn.y = downUI - 100;
            
            this.speechCaption.x = 0;
            this.speechCaption.y = this.firstPlayer.x - 140;

            this.fireAnim.x = 30;
            this.fireAnim.y = this.firstPlayer.x - 110;
        }
    }
}

