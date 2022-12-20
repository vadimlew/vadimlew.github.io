class Main {
    constructor() {
        this.loader = PIXI.Assets.loader;       
    }

    loadAssets() {
        this.initialize();
    }

    initialize() {
        this.initPixi();
        this.initLevel();        
        this.initPlayer();
        this.initPhys();        

        this.keys = {
            left: false,
            right: false,
        }

        this.velocity = Matter.Vector.create();
        console.log(this.velocity);

        document.addEventListener("keydown", (event) => {
		    if (event.code == "KeyA") this.keys.left = true;
		    if (event.code == "KeyD") this.keys.right = true;
	    });

        document.addEventListener("keyup", (event) => {
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
        let level = new PIXI.Container();
        this.pixi.stage.addChild(level);
        this.level = level;

        let sky = PIXI.Sprite.from('assets/images/sky.jpg');        
        sky.anchor.set(0.5);        
        this.level.sky = sky;

        let ground = new PIXI.Container();
        let groundPart1 = PIXI.Sprite.from('assets/images/ground.png');
        let groundPart2 = PIXI.Sprite.from('assets/images/ground.png');
        groundPart2.x = 949;
        ground.addChild(groundPart1, groundPart2);
        this.level.ground = ground;
        
        level.addChild(
            sky,
            ground
        );
    }

    initPlayer() {
        let halfX = this.pixi.screen.width * 0.5 - 150;
        let halfY = this.pixi.screen.height * 0.5;
        
        let player = new PIXI.Container();
        player.position.set(halfX, halfY);
        this.level.addChild(player);
        this.level.player = player;

        let corps = PIXI.Sprite.from('assets/images/body.png');
        corps.x = 23;        

        let ressorFront = PIXI.Sprite.from('assets/images/ressor_front.png');      
        ressorFront.position.set(208, 69);

        let ressorBack = PIXI.Sprite.from('assets/images/ressor_back.png');   
        ressorBack.pivot.set(71, 5);    
        ressorBack.position.set(104, 100);

        let wheelFront = PIXI.Sprite.from('assets/images/wheel.png');
        wheelFront.anchor.set(0.5);
        wheelFront.position.set(228, 115);

        let wheelBack = PIXI.Sprite.from('assets/images/wheel.png');
        wheelBack.anchor.set(0.5);
        wheelBack.position.set(38, 114);

        this.level.player.wheelFront = wheelFront;
        this.level.player.wheelBack = wheelBack;

        player.addChild(
            wheelFront,
            wheelBack,
            corps,
            ressorFront,
            ressorBack
        );        
    }

    initPhys() {
        this.phys = {};

        let bx = this.level.player.x;
        let by = this.level.player.y;

        let wxA = bx + this.level.player.wheelFront.x;
        let wyA = by + this.level.player.wheelFront.y;

        let wxB = bx + this.level.player.wheelBack.x;
        let wyB = by + this.level.player.wheelBack.y;

        let wheelSize = 41;

        let engine = Matter.Engine.create();
        let group = Matter.Body.nextGroup(true);
        
        let moto = Matter.Composite.create({ label: 'Moto' });
        
        let body = Matter.Bodies.rectangle(bx, by, 200, 120, {
            collisionFilter: {
                group: group
            },
			/*chamfer: {
				radius: 60
			},*/
            friction: 0.01,
            density: 0.0002
        });

        let wheelA = Matter.Bodies.circle(wxA, wyA, wheelSize, {
            collisionFilter: {
                group: group
            },
            friction: 0.8
        });

        let wheelB = Matter.Bodies.circle(wxB, wyB, wheelSize, {
            collisionFilter: {
                group: group
            },
            friction: 0.8
        });

        let axelA = Matter.Constraint.create({
            bodyB: body,
            pointB: {x:100 , y:115},
            bodyA: wheelA,
            stiffness: 1,
            length: 0
        });

        let axelB = Matter.Constraint.create({
            bodyB: body,
            pointB: {x:-100 , y:115},
            bodyA: wheelB,
            stiffness: 1,
            length: 0
        });

        let ground = Matter.Bodies.rectangle(this.pixi.screen.width * 0.5, this.pixi.screen.height - 94, 4000, 60, { 
            isStatic: true,
            friction: 0.01
        });	
        
        Matter.Composite.add(moto, [
            body, 
            //wheelA,
           // wheelB,
            //axelA,
            //axelB
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
        this.level.ground.position.set(0, this.pixi.screen.height - 94);

        Matter.Body.setPosition(this.phys.ground, this.level.ground.position);        
    }

    update() {
        if (this.keys.left) {
            this.velocity.x -= .2;            
        }

        if (this.keys.right) {
            this.velocity.x += .2;  
        }

        this.velocity.x *= 0.9;

        this.phys.body.force.x = this.velocity.x/300;
        this.level.player.wheelFront.angle += this.velocity.x;
        this.level.player.wheelBack.angle += this.velocity.x;

        this.level.player.position.copyFrom(this.phys.body.position);        
        this.level.player.angle = this.phys.body.angle;

        //this.level.wheelFront.position.copyFrom(this.phys.wheelA.position);        
        //this.level.player.wheelFront.angle = this.phys.wheelA.angle;

        //this.level.wheelBack.position.copyFrom(this.phys.wheelB.position);        
        //this.level.player.wheelBack.angle = this.phys.wheelB.angle;

        requestAnimationFrame(()=>this.update());
    }
}