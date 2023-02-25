class Enemy {   
    transform = {
        x: 0,
        y: 0
    }
    
    constructor(playerShema) {        
        this.initGraphics();

        this.transform.x = playerShema.x;
        this.transform.y = playerShema.y;
        
        playerShema.onChange = (changes) => {
            changes.forEach(change => {                
                this.transform[change.field] = change.value;
            })
        };            
    }    

    initGraphics() {        
        let display = PIXI.Sprite.from('assets/images/car2.png');
        display.anchor.set(0.5);
        main.pixi.stage.addChild(display);
        this.display = display;
    }
    
    update() {        
        //this.display.x += (this.transform.x - this.display.x) * 0.25;
        //this.display.y += (this.transform.y - this.display.y) * 0.25;
        this.display.x = Utility.lerp(this.display.x, this.transform.x, 0.25);
        this.display.y = Utility.lerp(this.display.y, this.transform.y, 0.25);
    }
}