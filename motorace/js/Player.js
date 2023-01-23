class Player {
    startX = 0;
    startY = 335;
    ressorX = 35;
    ressorY = 40;
    ressorLen = 60;
    wheelSpeed = 0;
    maxWheelSpeed = 0.008;
    acceleration = 0.00005;


    constructor() {
        this.initPhysics();
        this.initDisplay();

        this.dust = new Dust();
    }


    initPhysics() {
        let bx = this.startX;
        let by = this.startY;

        let wxA = bx + 90;
        let wyA = by + 55;

        let wxB = bx + -90;
        let wyB = by + 55;

        let wheelSize = 40;

        let group = Matter.Body.nextGroup(true);

        let moto = Matter.Composite.create({ label: 'Moto' });

        let corps = Matter.Bodies.rectangle(bx, by, 140, 100, {
            collisionFilter: { group: group },
            chamfer: { radius: 60 },
            mass: 15,
            density: 0.0002,
            frictionAir: 0
        });

        Matter.Body.setInertia(corps, 64000 * 2);

        let wheelFront = Matter.Bodies.circle(wxA, wyA, wheelSize, {
            collisionFilter: { group: group },
            friction: 1,
            frictionAir: 0,
            //restitution: -5
        });

        let wheelBack = Matter.Bodies.circle(wxB, wyB, wheelSize, {
            collisionFilter: { group: group },
            friction: 1,
            frictionAir: 0,
            //restitution: -5
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
            stiffness: 0.05 * 0.75 //0.02       
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
            stiffness: 0.1 * 0.75 //0.04
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
            stiffness: 0.01
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
            axelDriver,
            axelDriver2
        ]);        

        Matter.Composite.add(main.matter.world, moto);

        this.phys = {
            moto,
            corps,
            wheelFront,
            wheelBack,
            driver
        };
    }


    initDisplay() {
        let display = new PIXI.Container();

        let corps = PIXI.Sprite.from('assets/images/body.png');
        corps.pivot.set(110, 56);

        let ressorFront = PIXI.Sprite.from('assets/images/ressor_front.png');
        ressorFront.pivot.set(22, 40);

        let ressorBack = PIXI.Sprite.from('assets/images/ressor_back.png');
        ressorBack.pivot.set(65, 3);

        let wheelFront = PIXI.Sprite.from('assets/images/wheel.png');
        wheelFront.anchor.set(0.5);

        let wheelBack = PIXI.Sprite.from('assets/images/wheel.png');
        wheelBack.anchor.set(0.5);

        let head = PIXI.Sprite.from('assets/images/driver/head.png');
        head.pivot.set(24, 40);
        //head.position.set(105, -35);
        head.position.set(0, -16);

        let body = PIXI.Sprite.from('assets/images/driver/body.png');
        body.anchor.set(0.72, 0.25);
        //body.pivot.set(16, 56);
        body.position.set(92, 19);

        let shoulder = PIXI.Sprite.from('assets/images/driver/shoulder.png');
        shoulder.pivot.set(9, 7);
        //shoulder.position.set(100, -23);
        shoulder.position.set(-5, 0);

        let forearm = PIXI.Sprite.from('assets/images/driver/forearm.png');
        forearm.pivot.set(7, 10);
        forearm.position.set(105, 7);

        let hip = PIXI.Sprite.from('assets/images/driver/hip.png');
        hip.pivot.set(16, 4);
        hip.position.set(92, 19);

        let foot = PIXI.Sprite.from('assets/images/driver/foot.png');
        foot.pivot.set(16, 4);
        foot.position.set(115, 40);

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

        main.level.display.ground.addChild(this.display);
        //this.display.debug1 = Debug.drawPhysBody(this.phys.driver, display, 30);
    }

    
    addDust() {
        let dust = PIXI.Sprite.from('assets/images/dust.png');
        dust.x = this.display.wheelBack.x;
        dust.y = this.display.wheelBack.y + 40;

        dust 
        main.level.display.ground.addChild(dust);
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

        this.wheelSpeed = 0;
    }


    moveForward() {
        let wheelBack = this.phys.wheelBack;
        if (wheelBack.angularVelocity > 0.28) return;

        this.dust.add();
        Matter.Body.setAngularVelocity(wheelBack, wheelBack.angularVelocity + this.wheelSpeed);
    }


    moveBack() {
        let wheelBack = this.phys.wheelBack;
        if (wheelBack.angularVelocity < -0.2) return;

        this.dust.add();
        Matter.Body.setAngularVelocity(wheelBack, wheelBack.angularVelocity + this.wheelSpeed);
    }


    leanForward() {
        let corps = this.phys.corps;
        if (corps.angularVelocity > 0.025) return;
        Matter.Body.setAngularVelocity(corps, corps.angularVelocity + 0.00025);
    }


    leanBack() {
        let corps = this.phys.corps;
        if (corps.angularVelocity < -0.025) return;
        Matter.Body.setAngularVelocity(corps, corps.angularVelocity - 0.00025);
    }


    update() {
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

        this.display.ressorBack.position.set(lx, ly);
        this.display.ressorBack.rotation = rotation + 0.27;
        this.display.ressorBack.scale.x = scale;

        this.display.body.position.copyFrom(this.phys.driver.position);
        this.display.body.rotation = this.phys.driver.angle;
        this.display.head.rotation = this.display.corps.rotation - this.phys.driver.angle;
        //log(this.display.debug1.position);

        if (main.control.keys.up) {
            if (this.wheelSpeed < this.maxWheelSpeed) this.wheelSpeed += this.acceleration;
            this.moveForward();
        } 

        if (main.control.keys.down) {
            if (this.wheelSpeed > -this.maxWheelSpeed) this.wheelSpeed -= this.acceleration;
            this.moveBack();
        }

        if (main.control.keys.left) {
            this.leanBack();
        }

        if (main.control.keys.right) {
            this.leanForward();
        }

        if (main.control.keys.up || main.control.keys.down) {

        }
        
        if (!main.control.keys.up && !main.control.keys.down) this.wheelSpeed *= 0.25;

        this.dust.update();
    }
}