class Dust {
    dustArr = [];
    dustPool = [];

    max = 100;
    count = 0;

    add() {
        this.count++;
        
        if (this.count < 3) return;
        if (this.dustArr.length > this.max) return;

        this.count = 0;

        let dust;

        if (this.dustPool.length > 0) {
            dust = this.dustPool.pop();
            dust.visible = true;
        } else {
            dust = PIXI.Sprite.from('assets/images/dust.png');
            dust.anchor.set(0.5);
            app.level.display.ground.addChild(dust);
        }
        
        dust.x = app.player.display.wheelBack.x;
        dust.y = app.player.display.wheelBack.y + 40;
        dust.angle = 360 * Math.random();

        dust.vx = -1 - 2*Math.random();
        dust.vy = -1 - 1*Math.random();
        dust.vr = 1 + 3*Math.random();
        dust.vs = 0.02 + 0.01 * Math.random();
        dust.va = 0.008 + 0.008 * Math.random();
        dust.alpha = 0.5 + 0.3 * Math.random();
        dust.scale.set(0.1);
        
        this.dustArr.push(dust);        
    }


    update() {
        this.dustArr.forEach(dust=>{
            dust.x += dust.vx;
            dust.y += dust.vy;
            dust.angle -= dust.vr;
            dust.alpha -= dust.va;
            dust.scale.x += dust.vs;
            dust.scale.y += dust.vs;

            if (dust.alpha <= 0) {
                let id = this.dustArr.indexOf(dust);
                dust.visible = false;
                this.dustArr.splice(id, 1);
                this.dustPool.push(dust);
            }
        });
    }
}