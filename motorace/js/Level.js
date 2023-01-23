class Level {

    constructor(difficulty) {
        let data = LevelData.get(difficulty);

        this.initPhysics(data);
        this.initDisplay();       

        main.resize.add(this.resizeHandler.bind(this));        
    }    
    

    initPhysics(data) {        
        let ground = Matter.Composite.create({ label: 'Ground' });
        let parts = [];  
        let scale = 25;        

        for (let i = 0; i < data.length; i++) {
            let partData = data[i];
            partData.shape.forEach(point => {
                point.x *= scale;
                point.y *= scale;
            });
            let part = Matter.Bodies.fromVertices(
                partData.position.x * scale - 800, partData.position.y * scale + 1200,
                partData.shape,
                {isStatic: true}
            )   
            parts.push(part); 
        }        

        Matter.Composite.add(ground, parts);
        Matter.Composite.add(main.matter.world, ground);       

        this.phys = {
            ground
        };        
    }    


    initDisplay() {      
        let display = new PIXI.Container();        
        main.pixi.stage.addChild(display);
        this.display = display;

        this.initSkyDisplay();
        this.initMounthDisplay(); 
        this.initGroundDisplay();          
        this.initPlantsDisplay();          
    }


    initSkyDisplay() {
        let sky = new PIXI.Container();
        let skyBg = PIXI.Sprite.from('assets/images/sky/sky6.jpg');        
        skyBg.anchor.set(0.5);
        sky.addChild(skyBg);

        this.clouds = [];
        skyBg.texture.baseTexture.on('loaded', ()=>{
            for (let i=0; i<10; i++) {
                let cloud = PIXI.Sprite.from('assets/images/sky/cloud'+ (i%2+1) +'.png');  
                cloud.anchor.set(0.5);
                cloud.x = -skyBg.width/2 + skyBg.width * Math.random();
                cloud.y = -skyBg.height/2 + skyBg.height/2 * Math.random();

                let scale = 0.5 + 1*Math.random();

                cloud.scale.x = Math.random() > 0.5? scale : -scale;
                cloud.scale.y = Math.random() > 0.5? scale : -scale;
                sky.addChild(cloud);

                cloud.vx = .1 + .4 * Math.random() * scale;
                cloud.leftX = -skyBg.width/2 - 900;
                cloud.rightX = skyBg.width/2 + 900;
                this.clouds.push(cloud);
            }
        });
        
        this.display.sky = sky;
        this.display.addChild(sky);
    }


    initGroundDisplay() {
        let ground = new PIXI.Container();

        let groundTexture = PIXI.Texture.from('assets/images/ground/ground_texture_06.jpg');
        let matrix = new PIXI.Matrix();
        //matrix.scale(0.5, 0.5);
        
        this.phys.ground.bodies.forEach(body => {
            let part = new PIXI.Graphics();      
            part.beginTextureFill({texture:groundTexture, matrix});
            
            part.moveTo(~~body.vertices[0].x-1, ~~body.vertices[0].y);           
            part.lineTo(~~body.vertices[1].x+1, ~~body.vertices[1].y);
            part.lineTo(~~body.vertices[2].x+1, ~~body.vertices[2].y + 1000);
            part.lineTo(~~body.vertices[3].x-1, ~~body.vertices[3].y + 1000);
            part.lineTo(~~body.vertices[0].x-1, ~~body.vertices[0].y);           

            ground.addChild(part);      
        });

        this.phys.ground.bodies.forEach(body => {
            let part = new PIXI.Graphics();          

            part.lineStyle({width:45, color:0x89480c, alignment:0, cap:PIXI.LINE_CAP.ROUND});
            part.moveTo(~~body.vertices[0].x, ~~body.vertices[0].y);
            part.lineTo(~~body.vertices[1].x, ~~body.vertices[1].y);   

            part.lineStyle({width:30, color:0xa8601e, alignment:0, cap:PIXI.LINE_CAP.ROUND});
            part.moveTo(~~body.vertices[0].x, ~~body.vertices[0].y);
            part.lineTo(~~body.vertices[1].x, ~~body.vertices[1].y);

            //part.cacheAsBitmap = true;

            ground.addChild(part);      
        });
        
        this.display.ground = ground;
        this.display.addChild(ground);
    }


    initMounthDisplay() {
        let mounth = new PIXI.Container();    
        
        for (let i=-1; i < 10; i++) {
            let sprite = PIXI.Sprite.from('assets/images/ground/mounth.png');       
            sprite.anchor.y = 1;
            sprite.x = i*2560;
            mounth.addChild(sprite);
        }       

        this.display.mounth = mounth;
        this.display.addChild(mounth);
    }


    initPlantsDisplay() {
        let palms = [
            'assets/images/ground/plants/palm1.png',
            'assets/images/ground/plants/palm2.png'            
        ];

        let grass = [           
            'assets/images/ground/plants/grass1.png',
            'assets/images/ground/plants/grass2.png',
            'assets/images/ground/plants/grass3.png',
            'assets/images/ground/plants/grass1.png',
            'assets/images/ground/plants/grass2.png',
            'assets/images/ground/plants/grass3.png',
        ];

        let palmScore = 0.9;
        let grassScore = 0.6;

        let setPlant = (plant, body)=> {
            let dx = body.vertices[1].x - body.vertices[0].x;
            let dy = body.vertices[1].y - body.vertices[0].y;

            let ratio = Math.random();
            let x = body.vertices[0].x + dx * ratio;
            let y = body.vertices[0].y + dy * ratio;
            
            plant.position.set(x, y);
            plant.rotation = Math.atan2(dy, dx) + -0.1 + 0.2 * Math.random();
            this.display.ground.addChildAt(plant, 0);  
        }

        this.phys.ground.bodies.forEach(body => {
            let dy = body.vertices[1].y - body.vertices[0].y;

            if (Math.abs(dy) < 25 && Math.random() > palmScore) {
                let id = Math.floor(palms.length * Math.random());
                let plant = PIXI.Sprite.from(palms[id]);
                plant.anchor.set(0.5, 0.99);
                setPlant(plant, body);
            }

            if (Math.random() > grassScore) {
                let id = Math.floor(grass.length * Math.random());
                let plant = PIXI.Sprite.from(grass[id]);
                plant.anchor.set(0.5, 1);
                setPlant(plant, body);
            }
        });        
    }


    resizeHandler() {        
        this.display.ground.scale.set(1/devicePixelRatio * 0.8);        

        this.display.sky.position.set(window.innerWidth * 0.5, window.innerHeight * 0.5);   
        this.display.mounth.y = window.innerHeight;

        let scaleFactor = Math.max(
            window.innerWidth / 2560,
            window.innerHeight / 2560
        );

        this.display.sky.scale.set(scaleFactor);
        this.display.mounth.scale.set(scaleFactor);
    }


    update() {
        this.clouds.forEach(cloud => {
            cloud.x -= cloud.vx;

            if (cloud.x < cloud.leftX)
                cloud.x = cloud.rightX;
        })
    }
}