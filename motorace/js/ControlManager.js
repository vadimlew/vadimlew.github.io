class ControllManager {
    keys = {
        up: false,
        down: false,
        left: false,
        right: false
    }

    constructor() {
        if (this.isMobile()) {
            this.initScreenButtons();
        } else {
            this.initKeyboard();
        }
        
    }

    initScreenButtons() {
        let moveforwardBtn = new PIXI.Graphics();
        moveforwardBtn.beginFill(0xffffff, 0.5);
        moveforwardBtn.drawCircle(0, 0, 35);
        moveforwardBtn.interactive = true;
        moveforwardBtn.on('pointerdown', ()=>{
            this.keys.up = true;
        });
        moveforwardBtn.on('pointerup', ()=>{
            this.keys.up = false;
        });
        main.pixi.stage.addChild(moveforwardBtn);

        let movebackBtn = new PIXI.Graphics();
        movebackBtn.beginFill(0xffffff, 0.5);
        movebackBtn.drawCircle(0, 0, 35);
        movebackBtn.interactive = true;
        movebackBtn.on('pointerdown', ()=>{
            this.keys.down = true;
        });
        movebackBtn.on('pointerup', ()=>{
            this.keys.down = false;
        });
        main.pixi.stage.addChild(movebackBtn);

        let leanForwardBtn = new PIXI.Graphics();
        leanForwardBtn.beginFill(0xffffff, 0.5);
        leanForwardBtn.drawCircle(0, 0, 35);
        leanForwardBtn.interactive = true;
        leanForwardBtn.on('pointerdown', ()=>{
            this.keys.right = true;
        });
        leanForwardBtn.on('pointerup', ()=>{
            this.keys.right = false;
        });
        main.pixi.stage.addChild(leanForwardBtn);

        let leanBackBtn = new PIXI.Graphics();
        leanBackBtn.beginFill(0xffffff, 0.5);
        leanBackBtn.drawCircle(0, 0, 35);
        leanBackBtn.interactive = true;
        leanBackBtn.on('pointerdown', ()=>{
            this.keys.left = true;
        });
        leanBackBtn.on('pointerup', ()=>{
            this.keys.left = false;
        });
        main.pixi.stage.addChild(leanBackBtn);

        main.resize.add(()=>{
            moveforwardBtn.position.set(window.innerWidth - 60, window.innerHeight - 60);
            movebackBtn.position.set(window.innerWidth - 140, window.innerHeight - 60);
            leanForwardBtn.position.set(140, window.innerHeight - 60);
            leanBackBtn.position.set(60, window.innerHeight - 60);
        });
    }

    initKeyboard() {
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
    }

    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
}