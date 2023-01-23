class Main {
    constructor() {
        this.loader = PIXI.Assets.loader;       
    }


    loadAssets() {
        this.initialize();
    }


    initialize() {
        this.initPixi();
        this.initPhysics();      

        this.resize = new ResizeManager({ width: 1280, height: 720 });        

        //drawTestLevel();        
        new ChoiceLevel(this.initLevel.bind(this));       
    }  
    

    initLevel(difficulty) { 
        this.level = new Level(difficulty);
        this.player = new Player();    
        this.control = new ControllManager();    
        this.update();

        let resetBtn = new PIXI.Graphics();
        resetBtn.beginFill(0x222222, 0.5);
        resetBtn.drawRoundedRect(-125, -50, 250, 100, 20);
        //resetBtn.position.set(150, 150);

        let text = new PIXI.Text('RESET', {
            fontFamily: 'IMPACT',
            fontSize: 50,
            fill: 0xcccccc,
            align: 'center',
        });
        text.anchor.set(0.5);
        resetBtn.addChild(text);

        resetBtn.interactive = true;
        resetBtn.on('pointerdown', ()=>{
           this.player.reset();
        });

        this.resize.add(()=>{
            resetBtn.scale.set(1/devicePixelRatio);
            resetBtn.position.set(window.innerWidth / 2, window.innerHeight - 100/devicePixelRatio);
        });

        main.pixi.stage.addChild(resetBtn);

        this.resetBtn = resetBtn;
    }


    initPixi() {
        this.pixi = new PIXI.Application({            
            background: 0x222222,
            resolution: devicePixelRatio,
            antialias: true,
            view: document.getElementById('game')
        });
    }   


    initPhysics() {
        let matter = Matter.Engine.create({
            gravity: {x:0, y:0.22, scale:0.001}
        });

        let runner = Matter.Runner.create();
        Matter.Runner.run(runner, matter);

        this.matter = matter;
    }  
    
    update() {
        //Matter.Engine.update(this.matter, 1000 / 60);

        this.level.display.ground.x = -this.player.display.corps.position.x * this.level.display.ground.scale.x + this.pixi.screen.width * 0.25;
        this.level.display.ground.y = -this.player.display.corps.position.y * this.level.display.ground.scale.y + this.pixi.screen.height * 0.65;

        this.level.display.mounth.x = -this.player.display.corps.position.x / 20;        

        /*let scale = 1 - Math.abs(this.player.phys.corps.velocity.x) / 40;        
        this.level.display.scale.x += ((1/devicePixelRatio * scale) - this.level.display.scale.x) / 60;
        this.level.display.scale.y = this.level.display.scale.x;*/

        this.player.update();
        this.level.update();
        requestAnimationFrame(()=>this.update());
    }
}