class Level {
    constructor(data) {        
        this.initDisplay(data);
        main.resize.add(this.resizeHandler.bind(this));        
    }


    initDisplay(data) {
        let display = new PIXI.Container();

        let sky = new PIXI.Container();
        let skyBg = PIXI.Sprite.from('assets/images/sky/sky.jpg');           
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
        
        main.pixi.stage.addChild(sky);
        main.pixi.stage.addChild(display);

        let ground = new PIXI.Container();
        let parts = ['green1.png', 'green1.png', 'green1.png', 'green2.png', 'green3.png', 'green4.png'];
        data.forEach(body => {
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
            groundDown2.scale.x = 1.05;
            groundDown2.anchor.set(0.5, 0);
            groundDown2.position.copyFrom(body.position);
            groundDown2.rotation = body.angle;
            groundDown2.x += 100 * Math.cos(body.angle);
            groundDown2.y += 80 * Math.sin(body.angle);

            ground.addChild(
                groundDown2,
                groundDown,
                groundPart
            );
        })             
        
        this.display = display;
        this.display.sky = sky;
        display.addChild(ground);
    }

    resizeHandler() {    
        this.display.scale.set(1/devicePixelRatio);
        this.display.sky.position.set(window.innerWidth * 0.5, window.innerHeight * 0.5);   

        let scaleFactor = Math.max(
            window.innerWidth / 2560,
            window.innerHeight / 2560
        );
        this.display.sky.scale.set(scaleFactor);
    }

    update() {
        this.clouds.forEach(cloud => {
            cloud.x -= cloud.vx;

            if (cloud.x < cloud.leftX)
                cloud.x = cloud.rightX;
        })
    }
}