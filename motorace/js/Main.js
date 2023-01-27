class Main {
    fps = 60;
    timeStep = 1000 / this.fps;

    constructor() {
        this.loader = PIXI.Assets.loader;       
    }


    loadAssets() {
        this.initialize();
    }


    initialize() {
        this.initPixi();
        this.initPhysics();      

        this.loop = new GameLoop({fps: this.fps});
        this.loop.add( this.update );

        this.resize = new ResizeManager({ width: 1280, height: 720 });        

        //drawTestLevel();
        new ChoiceLevel(this.initLevel.bind(this));       
    }  
    

    initLevel(difficulty) { 
        this.level = new Level(difficulty);
        this.player = new Player();        

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
            gravity: {x:0, y:1, scale:0.001}
        });

        /*let runner = Matter.Runner.create();
        Matter.Runner.run(runner, matter);*/

        this.matter = matter;
    }  
    
    update = () => {
        Matter.Engine.update(this.matter, this.timeStep);
    }
}