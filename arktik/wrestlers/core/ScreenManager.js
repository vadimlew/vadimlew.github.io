class Screen {
    screenManager;
    display = new PIXI.Container();
    enter() {};
    update() {};
    exit() {};
}


class ScreenManager {
    screens = new Map();
    current = new Screen();
    display = new PIXI.Container();

    constructor() {
        this.add( ...arguments );
    }

    update = () => {
        this.current.update();        
    }

    set(screenClass, parameters, force=false) {
        let screen = this.screens.get(screenClass);

        if (!screen) {
            console.warn('Такого Screen не существует', this.current);
            return;
        }

        if (this.current === screen) return;

        if (!force) {
            gsap.killTweensOf( this.current.display );            
            gsap.to(this.current.display, 0.5, {alpha:0, onComplete: () => { 
                this.current.exit();
                this.current = screen;
                this.current.display.visible = false;
    
                gsap.killTweensOf( this.current.display );
                this.current.display.visible = true;
                gsap.to(this.current.display, 0.5, {alpha:1, onComplete: () => { this.current.enter(parameters); }});
            }});
        } else {
            this.current.exit();
            this.current.display.visible = false;
            this.current = screen;
            this.current.display.visible = true;
            this.current.enter(parameters);
        }

    }

    add() {
        for (let screen of arguments) {
            if (screen instanceof Screen) {
                screen.screenManager = this;
                this.display.addChild(screen.display);
                screen.display.visible = false;
                this.screens.set(screen.constructor, screen);
            }
        }
    }

}