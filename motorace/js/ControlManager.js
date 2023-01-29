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
        } //else {
            this.initKeyboard();
        //}        
    }

    initScreenButtons() {
        let moveforwardBtn = new PIXI.Sprite(app.assets.texture.control.arrowMove);
        moveforwardBtn.anchor.set(0.5);
        moveforwardBtn.interactive = true;
        app.pixi.stage.addChild(moveforwardBtn);
        moveforwardBtn.on('pointerdown', ()=>{ this.keys.up = true });
        moveforwardBtn.on('pointerup', ()=>{ this.keys.up = false });
        moveforwardBtn.on('pointerupoutside', ()=>{ this.keys.up = false });       

        let movebackBtn = new PIXI.Sprite(app.assets.texture.control.arrowMove);
        movebackBtn.scale.x = -1;
        movebackBtn.anchor.set(0.5);
        movebackBtn.interactive = true;
        app.pixi.stage.addChild(movebackBtn);
        movebackBtn.on('pointerdown', ()=>{ this.keys.down = true });
        movebackBtn.on('pointerup', ()=>{ this.keys.down = false });
        movebackBtn.on('pointerupoutside', ()=>{ this.keys.down = false });             

        let leanForwardBtn = new PIXI.Sprite(app.assets.texture.control.arrowLean);
        leanForwardBtn.anchor.set(0.5);
        leanForwardBtn.interactive = true;
        app.pixi.stage.addChild(leanForwardBtn);
        leanForwardBtn.on('pointerdown', ()=>{ this.keys.right = true });
        leanForwardBtn.on('pointerup', ()=>{ this.keys.right = false });
        leanForwardBtn.on('pointerupoutside', ()=>{ this.keys.right = false });
       
        let leanBackBtn = new PIXI.Sprite(app.assets.texture.control.arrowLean);
        leanBackBtn.scale.x = -1;
        leanBackBtn.anchor.set(0.5);
        leanBackBtn.interactive = true;
        app.pixi.stage.addChild(leanBackBtn);
        leanBackBtn.on('pointerdown', ()=>{ this.keys.left = true });
        leanBackBtn.on('pointerup', ()=>{ this.keys.left = false });
        leanBackBtn.on('pointerupoutside', ()=>{ this.keys.left = false });       

        app.resize.add(()=>{
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