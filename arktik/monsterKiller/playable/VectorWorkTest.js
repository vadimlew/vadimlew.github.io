class VectorWorkTest {
    display;

    constructor() {
        this.#initDisplay();
    }

    #initDisplay() {
        this.display = new PIXI.Container();

        let bg = new PIXI.Graphics();
        bg.beginFill(0x222222);
        bg.drawRect(-640,-640,1280,1280);
        this.display.addChild(bg);

        let circle = new Circle(50);
        circle.onMove = () => this.onMove();
        circle.display.alpha = 0.5;
        circle.display.x = -300;
        this.display.addChild(circle.display);

        let line = new RayLine();
        line.circleA.display.x = 200;
        line.drawRay();        
        line.onMove = () => this.onMove();
        this.display.addChild(line.display);        

        this.circle = circle;
        this.line = line;

        this.onMove();
    }

    onMove() {
        let dx = this.circle.display.x - this.line.circleA.display.x;
        let dy = this.circle.display.y - this.line.circleA.display.y;

        let vect = this.line.deltaX * dy - this.line.deltaY * dx;
        let height2 = Math.abs( vect**2 / this.line.distance2 );

        this.circle.display.alpha = (height2 < this.circle.radius2) ? 1 : 0.5;
    }
}


class Circle {
    display;
    radius;
    radius2;
    onMove = ()=>{};

    constructor(radius) {
        this.radius = radius;
        this.radius2 = radius**2;

        this.display = new PIXI.Graphics();        
        this.display.beginFill(0xcccccc);
        this.display.drawCircle(0, 0, 5);
        this.display.endFill();

        this.display.beginFill(0xcccccc, 0.01);
        this.display.lineStyle(2, 0x00ff00);
        this.display.drawCircle(0, 0, radius);
        this.display.endFill();
        
        this.display.interactive = true;
        this.display.on('pointerdown', this.onPointerDown);          
    }

    onPointerDown = ()=>{
        app.scene2d.on('pointermove', this.onPointerMove);
        app.scene2d.on('pointerup', this.onPointerUp);      
        app.scene2d.on('pointerupoutside', this.onPointerUp);
    }

    onPointerMove = (event)=>{
        this.display.parent.toLocal(event.global, null, this.display.position);  
        this.onMove();
    }

    onPointerUp = ()=>{
        app.scene2d.off('pointerup', this.onPointerUp);      
        app.scene2d.off('pointermove', this.onPointerMove);
        app.scene2d.off('pointerupoutside', this.onPointerUp);      
    }    
}

class RayLine {
    display;
    circleA;
    circleB;
    line;
    onMove = ()=>{};

    deltaX = 0;
    deltaY = 0;
    distance = 0;
    distance2 = 0;

    constructor() {
        this.display = new PIXI.Container();
        this.circleA = new Circle(8);
        this.circleB = new Circle(8);

        this.circleA.onMove = () => this.drawRay();
        this.circleB.onMove = () => this.drawRay();

        this.line = new PIXI.Graphics();       

        this.display.addChild(this.line, this.circleA.display, this.circleB.display);
    }

    drawRay() {
        this.line.clear();
        this.line.lineStyle(3, 0xffff00);
        this.line.moveTo( this.circleA.display.position.x, this.circleA.display.position.y );
        this.line.lineTo( this.circleB.display.position.x, this.circleB.display.position.y );

        this.deltaX = this.circleB.display.x - this.circleA.display.x;
        this.deltaY = this.circleB.display.y - this.circleA.display.y;
        this.distance2 = this.deltaX**2 + this.deltaY**2;

        this.onMove();
    }
}