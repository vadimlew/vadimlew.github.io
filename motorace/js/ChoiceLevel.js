class ChoiceLevel {
    constructor(callback) {
        this.callback = callback;

        let width = 300;
        let height = 250;

        let block = new PIXI.Container();        
        main.pixi.stage.addChild(block);

        let back = new PIXI.Graphics();
        back.beginFill(0x000000);
        back.drawRoundedRect(-width/2, -height/2, width, height, 24);
        block.addChild(back);

        this.clickHandler = this.clickHandler.bind(this);

        let button1 = this.createButton({name:'Easy', width:width-100, height:45});
        button1.y = -60;
        button1.on('pointerup', this.clickHandler);
        block.addChild(button1);

        let button2 = this.createButton({name:'Normal', width:width-100, height:45});
        button2.y = 0;
        button2.on('pointerup', this.clickHandler);
        block.addChild(button2);

        let button3 = this.createButton({name:'Hard', width:width-100, height:45});
        button3.y = 60;
        button3.on('pointerup', this.clickHandler);
        block.addChild(button3);

        main.resize.add(()=>{           
            block.x = window.innerWidth * 0.5;
            block.y = window.innerHeight * 0.5;
        });

        this.block = block;
    }   

    clickHandler(e) {
        this.block.visible = false;

        let difficulty;
        switch(e.target.name) {
            case 'Easy': difficulty = 1; break;
            case 'Normal': difficulty = 2; break;
            case 'Hard': difficulty = 3; break;
        }
        
        this.callback(difficulty);
    }
    
    createButton({name, width, height}) {
        let button = new PIXI.Container();   
        button.name = name;
        button.interactive = true; 

        let back = new PIXI.Graphics();
        back.beginFill(0x222222);
        back.drawRoundedRect(-width/2, -height/2, width, height, 10);
        button.addChild(back);

        let text = new PIXI.Text(name, {
            fontFamily: 'IMPACT',
            fontSize: 24,
            fill: 0x999999,
            align: 'center',
        });
        text.anchor.set(0.5);
        button.addChild(text);

        return button;
    }
}