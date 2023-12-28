class SelectScreen extends Screen {
    display;
    background;
    choiceCards;
    fightCaption;
    tutorPlayer;
    tutorEnemy;
    contours;
    fireAnimUp;
    fireAnimDown;

    choosePlayerCaption;
    chooseEnemyCaption;
    playerCaption;
    opponentCaption;    

    firstPlayerCard;
    secondPlayerCard;
    firstEnemyCard;
    secondEnemyCard;

    firstPlayerPresentation;
    secondPlayerPresentation;
    firstEnemyPresentation;
    secondEnemyPresentation;

    firstChoicePlayer;
    secondChoicePlayer;
    firstChoiceOpponent;
    secondChoiceOpponent;

    contourPlayer;
    contourEnemy;

    selectedWrestless = {};
    firstTutorCards = {};
    secondTutorCards = {};

    constructor() {
        super();
        this.initScreen();
        app.resizes.add( this.onResize );
    }

    initScreen() {
        this.display = new PIXI.Container();

        this.background = new PIXI.Sprite( assets.textures.pixi.background );
        this.display.addChild( this.background );
        this.background.anchor.set( 0.5, 0.5 );

        this.initChoiceCards();     
        this.initTutor();             
    }

    initChoiceCards() {
        let filterOutline = new PIXI.filters.OutlineFilter( 4, 0xffffff);
        filterOutline.padding = 10;

        

        this.choiceCards = new PIXI.Container();
        this.display.addChild( this.choiceCards );
        this.choiceCards.filters = [filterOutline]; 

        let cardsBackground = new PIXI.Sprite( assets.textures.pixi.cardsBackground ); 
        cardsBackground.anchor.set( 0.5, 0.5 );
        cardsBackground.scale.x = 0.7;
        this.choiceCards.addChild( cardsBackground );

        this.initCharactersPresentation();        
        this.initFireAnim(); 
        this.initCaptions();
        this.initChoiceBanners();
        
        this.initContours();             
                
        this.firstPlayerCard = new PIXI.Sprite( assets.textures.pixi.chrisCard );
        this.firstPlayerCard.anchor.set( 0.5, 0.5 );
        this.firstPlayerCard.x = -this.firstPlayerCard.width/2 - this.firstPlayerCard.width/10;       
        this.firstPlayerCard.scale.set( 0.95, 0.95 );       
        this.firstPlayerCard.y = -40;        
        this.firstPlayerCard.name = 'Chris';
        this.firstPlayerCard.interactive = true;
        this.firstPlayerCard.on( 'pointertap', this.onCardTap );
        
        this.secondPlayerCard = new PIXI.Sprite( assets.textures.pixi.mjfCard );
        this.secondPlayerCard.anchor.set( 0.5, 0.5 );
        this.secondPlayerCard.x = this.secondPlayerCard.width/2 + this.secondPlayerCard.width/10;
        this.secondPlayerCard.y = -40;
        this.secondPlayerCard.scale.set( 0.95, 0.95 );
        this.secondPlayerCard.name = 'MJF';
        this.secondPlayerCard.interactive = true;
        this.secondPlayerCard.on( 'pointertap', this.onCardTap );

        this.choiceCards.addChild( this.firstPlayerCard, this.secondPlayerCard );
        
        this.firstEnemyCard = new PIXI.Sprite( assets.textures.pixi.ortizCard );
        this.firstEnemyCard.anchor.set( 0.5, 0.5 );
        this.firstEnemyCard.x = -this.firstEnemyCard.width/2 - this.firstEnemyCard.width/10;
        this.firstEnemyCard.y = -40;
        this.firstEnemyCard.scale.set( 0.95, 0.95 );
        this.firstEnemyCard.name = 'Ortiz';
        this.firstEnemyCard.visible = false;
        this.firstEnemyCard.interactive = true;
        this.firstEnemyCard.on( 'pointertap', this.onCardTap );
        
        this.secondEnemyCard = new PIXI.Sprite( assets.textures.pixi.reyCard );
        this.secondEnemyCard.anchor.set( 0.5, 0.5 );
        this.secondEnemyCard.x = this.secondPlayerCard.width/2 + this.secondPlayerCard.width/10;
        this.secondEnemyCard.y = -40;
        this.secondEnemyCard.scale.set( 0.95, 0.95 );
        this.secondEnemyCard.name = 'Rey';
        this.secondEnemyCard.visible = false;
        this.secondEnemyCard.interactive = true;
        this.secondEnemyCard.on( 'pointertap', this.onCardTap );

        this.choiceCards.addChild( this.firstEnemyCard, this.secondEnemyCard );
    }

    initCharactersPresentation() {                
        let filterOutline = new PIXI.filters.OutlineFilter( 3, 0xffffff);
        filterOutline.padding = 10;

        this.playerPresentation = new PIXI.Container();
        this.display.addChild( this.playerPresentation );
        this.playerPresentation.filters = [filterOutline]; 

        this.firstPlayerPresentation = new PIXI.Sprite( assets.textures.pixi.chris );
        this.firstPlayerPresentation.anchor.set( 0.5, 1 );
        this.firstPlayerPresentation.scale.x = -1;
        this.firstPlayerPresentation.visible = false;

        this.secondPlayerPresentation = new PIXI.Sprite( assets.textures.pixi.mjf );
        this.secondPlayerPresentation.anchor.set( 0.5, 1 );
        this.secondPlayerPresentation.scale.x = -1;
        this.secondPlayerPresentation.visible = false;

        this.playerPresentation.addChild( this.firstPlayerPresentation, this.secondPlayerPresentation);

        this.enemyPresentation = new PIXI.Container();
        this.display.addChild( this.enemyPresentation );
        this.enemyPresentation.filters = [filterOutline];

        this.firstEnemyPresentation = new PIXI.Sprite( assets.textures.pixi.ortiz );
        this.firstEnemyPresentation.anchor.set( 0.5, 1 );
        this.firstEnemyPresentation.visible = false;

        this.secondEnemyPresentation = new PIXI.Sprite( assets.textures.pixi.rey );
        this.secondEnemyPresentation.anchor.set( 0.5, 1 );
        this.secondEnemyPresentation.visible = false;

        this.enemyPresentation.addChild( this.firstEnemyPresentation, this.secondEnemyPresentation);
    }

    initFireAnim() {        
        this.fireAnimation = new PIXI.Container();
        this.display.addChild( this.fireAnimation );

        this.fireAnimUp = createAnimSprite( assets.textures.pixi['fire'], fireSheetData, 'fire' );	
	    this.fireAnimUp.anchor.set(0.5, 1);
        this.fireAnimUp.scale.set(4, 4);
        this.fireAnimUp.visible = false;
        this.fireAnimUp.hitArea = new PIXI.Rectangle(0, 0, 0, 0);
        
        this.fireAnimDown = createAnimSprite( assets.textures.pixi['fire'], fireSheetData, 'fire' );	
	    this.fireAnimDown.anchor.set(0.5, 1);
        this.fireAnimDown.scale.set(4, 4);
        this.fireAnimDown.visible = false;
        this.fireAnimDown.hitArea = new PIXI.Rectangle(0, 0, 0, 0);

        this.playerPresentation.addChild( this.fireAnimUp );
        this.enemyPresentation.addChild( this.fireAnimDown )        
    }

    initContours() {
        let filterOutline = new PIXI.filters.OutlineFilter( 3, 0xffffff);
        filterOutline.padding = 10;

        this.contours = new PIXI.Container();
        this.display.addChild( this.contours );

        this.contourPlayer = new PIXI.Sprite( assets.textures.pixi.contourPlayer );
        this.contourPlayer.anchor.set( 0.5, 1 );
        this.contourPlayer.visible = true;   
        this.contourPlayer.filters = [filterOutline];        
        
        this.contourEnemy = new PIXI.Sprite( assets.textures.pixi.contourEnemy );
        this.contourEnemy.anchor.set( 0.5, 1 );
        this.contourEnemy.visible = true;
        this.contourEnemy.filters = [filterOutline];

        this.contours.addChild( this.contourPlayer, this.contourEnemy );
    }

    initCaptions() {
        this.choosePlayerCaption = new PIXI.Sprite( assets.textures.pixi.choosePlayerCaption );
        this.choosePlayerCaption.anchor.set( 0.5, 0.5 );
        this.choosePlayerCaption.scale.x = 0.7;
        this.choosePlayerCaption.visible = true;
        
        this.chooseEnemyCaption = new PIXI.Sprite( assets.textures.pixi.chooseEnemyCaption );
        this.chooseEnemyCaption.anchor.set( 0.5, 0.5 );
        this.chooseEnemyCaption.scale.x = 0.7;
        this.chooseEnemyCaption.visible = false;
        this.choiceCards.addChild( this.choosePlayerCaption, this.chooseEnemyCaption );
        
        this.playerCaption = new PIXI.Sprite( assets.textures.pixi.playerCaption );
        this.playerCaption.anchor.set( 0.5, 0.5 );
        this.playerCaption.scale.x = 0.7;
        this.playerCaption.x = -165;
        this.playerCaption.visible = false;

        this.opponentCaption = new PIXI.Sprite( assets.textures.pixi.opponentCaption );
        this.opponentCaption.anchor.set( 0.5, 0.5 );
        this.opponentCaption.scale.x = 0.7;
        this.opponentCaption.x = 165;
        this.opponentCaption.visible = false;              

        this.choiceCards.addChild( this.playerCaption, this.opponentCaption );
    }

    initChoiceBanners() {
        this.firstChoicePlayer = new PIXI.Sprite( assets.textures.pixi.chrisCard );
        this.firstChoicePlayer.anchor.set( 0.5, 0.5 );
        this.firstChoicePlayer.x = -this.firstChoicePlayer.width/2 - this.firstChoicePlayer.width/10;        
        this.firstChoicePlayer.y = -40;
        this.firstChoicePlayer.scale.set( 0.95, 0.95 );
        this.firstChoicePlayer.visible = false;

        this.secondChoicePlayer = new PIXI.Sprite( assets.textures.pixi.mjfCard );
        this.secondChoicePlayer.anchor.set( 0.5, 0.5 );
        this.secondChoicePlayer.x = -this.secondChoicePlayer.width/2 - this.secondChoicePlayer.width/10;        
        this.secondChoicePlayer.y = -40;
        this.secondChoicePlayer.visible = false;
        this.secondChoicePlayer.scale.set( 0.95, 0.95 );

        this.choiceCards.addChild( this.firstChoicePlayer, this.secondChoicePlayer );

        this.firstChoiceOpponent = new PIXI.Sprite( assets.textures.pixi.ortizOpponent );
        this.firstChoiceOpponent.anchor.set( 0.5, 0.5 );
        this.firstChoiceOpponent.x = this.firstChoiceOpponent.width/2 + this.firstChoiceOpponent.width/10;        
        this.firstChoiceOpponent.y = -40;
        this.firstChoiceOpponent.scale.set( 0.95, 0.95 ); 
        this.firstChoiceOpponent.visible = false;

        this.secondChoiceOpponent = new PIXI.Sprite( assets.textures.pixi.reyOpponent );
        this.secondChoiceOpponent.anchor.set( 0.5, 0.5 );
        this.secondChoiceOpponent.x = this.secondChoiceOpponent.width/2 + this.secondChoiceOpponent.width/10;        
        this.secondChoiceOpponent.y = -40;
        this.secondChoiceOpponent.scale.set( 0.95, 0.95 );
        this.secondChoiceOpponent.visible = false;

        this.choiceCards.addChild( this.firstChoiceOpponent, this.secondChoiceOpponent );
    }
 
    initTutor() {      
        this.firstTutorCards.firstCard = this.firstPlayerCard;
        this.firstTutorCards.secondCard = this.secondPlayerCard;
        this.secondTutorCards.firstCard = this.firstEnemyCard;
        this.secondTutorCards.secondCard = this.secondEnemyCard;

        this.tutorPlayer = new Tutor( this.firstTutorCards );
        this.display.addChild( this.tutorPlayer.display );
        //this.tutorPlayer.show();     

        this.tutorEnemy = new Tutor( this.secondTutorCards );
        this.display.addChild( this.tutorEnemy.display );
        //this.tutorEnemy.show();        
    }

    enter() {
        console.log('enter from game screen');
        gsap.from( this.contours, 0.9, {alpha: 0});
        //gsap.from( this.countours.scale, 0.8, {x:0, y:0, ease: "back.out"} );
        gsap.from( this.choiceCards, 0.8, {alpha: 0} );
        //gsap.from( this.choiceCards.scale, 0.8, {x:0, y:0, ease: "back.out"} );
        gsap.from( this.firstPlayerCard.scale, 0.8, {x:0, y:0, ease: "back.out"} );
        gsap.from( this.secondPlayerCard.scale, 0.8, {x:0, y:0, ease: "back.out"} );    
    }

    exit() {
        console.log('exit from game screen')
    }
    
    onResize = ({ isPortraite, leftUI, rightUI, upUI, downUI }) => {               
        if (isPortraite) {
            this.background.height = downUI - upUI;
            this.background.width = this.background.height;

            this.firstPlayerPresentation.x = 0;
            this.firstPlayerPresentation.y = -242;
            this.secondPlayerPresentation.x = 0;
            this.secondPlayerPresentation.y = -242;

            this.firstPlayerPresentation.width = this.background.width/4;
            this.firstPlayerPresentation.height = app.canvasHeight/2.6;
            this.secondPlayerPresentation.width = this.background.width/4;
            this.secondPlayerPresentation.height = app.canvasHeight/2.6;

            this.contourPlayer.x = 0;
            this.contourPlayer.y = -242;
            
            this.contourPlayer.width = this.background.width/4;
            this.contourPlayer.height = app.canvasHeight/2.6;
            
            //-----enemy

            this.firstEnemyPresentation.x = 0;
            this.firstEnemyPresentation.y = downUI;
            this.secondEnemyPresentation.x = 0;
            this.secondEnemyPresentation.y = downUI;

            this.firstEnemyPresentation.width = this.background.width/4;
            this.firstEnemyPresentation.height = app.canvasHeight/2.6;
            this.secondEnemyPresentation.width = this.background.width/4;
            this.secondEnemyPresentation.height = app.canvasHeight/2.6;

            this.contourEnemy.x = 0;
            this.contourEnemy.y = downUI;
            
            this.contourEnemy.width = this.background.width/4;
            this.contourEnemy.height = app.canvasHeight/2.6;

            //-----fireAnim

            this.fireAnimUp.x = 20;
            this.fireAnimUp.y = this.contourPlayer.y + 200;

            this.fireAnimDown.x = 20;
            this.fireAnimDown.y = this.contourEnemy.y + 200;

        } else {
            this.background.width = rightUI - leftUI;
            this.background.height = this.background.width;

            this.firstPlayerPresentation.x = leftUI + app.canvasWidth/6;
            this.firstPlayerPresentation.y = downUI;
            this.secondPlayerPresentation.x = leftUI + app.canvasWidth/6;
            this.secondPlayerPresentation.y = downUI;

            this.firstPlayerPresentation.width = this.background.width/4;
            this.firstPlayerPresentation.height = this.background.height/3.2;
            this.secondPlayerPresentation.width = this.background.width/4;
            this.secondPlayerPresentation.height = this.background.height/3.2;

            this.contourPlayer.x = leftUI + app.canvasWidth/6;
            this.contourPlayer.y = downUI;
            this.contourPlayer.width = this.background.width/4;
            this.contourPlayer.height = this.background.height/3.2;

            //-----enemy  

            this.firstEnemyPresentation.x = rightUI - app.canvasWidth/6;
            this.firstEnemyPresentation.y = downUI;
            this.secondEnemyPresentation.x = rightUI - app.canvasWidth/6;
            this.secondEnemyPresentation.y = downUI;
            
            this.firstEnemyPresentation.width = this.background.width/4;
            this.firstEnemyPresentation.height = this.background.height/3.2;
            this.secondEnemyPresentation.width = this.background.width/4;
            this.secondEnemyPresentation.height = this.background.height/3.2;
 
            this.contourEnemy.x = rightUI - app.canvasWidth/6;
            this.contourEnemy.y = downUI;

            this.contourEnemy.width = this.background.width/4;
            this.contourEnemy.height = this.background.height/3.2;
            
            //-----fireAnim

            this.fireAnimUp.x = this.contourPlayer.x;
            this.fireAnimUp.y = this.contourPlayer.y + 180;

            this.fireAnimDown.x = this.contourEnemy.x;
            this.fireAnimDown.y = this.contourEnemy.y + 180;
        }
    }
    
    onCardTap = ( event ) => {
        switch( event.currentTarget.name ) {
            case 'Chris':                
                this.selectedWrestless.playerName = event.currentTarget.name;                
                gsap.to( this.firstPlayerCard.scale, 0.2, {x: 0.8, y: 0.8, repeat: 1, yoyo: true, ease: 'sine.inOut', onComplete: () => {
                    this.firstPlayerCard.visible = false;
                    this.secondPlayerCard.visible = false;                                    
                    this.showEnemyChoice();
                }});
                this.fireAnimUp.visible = true;
                this.fireAnimUp.play();
                gsap.from( this.fireAnimUp, 0.7, {alpha: 0, repeat: 1, yoyo: true});                    
                gsap.delayedCall( 0.5, () => {
                    this.firstPlayerPresentation.visible = true;
                    gsap.from( this.firstPlayerPresentation, 0.5, {alpha: 0});             
                });                
                gsap.to( this.contourPlayer, 0.5, { alpha: 0 });
                gsap.to( this.choosePlayerCaption, 0.4, { alpha: 0 });                
                this.firstPlayerCard.off( 'pointertap', this.onCardTap );
                this.secondPlayerCard.off( 'pointertap', this.onCardTap );
                break;

            case 'MJF':                
                this.selectedWrestless.playerName = event.currentTarget.name;                
                gsap.to( this.secondPlayerCard.scale, 0.2, {x: 0.8, y: 0.8, repeat: 1, yoyo: true, ease: 'sine.inOut', onComplete: () => {
                    this.firstPlayerCard.visible = false;
                    this.secondPlayerCard.visible = false;
                    this.showEnemyChoice();
                }});
                this.fireAnimUp.visible = true;
                this.fireAnimUp.play();
                gsap.from( this.fireAnimUp, 0.7, {alpha: 0, repeat: 1, yoyo: true});                    
                gsap.delayedCall( 0.5, () => {
                    this.secondPlayerPresentation.visible = true;
                    gsap.from( this.secondPlayerPresentation, 0.5, {alpha: 0});             
                }); 
                gsap.to( this.contourPlayer, 0.5, { alpha: 0 });                
                gsap.to( this.choosePlayerCaption, 0.4, { alpha: 0 });                
                this.firstPlayerCard.off( 'pointertap', this.onCardTap );
                this.secondPlayerCard.off( 'pointertap', this.onCardTap );                 
                break;

            case 'Ortiz':                
                this.selectedWrestless.enemyName = event.currentTarget.name;
                gsap.to( this.firstEnemyCard.scale, 0.2, {x: 0.8, y: 0.8, repeat: 1, yoyo: true, ease: 'sine.inOut', onComplete: () => {
                    this.firstEnemyCard.visible = false;
                    this.secondEnemyCard.visible = false;
                }});
                this.fireAnimDown.visible = true;
                this.fireAnimDown.play();               
                gsap.from( this.fireAnimDown, 0.7, {alpha: 0, repeat: 1, yoyo: true}); 
                gsap.delayedCall( 0.5, () => {
                    this.firstEnemyPresentation.visible = true;
                    this.showVersusCards();
                    gsap.from( this.firstEnemyPresentation, 0.5, {alpha: 0});             
                });
                gsap.delayedCall( 1.8, () => {
                    app.screenManager.set( FightScreen, this.selectedWrestless, true );             
                })
                gsap.to( this.contourEnemy, 0.5, { alpha: 0 });
                gsap.to( this.chooseEnemyCaption, 0.4, { alpha: 0 });                 
                this.firstEnemyCard.off( 'pointertap', this.onCardTap );
                this.secondEnemyCard.off( 'pointertap', this.onCardTap );  
                break;
                
            case 'Rey':
                this.selectedWrestless.enemyName = event.currentTarget.name;
                gsap.to( this.secondEnemyCard.scale, 0.2, {x: 0.8, y: 0.8, repeat: 1, yoyo: true, ease: 'sine.inOut', onComplete: () => {
                    this.firstEnemyCard.visible = false;
                    this.secondEnemyCard.visible = false;
                }});
                this.fireAnimDown.visible = true;
                this.fireAnimDown.play();                
                gsap.from( this.fireAnimDown, 0.7, {alpha: 0, repeat: 1, yoyo: true}); 
                gsap.delayedCall( 0.5, () => {
                    this.secondEnemyPresentation.visible = true;
                    this.showVersusCards();
                    gsap.from( this.secondEnemyPresentation, 0.5, {alpha: 0});             
                });
                gsap.delayedCall( 1.8, () => {
                    app.screenManager.set( FightScreen, this.selectedWrestless, true );             
                })
                gsap.to( this.contourEnemy, 0.5, { alpha: 0 });
                gsap.to( this.chooseEnemyCaption, 0.4, { alpha: 0 });                 
                this.firstEnemyCard.off( 'pointertap', this.onCardTap );
                this.secondEnemyCard.off( 'pointertap', this.onCardTap );   
                break;
        }	
    }

    showEnemyChoice() {
        this.firstEnemyCard.visible = true;     
        this.secondEnemyCard.visible = true;
        this.chooseEnemyCaption.visible = true;
        gsap.from( this.firstEnemyCard, 0.5, {alpha: 0} );
        gsap.from( this.secondEnemyCard, 0.5, {alpha: 0} );
        gsap.from( this.chooseEnemyCaption, 0.5, { alpha: 0 }); 
        gsap.from( this.firstEnemyCard.scale, 0.5, {x:0, y:0, ease: "back.out"} );
        gsap.from( this.secondEnemyCard.scale, 0.5, {x:0, y:0, ease: "back.out"} );
        gsap.from( this.chooseEnemyCaption.scale, 0.5, {x:0, y:0, ease: "back.out"} );
    }

    showVersusCards() {
        let choicePlayer = this.selectedWrestless.playerName;
        let choiceOpponent = this.selectedWrestless.enemyName;

        switch( choicePlayer ) {
            case 'Chris':                
                this.firstChoicePlayer.visible = true;
                this.playerCaption.visible = true;
                gsap.from( this.firstChoicePlayer, 0.4, {alpha: 0} );
                gsap.from( this.playerCaption, 0.4, {alpha: 0} );
                gsap.from( this.firstChoicePlayer.scale, 0.4, {x:0, y:0, ease: "quad.out"} );                
                gsap.from( this.playerCaption.scale, 0.4, {x:0, y:0, ease: "quad.out"} );
                break;

            case 'MJF':                
                this.secondChoicePlayer.visible = true;
                this.playerCaption.visible = true;
                gsap.from( this.secondChoicePlayer, 0.4, {alpha: 0} );
                gsap.from( this.playerCaption, 0.4, {alpha: 0} );
                gsap.from( this.secondChoicePlayer.scale, 0.3, {x:0, y:0, ease: "quad.out"} );
                gsap.from( this.playerCaption.scale, 0.4, {x:0, y:0, ease: "quad.out"} );
                break;
        }

        switch( choiceOpponent ) {
            case 'Ortiz':                
                this.firstChoiceOpponent.visible = true;
                this.opponentCaption.visible = true;
                gsap.from( this.firstChoiceOpponent, 0.4, {alpha: 0} );
                gsap.from( this.opponentCaption, 0.4, {alpha: 0} );
                gsap.from( this.firstChoiceOpponent.scale, 0.4, {x:0, y:0, ease: "quad.out"} );
                gsap.from( this.opponentCaption.scale, 0.4, {x:0, y:0, ease: "quad.out"} );
                break;

            case 'Rey':                
                this.secondChoiceOpponent.visible = true;
                this.opponentCaption.visible = true;
                gsap.from( this.secondChoiceOpponent, 0.4, {alpha: 0} );
                gsap.from( this.opponentCaption, 0.4, {alpha: 0} );
                gsap.from( this.secondChoiceOpponent.scale, 0.4, {x:0, y:0, ease: "quad.out"} );
                gsap.from( this.opponentCaption.scale, 0.4, {x:0, y:0, ease: "quad.out"} );              
                break;
        }
    }
            
}