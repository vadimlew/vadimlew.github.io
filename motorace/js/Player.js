class Player {
    startX = 0;
    startY = 335;
    ressorX = 35;
    ressorY = 40;
    ressorLen = 60;    
    maxWheelVelocity = 0.6;
    maxLeanVelocity = 0.1;
    wheelForce = 0.05;
    leanForce = 0.002;

    leanAngle = 0;
    leanValue = 0;


    constructor() {
        this.initPhysics();
        this.initDisplay();

        this.dust = new Dust();
        this.control = new ControllManager();

        app.loop.add( this.update );
    }


    initPhysics() {
        let bx = this.startX;
        let by = this.startY;

        let wxA = bx + 90;
        let wyA = by + 55;

        let wxB = bx + -92;
        let wyB = by + 55;

        let wheelSize = 40;

        let group = Matter.Body.nextGroup(true);

        let moto = Matter.Composite.create({ label: 'Moto' });

        let corps = Matter.Bodies.rectangle(bx, by, 140, 100, {
            collisionFilter: { group: group },
            chamfer: { radius: 60 },
            mass: 15,           
            frictionAir: 0
        });

        Matter.Body.setInertia(corps, 64000 * 2);

        let wheelFront = Matter.Bodies.circle(wxA, wyA, wheelSize, {
            collisionFilter: { group: group },
            friction: 1,
            frictionAir: 0           
        });

        let wheelBack = Matter.Bodies.circle(wxB, wyB, wheelSize, {
            collisionFilter: { group: group },
            friction: 1,
            frictionAir: 0            
        });

        let driver = Matter.Bodies.rectangle(bx - 5, by - 75, 50, 115, {
            collisionFilter: { group: group },
            chamfer: { radius: 30 },
            frictionAir: 0
        });

        let axelFront = Matter.Constraint.create({
            bodyA: wheelFront,
            bodyB: corps,
            pointB: { x: 90, y: 55 },
            stiffness: 0.1 //0.02       
        });

        let axelFront2 = Matter.Constraint.create({
            bodyA: wheelFront,
            bodyB: corps,
            pointB: { x: 0, y: 55 },
            stiffness: 1            
        });

        let axelBack = Matter.Constraint.create({
            bodyA: wheelBack,
            bodyB: corps,
            pointB: { x: -90, y: 55 },
            stiffness: 0.25 //0.04
        });

        let axelBack2 = Matter.Constraint.create({
            bodyA: wheelBack,
            bodyB: corps,
            pointB: { x: -40, y: 55 },
            stiffness: 1
        });

        let axelDriver = Matter.Constraint.create({
            bodyA: driver,
            bodyB: corps,
            pointA: { x: 0, y: -30 },
            pointB: { x: -5, y: -75 - 30 },
            stiffness: 0.1
        });

        let axelDriver2 = Matter.Constraint.create({
            bodyA: driver,
            bodyB: corps,
            pointA: { x: 0, y: 30 },
            pointB: { x: -5, y: -75 + 30 }
        });

        Matter.Composite.add(moto, [
            corps,
            driver,
            wheelFront,
            wheelBack,
            axelFront,
            axelFront2,
            axelBack2,
            axelBack,
            //axelDriver,
            axelDriver2
        ]);        

        Matter.Composite.add(app.matter.world, moto);

        this.phys = {
            moto,
            corps,
            wheelFront,
            wheelBack,
            driver,
            axelDriver
        };
    }


    initDisplay() {        
        let display = new PIXI.Container();

        let corps = new PIXI.Sprite(app.assets.texture.moto.corps);
        corps.pivot.set(110, 56);

        let ressorFront = new PIXI.Sprite(app.assets.texture.moto.ressorFront);
        ressorFront.pivot.set(22, 40);

        let ressorBack = new PIXI.Sprite(app.assets.texture.moto.ressorBack);
        ressorBack.pivot.set(65, 3);

        let wheelFront = new PIXI.Sprite(app.assets.texture.moto.wheel);
        wheelFront.anchor.set(0.5);

        let wheelBack = new PIXI.Sprite(app.assets.texture.moto.wheel);
        wheelBack.anchor.set(0.5);

        let head = new PIXI.Sprite(app.assets.texture.driver.head);
        head.pivot.set(24, 40);        
        head.position.set(0, -16);

        let body = new PIXI.Sprite(app.assets.texture.driver.body);
        body.anchor.set(0.8, 0.25);        

        let shoulder = new PIXI.Sprite(app.assets.texture.driver.shoulder);
        shoulder.pivot.set(9, 7);       
        shoulder.position.set(-5, 0);

        let forearm = new PIXI.Sprite(app.assets.texture.driver.forearm);
        forearm.pivot.set(7, 10);
        forearm.position.set(105, 7);

        let hip = new PIXI.Sprite(app.assets.texture.driver.hip);
        hip.pivot.set(16, 4);
        hip.position.set(92+2, 19);

        let foot = new PIXI.Sprite(app.assets.texture.driver.foot);
        foot.pivot.set(16, 4+70);
        foot.position.set(115, 40+70);

        corps.addChild(
            hip,
            forearm,
            foot
        );

        body.addChild(
            head,
            shoulder
        )

        this.display = display;
        this.display.corps = corps;
        this.display.wheelFront = wheelFront;
        this.display.wheelBack = wheelBack;
        this.display.ressorFront = ressorFront;
        this.display.ressorBack = ressorBack;

        this.display.foot = foot;
        this.display.hip = hip;
        this.display.body = body;
        this.display.head = head;
        this.display.shoulder = shoulder;
        this.display.forearm = forearm;

        display.addChild(
            wheelFront,
            wheelBack,
            corps,
            ressorFront,
            ressorBack,
            body
        );

        app.level.display.ground.addChild(this.display);
        //this.display.debug1 = Debug.drawPhysBody(this.phys.driver, display, 30);
    }   
    

    reset() {
        Matter.Body.setPosition(this.phys.corps, {x:this.startX, y:this.startY});
        Matter.Body.setPosition(this.phys.wheelFront, {x:this.startX+90, y:this.startY+55});
        Matter.Body.setPosition(this.phys.wheelBack, {x:this.startX-90, y:this.startY+55});
        Matter.Body.setPosition(this.phys.driver, {x:this.startX-5, y:this.startY-75});     
        
        Matter.Body.setVelocity(this.phys.corps, {x:0, y:0});
        Matter.Body.setVelocity(this.phys.wheelFront, {x:0, y:0});
        Matter.Body.setVelocity(this.phys.wheelBack, {x:0, y:0});
        Matter.Body.setVelocity(this.phys.driver, {x:0, y:0});   

        Matter.Body.setAngle(this.phys.corps, 0);
        Matter.Body.setAngle(this.phys.wheelFront, 0);
        Matter.Body.setAngle(this.phys.wheelBack, 0);
        Matter.Body.setAngle(this.phys.driver, 0);  
        
        Matter.Body.setAngularVelocity(this.phys.corps, 0);
        Matter.Body.setAngularVelocity(this.phys.wheelFront, 0);
        Matter.Body.setAngularVelocity(this.phys.wheelBack, 0);
        Matter.Body.setAngularVelocity(this.phys.driver, 0);

        //this.wheelSpeed = 0;
    }


    moveForward() {
        let wheelBack = this.phys.wheelBack;
        if (wheelBack.angularVelocity > this.maxWheelVelocity) return;

        this.dust.add();
        Matter.Body.setAngularVelocity(wheelBack, wheelBack.angularVelocity + this.wheelForce);
    }


    moveBack() {
        let wheelBack = this.phys.wheelBack;
        if (wheelBack.angularVelocity < -this.maxWheelVelocity) return;

        this.dust.add();
        Matter.Body.setAngularVelocity(wheelBack, wheelBack.angularVelocity - this.wheelForce);
    }


    leanForward() {
        let corps = this.phys.corps;
        corps.angle += 0.007;
        if (this.leanValue < 1) this.leanValue += 0.04; 
    }


    leanBack() {
        let corps = this.phys.corps;
        corps.angle -= 0.007;
        if (this.leanValue > -1) this.leanValue -= 0.04; 
    }


    update = () => {
        let corps = this.phys.corps;
        let wheelFront = this.phys.wheelFront;
        let wheelBack = this.phys.wheelBack;

        this.display.corps.position.copyFrom(corps.position);
        this.display.corps.rotation = corps.angle;

        this.display.wheelFront.position.copyFrom(wheelFront.position);
        this.display.wheelFront.rotation = wheelFront.angle;

        this.display.wheelBack.position.copyFrom(wheelBack.position);
        this.display.wheelBack.rotation = wheelBack.angle;

        this.display.ressorFront.position.copyFrom(wheelFront.position);
        this.display.ressorFront.rotation = corps.angle;

        let cos = Math.cos(corps.angle);
        let sin = Math.sin(corps.angle);

        let lx = corps.position.x - this.ressorX * cos - this.ressorY * sin;
        let ly = corps.position.y + this.ressorY * cos - this.ressorX * sin;

        let dx = lx - wheelBack.position.x;
        let dy = ly - wheelBack.position.y;
        let len = Math.sqrt(dx * dx + dy * dy);
        let scale = len / this.ressorLen;
        let rotation = Math.atan2(dy, dx);

        this.leanAngle = this.leanValue > 0? Utility.bezier3(this.leanValue, 0, 0.2, 0.7, 0.9) : -Utility.bezier3(-this.leanValue, 0, 0.2, 0.7, 0.9);

        this.display.ressorBack.position.set(lx, ly);
        this.display.ressorBack.rotation = rotation + 0.27;
        this.display.ressorBack.scale.x = scale;

        this.display.body.position.copyFrom(this.phys.driver.position);
        this.display.body.rotation = this.phys.driver.angle;
        this.display.head.rotation = this.display.corps.rotation - this.phys.driver.angle;        

        this.phys.driver.angle = corps.angle + this.leanAngle;
        this.display.hip.x = 94 - this.leanAngle * 5;
        this.display.hip.y = 19 - this.leanAngle * 10;
        this.display.hip.rotation = this.leanAngle/2;

        this.display.foot.angle = -this.leanAngle * 15;

        if (this.control.keys.up) {            
            this.moveForward();
        } 

        if (this.control.keys.down) {            
            this.moveBack();
        }

        if (this.control.keys.left) {
            this.leanBack();
        }

        if (this.control.keys.right) {
            this.leanForward();
        }       

        if (!this.control.keys.left && !this.control.keys.right) this.leanValue += -this.leanValue/10;

        this.dust.update();
    }
}