class PlayerJoystickController {
    player;   
    display;
    joystickBar;

    bgSize = 100;
    barSize = 35;
    limit = this.bgSize - this.barSize;
    mouse = {x:0, y:0, isDown:false};

    constructor( player ) {
        this.player = player;
        this.#initJoystick();        
    }

    #initJoystick() {
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
            
            this.player.model.rotation.y = Math.PI/2 + angle;
            this.player.speed = this.player.maxSpeed * dist / this.limit;
        }
    }

    #stageUpHandler = (e) => {
        this.player.speed = 0;
        this.mouse.isDown = false;
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