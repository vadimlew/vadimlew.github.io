class Main {
    constructor() {
        this.loader = PIXI.Assets.loader;       
    }

    loadAssets() {
        this.initialize();
    }

    initialize() {
        this.initPixi();
        this.initPhys();  
        this.initLevel();        
        this.initPlayer();              

        this.keys = {
            up: false,
            down: false,
            left: false,
            right: false
        }        

        document.addEventListener("keydown", (event) => {
		    if (event.code == "KeyW") this.keys.up = true;
            if (event.code == "KeyS") this.keys.down = true;
		    if (event.code == "KeyA") this.keys.left = true;
		    if (event.code == "KeyD") this.keys.right = true;
	    });

        document.addEventListener("keyup", (event) => {
            if (event.code == "KeyW") this.keys.up = false;
            if (event.code == "KeyS") this.keys.down = false;
            if (event.code == "KeyA") this.keys.left = false;
		    if (event.code == "KeyD") this.keys.right = false;
	    });

        window.addEventListener('resize', this.windowResizeHandler.bind(this));
        this.windowResizeHandler();  
        
        this.update();
    }

    initPixi() {
        this.pixi = new PIXI.Application({           
            resizeTo: window,
            background: 0x222222,
            resolution: devicePixelRatio,
            view: document.getElementById('game')
        });
    }

    initLevel() {
        let sky = PIXI.Sprite.from('assets/images/sky.jpg');        
        sky.anchor.set(0.5); 
        this.pixi.stage.addChild(sky);        

        let level = new PIXI.Container();
        this.pixi.stage.addChild(level);
        this.level = level;        

        let ground = new PIXI.Container();
        let parts = ['green1.png', 'green1.png', 'green1.png', 'green2.png', 'green3.png', 'green4.png'];
        this.phys.ground.bodies.forEach(body => {
            let id = Math.floor(parts.length * Math.random());
            let groundPart = PIXI.Sprite.from('assets/images/ground/' + parts[id]);
            groundPart.scale.x = 1.05;           
            groundPart.anchor.set(0.5, 0.72);
            groundPart.position.copyFrom(body.position);
            groundPart.rotation = body.angle;           

            let groundDown = PIXI.Sprite.from('assets/images/ground/down.png');
            groundDown.scale.x = 1.05;    
            groundDown.anchor.set(0.5, -0.02);
            groundDown.position.copyFrom(body.position);       
            groundDown.rotation = body.angle;               

            let groundDown2 = PIXI.Sprite.from('assets/images/ground/down.png');           
            groundDown2.anchor.set(0.5, -0.1);
            groundDown2.position.copyFrom(body.position);
            groundDown2.rotation = body.angle;     
            groundDown2.x += 100 * Math.cos(body.angle);
            groundDown2.y += 100 * Math.sin(body.angle);

            ground.addChild(
                groundDown2,
                groundDown,
                groundPart
            );       
        })        
        
        this.level.ground = ground;  
        this.level.sky = sky;      
        level.addChild(ground);
    }

    initPlayer() {
        let halfX = this.pixi.screen.width * 0.5 - 150;
        let halfY = this.pixi.screen.height * 0.5;
        
        let player = new PIXI.Container();
        player.position.set(halfX, halfY);        
        this.level.player = player;

        let corps = PIXI.Sprite.from('assets/images/body.png');
        corps.pivot.set(110, 56); 

        let ressorFront = PIXI.Sprite.from('assets/images/ressor_front.png');      
        ressorFront.pivot.set(19, 45);

        let ressorBack = PIXI.Sprite.from('assets/images/ressor_back.png');          
        ressorBack.pivot.set(65, 3);          

        let wheelFront = PIXI.Sprite.from('assets/images/wheel.png');
        wheelFront.anchor.set(0.5);
       
        let wheelBack = PIXI.Sprite.from('assets/images/wheel.png');
        wheelBack.anchor.set(0.5);       

        this.level.player.corps = corps;
        this.level.player.wheelFront = wheelFront;
        this.level.player.wheelBack = wheelBack;
        this.level.player.ressorFront = ressorFront;
        this.level.player.ressorBack = ressorBack;

        //this.level.addChild(player);

        this.level.addChild(
            player,
            wheelFront,
            wheelBack,
            corps,
            ressorFront,
            ressorBack
        );        
    }

    initPhys() {
        this.phys = {};

        let bx = 300;
        let by = 300;

        let wxA = bx + 90;
        let wyA = by + 60;

        let wxB = bx + -90;
        let wyB = by + 60;

        let wheelSize = 41;

        let engine = Matter.Engine.create({
            gravity: {x:0, y:1, scale:0.001}
        });

        let group = Matter.Body.nextGroup(true);

        let moto = Matter.Composite.create({ label: 'Moto' });

        let body = Matter.Bodies.rectangle(bx, by, 140, 100, {
            collisionFilter: {
                group: group
            },
            chamfer: {
                radius: 60
            },
            mass: 1,
            density: 0.0002,
            frictionAir: 0.02
        });        

        let wheelA = Matter.Bodies.circle(wxA, wyA, wheelSize, {
            collisionFilter: {
                group: group
            },
            mass: .1,
            friction: 1,
            frictionAir: 0.01
        });

        let wheelB = Matter.Bodies.circle(wxB, wyB, wheelSize, {
            collisionFilter: {
                group: group
            },
            mass: .1,
            friction: 1,
            frictionAir: 0.01
        });

        Matter.Body.setInertia(wheelA, 2000);
        Matter.Body.setInertia(wheelB, 5000);

        let axelA1 = Matter.Constraint.create({
            bodyA: wheelA,
            bodyB: body,
            pointB: { x: 40, y: 0 },
            stiffness: 0.1,
            damping: 0.5    
        });

        let axelA2 = Matter.Constraint.create({
            bodyA: wheelA,
            bodyB: body,
            pointB: { x: 0, y: 60 },
            stiffness: 1           
        });

        let axelB1 = Matter.Constraint.create({
            bodyA: wheelB,
            bodyB: body,
            pointB: { x: -40, y: 20 },
            stiffness: 1
        });

        let axelB2 = Matter.Constraint.create({
            bodyA: wheelB,
            bodyB: body,
            pointB: { x: -90, y: 0 },
            stiffness: 0.1,
            damping: 0.5
        });

        let ground = Matter.Composite.create({ label: 'Ground' });
        let parts = [];
        let x = -1200;
        let y = 600;
        let length = 100;
        let r = 0.1;
        let angle = 0;
        let aSpeed = 0;        

        for (let i = 0; i < 500; i++) {
            aSpeed += -0.005 + Math.random() * 0.01;
            angle += aSpeed;    
            
            if (angle > 0.75) aSpeed -= 0.1;
            if (angle < -0.75) aSpeed += 0.1;

            x += length * Math.cos(angle);
            y += length * Math.sin(angle);

            let part = Matter.Bodies.rectangle(x, y, length * 2, 60, { isStatic: true });
            Matter.Body.setAngle(part, angle);
            parts.push(part);

            x += length * Math.cos(angle);
            y += length * Math.sin(angle);
        }        

        Matter.Composite.add(ground, parts);          

        Matter.Composite.add(moto, [
            body,            
            wheelA,
            wheelB,
            axelA1,
            axelA2,
            axelB1,
            axelB2            
        ]);

        Matter.Composite.add(engine.world, [moto, ground]);

        let runner = Matter.Runner.create();
        Matter.Runner.run(runner, engine);

        this.phys.body = body;
        this.phys.wheelA = wheelA;
        this.phys.wheelB = wheelB;
        this.phys.ground = ground;
    }

    windowResizeHandler() {       
        this.pixi.stage.scale.set(1/devicePixelRatio, 1/devicePixelRatio);

        this.level.sky.position.set(this.pixi.screen.width * 0.5, this.pixi.screen.height * 0.5);          
    }

    update() {
        let body = this.phys.body;
        let wheelA = this.phys.wheelA;
        let wheelB = this.phys.wheelB;

        if (this.keys.up && wheelB.angularVelocity < 0.3) {                
            Matter.Body.setAngularVelocity(wheelB, wheelB.angularVelocity + 0.015);
        }

        if (this.keys.down && wheelB.angularVelocity > -0.3) {                
            Matter.Body.setAngularVelocity(wheelB, wheelB.angularVelocity - 0.015);
        }

        if (this.keys.left) {
            Matter.Body.setAngularVelocity(body, body.angularVelocity - 0.0005);
        }

        if (this.keys.right) {
            Matter.Body.setAngularVelocity(body, body.angularVelocity + 0.0005);
        }        

        this.level.player.corps.position.copyFrom(body.position);        
        this.level.player.corps.rotation = body.angle;

        this.level.player.wheelFront.position.copyFrom(wheelA.position);        
        this.level.player.wheelFront.rotation = wheelA.angle;

        this.level.player.wheelBack.position.copyFrom(wheelB.position);        
        this.level.player.wheelBack.rotation = wheelB.angle;

        this.level.player.ressorFront.position.copyFrom(wheelA.position); 
        this.level.player.ressorFront.rotation = body.angle;       

        let cos = Math.cos(body.angle);
        let sin = Math.sin(body.angle);

        let lx = body.position.x - 35 * cos - 40 * sin;
        let ly = body.position.y + 40 * cos - 35 * sin;

        let dx = lx - wheelB.position.x;
        let dy = ly - wheelB.position.y;
        let len = Math.sqrt(dx*dx + dy*dy);       
        let scale = len / 60;
        let rotation = Math.atan2(dy, dx);

        this.level.player.ressorBack.position.set(lx, ly);
        this.level.player.ressorBack.rotation = rotation + 0.27;
        this.level.player.ressorBack.scale.x = scale;

        this.level.x = -body.position.x + 600;
        this.level.y = -body.position.y + 600;

        requestAnimationFrame(()=>this.update());
    }
}