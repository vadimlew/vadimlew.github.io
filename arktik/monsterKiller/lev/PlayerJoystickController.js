class PlayerJoystickController {
    player;   
    display;
    joystickBar;

    bgSize = 100;
    barSize = 35;
    limit = this.bgSize - this.barSize;
    mouse = {x:0, y:0, isDown:false};

    constructor( player, autoStart=true ) {
        this.player = player;
        this.#initJoystick();    
        if ( autoStart ) this.start();    
    }

    #initJoystick() {
        this.display = new PIXI.Container();
        this.display.visible = false;

        let joystickBg = new PIXI.Sprite( assets.textures.pixi['ui_joystick_bg'] );
        joystickBg.anchor.set( 0.5 );

        let joystickBar = new PIXI.Sprite( assets.textures.pixi['ui_joystick_bar'] );
        joystickBar.anchor.set( 0.5 );

        this.display.addChild(joystickBg, joystickBar);
        this.joystickBar = joystickBar;
    }
    
    #stageDownHandler = (event) => {
        this.mouse.isDown = true;     
        this.display.visible = true;   

        this.display.parent.toLocal(event.global, null, this.mouse);       

        this.joystickBar.x = 0;
        this.joystickBar.y = 0;

        this.display.x = this.mouse.x;
        this.display.y = this.mouse.y;        
    }

    #stageMoveHandler = (event) => {
        if (this.mouse.isDown) {
            this.display.parent.toLocal(event.global, null, this.mouse);
            
            let dx = this.mouse.x - this.display.x;
            let dy = this.mouse.y - this.display.y;
            let angle = Math.atan2(dy, dx);
            let dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist > this.limit) dist = this.limit;
            
            this.joystickBar.x = dist * Math.cos(angle);
            this.joystickBar.y = dist * Math.sin(angle);
            
            this.player.model.rotation.y = -angle;
            this.player.speed = this.player.maxSpeed * dist / this.limit;
        }
    }

    #stageUpHandler = (e) => {
        this.player.speed = 0;
        this.mouse.isDown = false;
        this.joystickBar.x = 0;
        this.joystickBar.y = 0;
        this.display.visible = false;           
    }

    start() {
        app.scene2d.on('pointerdown', this.#stageDownHandler);
        app.scene2d.on('pointermove', this.#stageMoveHandler);        
        app.scene2d.on('pointerup', this.#stageUpHandler);
        app.scene2d.on('pointerupoutside', this.#stageUpHandler);       
    }

    stop() {        
        app.scene2d.off('pointerdown', this.#stageDownHandler);
        app.scene2d.off('pointermove', this.#stageMoveHandler);        
        app.scene2d.off('pointerup', this.#stageUpHandler);
        app.scene2d.off('pointerupoutside', this.#stageUpHandler); 

        this.#stageUpHandler();
    }
}