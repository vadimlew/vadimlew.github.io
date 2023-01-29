class Main {
    fps = 60;
    assets = {};

    constructor() {
       
    }


    async loadAssets() {
        let loaderText = document.getElementById('loader');
        PIXI.Assets.init({manifest: assetsManifest});
        this.assets.texture = await PIXI.Assets.loadBundle(['level', 'driver', 'moto', 'control'], (progress)=>{
            loaderText.textContent = 'Loading ' + Math.ceil(progress*100) + '%';
        });   
        loaderText.hidden = true;
        console.log(this.assets.texture);

        this.initialize();
    }


    initialize() {
        this.initPixi();
        this.initPhysics();

        this.loop = new GameLoop({fps: this.fps, autoStart:false});
        this.loop.add( this.update );

        this.resize = new ResizeManager({ width: 1280, height: 720 });        

        //drawTestLevel();
        new ChoiceLevel(this.initLevel.bind(this));       
    }  
    

    initLevel(difficulty) { 3
        console.log('initLevel');
        this.level = new Level(difficulty);
        this.player = new Player();      
        this.loop.start();  

        let resetBtn = new PIXI.Graphics();
        resetBtn.beginFill(0x222222, 0.5);
        resetBtn.drawRoundedRect(-125, -50, 250, 100, 20);        

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

        this.pixi.stage.addChild(resetBtn);
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
        this.matter = matter;
    }  
    
    update = (timeStep) => {       
        Matter.Engine.update(this.matter, timeStep);
    }
}