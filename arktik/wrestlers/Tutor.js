class Tutor {
    display;
    hand;
    timeline;

    firstCard;
    secondCard;

    constructor(object) {     
        this.firstCard = object.firstCard;
        this.secondCard = object.secondCard;

        this.initDisplay();
    }

    initDisplay( ) {
        this.display = new PIXI.Container();
        this.display.visible = false;

        this.hand = new PIXI.Sprite( assets.textures.pixi.hand );
        this.display.addChild( this.hand );
        this.hand.anchor.set(0.5, 0.5);
        this.hand.y = 60;
        this.hand.x = -120;
        this.hand.hitArea = new PIXI.Rectangle(0, 0, 0, 0);       
        
        this.timeline = gsap.timeline({repeat: -1, repeatDelay: 1, paused: true, delay: 0.5});
        this.timeline.from( this.hand, 0.4, {x: -200, alpha: 0, ease: 'sine.out'});
        this.timeline.to( this.hand.scale, 0.4, {x: 0.8, y: 0.8, repeat: 1, yoyo: true, ease: 'sine.inOut' });	
        this.timeline.to( this.firstCard.scale, 0.4, {x: 0.8, y: 0.8, delay: -0.4, repeat: 1, yoyo: true, ease: 'sine.inOut' });	

        this.timeline.to( this.hand, 0.6, {x: 220, ease: 'sine.inOut'});
        this.timeline.to( this.hand.scale, 0.4, {x: 0.8, y: 0.8, repeat: 1, yoyo: true, ease: 'sine.inOut' });	
        this.timeline.to( this.secondCard.scale, 0.4, {x: 0.8, y: 0.8, delay: -0.4, repeat: 1, yoyo: true, ease: 'sine.inOut' });	
        this.timeline.to( this.hand, 0.5, {x: 340, alpha: 0});       

    }

    show() {
        this.display.visible = true;
        gsap.from( this.display, 0.5, { alpha: 0 });
        this.timeline.play();
    }

    hide() {        
        this.timeline.pause(0);
        gsap.to( this.display, 0.5, { alpha: 0, onComplete: ()=> this.display.visible = false });
    }

}