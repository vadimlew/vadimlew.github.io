class TutorialJoystick {
    display;
    bgSize = 100;
    barSize = 35;

    constructor () {         
        this.display = new PIXI.Container();
        this.display.visible = false;

        let joystickBg = new PIXI.Graphics();
        joystickBg.lineStyle (2, 0xdddddd);
        joystickBg.beginFill(0xffffff);
        joystickBg.drawCircle(0, 0, this.bgSize);
        joystickBg.alpha = 0.5;       

        let joystickBar = new PIXI.Graphics();
        joystickBar.lineStyle (2, 0xdddddd);
        joystickBar.beginFill(0xffffff);
        joystickBar.drawCircle(0, 0, this.barSize);    
        joystickBar.alpha = 0.65;

        let hand = PIXI.Sprite.from(assets.textures.pixi['hand']);
        hand.anchor.set(0.1, 0.1); 

        this.display.addChild(joystickBg, joystickBar, hand);  

        hand.anglePosition = 0
        gsap.to(hand, 1.5, {anglePosition:Math.PI*2, repeat:-1, ease:'none', onUpdate:() => {               
            hand.x = 57*Math.cos( hand.anglePosition );			
            hand.y = 57*Math.sin( hand.anglePosition );
            joystickBar.x = hand.x;
            joystickBar.y = hand.y;
            hand.rotation = 0.2*Math.sin( hand.anglePosition+1 );
        }});        
    }
}