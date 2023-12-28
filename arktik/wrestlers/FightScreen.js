class FightScreen extends Screen {
    display;
    background;
    fightScene;
    reward;
    fightPresentation;    

    playerCharacters;
    enemyCharacters;

    firstPlayer;
    secondPlayer;
    firstEnemy;
    secondenemy;

    selectedWrestless = {};
    
    constructor() {
        super();
        this.initScreen();
        app.resizes.add( this.onResize );
    }

    initScreen() {
        this.display = new PIXI.Container();

        this.initFightRing();
        this.initReward();
        this.initFightPresentation();
        
    }

    initFightRing() {
        this.background = new PIXI.Sprite( assets.textures.pixi.ringBackground ); 
        this.background.anchor.set( 0.5, 0.5 );
        this.display.addChild( this.background );

        this.fightScene = new PIXI.Container();        
        this.display.addChild( this.fightScene );
        this.fightScene.visible = true;             
        
        let fightRing = new PIXI.Sprite( assets.textures.pixi.ring ); 
        fightRing.anchor.set( 0.5, 0.5 );

        let ringLight = new PIXI.Sprite( assets.textures.pixi.lights ); 
        ringLight.anchor.set( 0.5, 0.5 );
        this.fightScene.addChild( fightRing, ringLight );        
        
        this.playerCharacters = new PIXI.Container();
        this.fightScene.addChild( this.playerCharacters );

        this.firstPlayer = new PIXI.Sprite( assets.textures.pixi.characterChris ); 
        this.firstPlayer.anchor.set( 0.5, 0.5 );
        this.firstPlayer.visible = false;

        this.secondPlayer = new PIXI.Sprite( assets.textures.pixi.characterMjf ); 
        this.secondPlayer.anchor.set( 0.5, 0.5 );       
        this.secondPlayer.visible = false;  
        this.playerCharacters.addChild( this.firstPlayer, this.secondPlayer );

        this.enemyCharacters = new PIXI.Container();
        this.fightScene.addChild( this.enemyCharacters );

        this.firstEnemy = new PIXI.Sprite( assets.textures.pixi.characterOrtiz ); 
        this.firstEnemy.anchor.set( 0.5, 0.5 );
        this.firstEnemy.visible = false;

        this.secondEnemy = new PIXI.Sprite( assets.textures.pixi.characterRey ); 
        this.secondEnemy.anchor.set( 0.5, 0.5 );
        this.secondEnemy.visible = false;
        this.enemyCharacters.addChild( this.firstEnemy, this.secondEnemy );

        let ringRope = new PIXI.Sprite( assets.textures.pixi.rope ); 
        ringRope.anchor.set( 0.5, 0.5 );
        this.fightScene.addChild( ringRope );
    }    

    initFightPresentation() {        
        let filterOutline = new PIXI.filters.OutlineFilter( 3, 0xffffff);
        filterOutline.padding = 10;

        this.fightPresentation = new PIXI.Container();
        this.fightPresentation.scale.set( 0.7, 0.7 );    
        this.display.addChild( this.fightPresentation );
        this.fightPresentation.visible = false;

        this.fightCaption = new PIXI.Sprite( assets.textures.pixi.fightCaptionRed ); 
        this.fightCaption.anchor.set( 0.5, 0.5 );
        this.fightCaption.y = -80;
        this.fightCaption.scale.x = 0.8;      

        this.fightIcon = new PIXI.Sprite( assets.textures.pixi.fightIcon ); 
        this.fightIcon.anchor.set( 0.5, 0.5 );
        this.fightIcon.y = 140;
        this.fightIcon.scale.set( 0.7, 0.7 );
        this.fightIcon.filters = [filterOutline];

        this.fightPresentation.addChild( this.fightCaption, this.fightIcon );
    } 

    enter( object ) {
        console.log('enter from fight screen');
        //this.fightScene.visible = true;
        //this.fightPresentation.visible = true;
        //gsap.from( this.fightPresentation, 0.5, {alpha: 0} );
        //gsap.from( this.fightScene.scale, 0.5, {x:0, y:0, ease: "back.out"} );
        gsap.from( this.fightPresentation.scale, 0.5, {x:0, y:0, ease: "back.out"} );

        this.showFightPresentation();
        gsap.delayedCall( 3, () => {
            this.showReward();
        } );
        gsap.delayedCall( 8, () => {           
            app.screenManager.set( FinishScreen, this.selectedWrestless, true );
        } )

        switch (object.playerName ) {
            case 'Chris':
                this.firstPlayer.visible = true;
                gsap.from( this.firstPlayer, 0.5, {alpha: 0} );
                gsap.from( this.firstPlayer.scale, 0.5, {x:0, y:0, ease: "back.out"} );
                this.selectedWrestless.playerName = object.playerName;
                break;

            case 'MJF':
                this.secondPlayer.visible = true;
                gsap.from( this.secondPlayer, 0.5, {alpha: 0} );
                gsap.from( this.secondPlayer.scale, 0.5, {x:0, y:0, ease: "back.out"} );
                this.selectedWrestless.playerName = object.playerName;               
                break;
        }

        switch (object.enemyName ) {
            case 'Ortiz':
                this.firstEnemy.visible = true;
                gsap.from( this.firstEnemy, 0.5, {alpha: 0} );
                gsap.from( this.firstEnemy.scale, 0.5, {x:0, y:0, ease: "back.out"} );
                break;

            case 'Rey':
                this.secondEnemy.visible = true;
                gsap.from( this.secondEnemy, 0.5, {alpha: 0} );
                gsap.from( this.secondEnemy.scale, 0.5, {x:0, y:0, ease: "back.out"} );             
                break;
        }
    }

    exit() {
        console.log('exit from fight screen')
    }
    
    onResize = ({ isPortraite, leftUI, rightUI, upUI, downUI }) => {               
        if (isPortraite) {
            this.background.height = downUI - upUI;
            this.background.width = 1280 * this.background.height/1766;

            this.fightScene.height = downUI - upUI;
            this.fightScene.width = 1280 * this.fightScene.height/1766;

            this.firstPlayer.height = 420;
            this.firstPlayer.width = 1024 * this.firstPlayer.height/1024;
            this.firstPlayer.x = 300;

            this.secondPlayer.height = 420;
            this.secondPlayer.width = 1024 * this.secondPlayer.height/1024;
            this.secondPlayer.x = 300;

            this.firstEnemy.height = 420;
            this.firstEnemy.width = 1024 * this.firstEnemy.height/1024;
            this.firstEnemy.x = -300;

            this.secondEnemy.height = 420;
            this.secondEnemy.width = 1024 * this.secondEnemy.height/1024;
            this.secondEnemy.x = -300;

            this.reward.height = 100;
            this.reward.width = 256 * this.reward.height/257;

            this.fightPresentation.y = upUI + 180; 
        } else {            
            this.background.width = rightUI - leftUI;
            this.background.height = 1766 * this.background.width/1280;

            this.fightScene.width = rightUI - leftUI;
            this.fightScene.height = 1766 * this.fightScene.width/1280;

            this.firstPlayer.height = 420;
            this.firstPlayer.width = 1024 * this.firstPlayer.height/1024;
            this.firstPlayer.x = 300;

            this.secondPlayer.height = 420;
            this.secondPlayer.width = 1024 * this.secondPlayer.height/1024;
            this.secondPlayer.x = 300;

            this.firstEnemy.height = 420;
            this.firstEnemy.width = 1024 * this.firstEnemy.height/1024;
            this.firstEnemy.x = -300;

            this.secondEnemy.height = 420;
            this.secondEnemy.width = 1024 * this.secondEnemy.height/1024;
            this.secondEnemy.x = -300;

            this.reward.height = 100;
            this.reward.width = 256 * this.reward.height/257;

            this.fightPresentation.y = 60; 
        }
    }
    
    initReward() {
        this.reward = new PIXI.Sprite( assets.textures.pixi.cash ); 
        this.reward.anchor.set( 0.5, 0.5 );
        this.reward.visible = false;
        this.fightScene.addChild( this.reward );
        this.reward.x = 0;
        this.reward.y = 0;
        
        this.rewardText = new PIXI.Sprite( assets.textures.pixi.rewardText ); 
        this.rewardText.anchor.set( 0.5, 0 );
        this.rewardText.scale.set( 0.7, 0.7 );
        this.rewardText.visible = false;
        this.fightScene.addChild( this.rewardText );
        this.rewardText.x = 0;
        this.rewardText.y = this.playerCharacters.y + 70;
        
        this.timeline1 = gsap.timeline({repeat: -1, repeatDelay: 0, paused: true, delay: 0.1});
        this.timeline1.to( this.reward, 0.4, {x: 250, y: this.playerCharacters.y, ease: 'quad.inOut'});
        this.timeline1.to( this.reward.scale, 0.2, {x: 0.5, y: 0.5, repeat: 1, yoyo: true, ease: 'sine.inOut' });	
        this.timeline1.to( this.reward, 0.4, {alpha: 0, ease: 'quad.out'});

        this.timeline2 = gsap.timeline({repeat: -1, repeatDelay: 0, paused: true, delay: 0.1});
        this.timeline2.from( this.rewardText.scale, 0.6, {x: 1, y: 1, repeat: 1, yoyo: true, ease: 'sine.inOut' });	

    }

    showReward() {
        this.reward.visible = true;
        this.rewardText.visible = true;
        gsap.from( this.reward, 0.5, { alpha: 0 });
        gsap.from( this.rewardText, 0.5, { alpha: 0 });
        this.timeline1.play();
        this.timeline2.play();
    }

    hideReward() {        
        this.timeline1.pause(0);
        this.timeline2.pause(0);
        gsap.to( this.reward, 0.5, { alpha: 0, onComplete: ()=> this.display.visible = false });
    }

    showFightPresentation() {
        this.fightPresentation.visible = true;
        gsap.from( this.fightPresentation, 0.65, {alpha: 0, repeat: 3, yoyo: true, ease: "quad.inOut"} );
        //gsap.from( this.fightCaption.scale, 0.8, {x:0, y:0, repeat: -1, yoyo: true, ease: "quad.inOut"} );
    }
}