class Player {    
    speed = 1;
    move = new PIXI.Point();    
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
        let display = PIXI.Sprite.from('assets/images/car1.png');
        display.anchor.set(0.5);
        main.pixi.stage.addChild(display);
        this.display = display;
    }
    
    update() {        
        let x = 0;
        let y = 0;

        if (main.control.keys.up) {
            y -= 1;
        }

        if (main.control.keys.down) {      
            y += 1;
        }

        if (main.control.keys.left) {
            x -= 1;
        }

        if (main.control.keys.right) {
            x += 1;
        }   

        if (x != 0 || y != 0) {
            let dd = Math.sqrt(x*x + y*y);
            let nx = x/dd;
            let ny = y/dd;
            this.move.set(this.speed * nx, this.speed * ny);
            main.client.room.send('move', this.move);            
        }    
        
        //this.display.x += (this.transform.x - this.display.x) * 0.25;
        //this.display.y += (this.transform.y - this.display.y) * 0.25;

        this.display.x = Utility.lerp(this.display.x, this.transform.x, 0.25);
        this.display.y = Utility.lerp(this.display.y, this.transform.y, 0.25);
    }
}