class Dust {
    dustArr = [];
    dustPool = [];

    count = 0;

    add() {
        this.count++;
        
        if (this.count < 5) return;
        if (this.dustArr.length > 50) return;

        this.count = 0;

        let dust;

        if (this.dustPool.length > 0) {
            dust = this.dustPool.pop();
            dust.visible = true;
        } else {
            dust = PIXI.Sprite.from('assets/images/dust.png');
            dust.anchor.set(0.5);
            main.level.display.ground.addChild(dust);
        }
        
        dust.x = main.player.display.wheelBack.x;
        dust.y = main.player.display.wheelBack.y + 40;

        dust.vx = -0.2 - 0.2*Math.random();
        dust.vy = -0.2 - 0.2*Math.random();
        dust.vr = 1 + 2*Math.random();
        dust.alpha = 0.5 + 0.3 * Math.random();
        dust.scale.set(0.1);
        
        this.dustArr.push(dust);        
    }


    update() {
        this.dustArr.forEach(dust=>{
            dust.x += dust.vx;
            dust.y += dust.vy;
            dust.angle -= dust.vr;
            dust.alpha -= 0.005;
            dust.scale.x += 0.015;
            dust.scale.y += 0.015;

            if (dust.alpha <= 0) {
                let id = this.dustArr.indexOf(dust);
                dust.visible = false;
                this.dustArr.splice(id, 1);
                this.dustPool.push(dust);
            }
        });
    }
}