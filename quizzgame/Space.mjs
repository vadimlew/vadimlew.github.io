export default class Space {
    display;

    constructor(width=256, height=512) {
        this.display = new PIXI.Container();
        this.round = 0//9;
        this.width = width;
        this.height = height;

        let bg = new PIXI.Graphics();
        bg.beginFill(0x111111);
        bg.drawRoundedRect(-width/2, -height/2, width, height, this.round);
        bg.endFill();

        let mask = new PIXI.Graphics();
        mask.beginFill(0x111111);
        mask.drawRoundedRect(-width/2, -height/2, width, height, this.round);
        mask.endFill();
        this.display.mask = mask;

        this.stars1 = this.drawStars(width, height, 50, 0.75, 0xc3fbff);
        this.stars2 = this.drawStars(width, height, 25, 1, 0xffdbc3);
        this.stars3 = this.drawStars(width, height, 10, 1.5, 0xa8f4ff);

        this.ship = PIXI.Sprite.from('./images/ship.png');
        this.ship.anchor.set(0.5);
        this.ship.scale.set(2);
        this.ship.y = height/2 - 100;

        this.fire = PIXI.Sprite.from('./images/fire.png');
        this.fire.anchor.set(0.5, 0);
        this.fire.y = 8;
        this.firePeriod = 0;
        this.ship.addChild(this.fire);

        this.asteroid = PIXI.Sprite.from('./images/asteroide.png');
        this.asteroid.scale.set(3);
        this.asteroid.anchor.set(0.5);
        this.asteroid.y = -height/2 - 65;

        this.laser = PIXI.Sprite.from('./images/laser.png');
        this.laser.anchor.set(0.5);
        this.laser.angle = 90;
        this.laser.visible = false;

        this.createBlast();

        this.display.addChild(
            bg,
            mask,
            this.stars1,
            this.stars2,
            this.stars3,
            this.laser,
            this.ship,
            this.asteroid                     
        );
    }

    drawStars(width, height, num, radius, color=0xc3ecff) {
        let stars = new PIXI.Graphics();
        stars.beginFill(color);
        for (let i=0; i < num; i++) {
            let x = -width/2 + Math.floor(width*Math.random());
            let y = -height/2 + Math.floor(height*Math.random());
            let r = radius + (radius*Math.random() * 0.4);
            stars.drawCircle(x, y, r);
        }

        let copy = stars.clone();
        copy.y = -512;
        stars.addChild(copy);

        return stars;
    }

    createBlast() {
        let texture = PIXI.Texture.from('./images/blastSheet.png');       
        texture.baseTexture.on('loaded', ()=>{
            let blast = app.createAnimSprite(texture, {col:4, row:2});
            blast.scale.set(1.5);
            blast.anchor.set(0.5);
            blast.visible = false;
            blast.loop = false;
            this.blast = blast;           
            this.display.addChild(blast);

            blast.onComplete = () => {
                blast.visible = false;
                this.asteroid.visible = true;
                this.asteroid.y = -this.height/2 - 80;
            }
        });
    }

    blastAsteroid = () => {        
        this.laser.visible = true;
        this.laser.position.set(this.ship.x, this.ship.y);
        gsap.to(this.laser, 0.5, {y: this.asteroid.y, ease: 'cubic.in', onComplete:()=>{
            this.laser.visible = false;
            this.blast.position.copyFrom(this.asteroid.position);
            this.asteroid.visible = false;
            this.blast.visible = true;
            this.blast.gotoAndPlay(0);
        }});        
    }

    blastShip = () => {        
        this.blast.position.copyFrom(this.ship.position);
        this.ship.visible = false;
        this.blast.visible = true;
        this.blast.gotoAndPlay(0);

        this.blast.onComplete = () => {
            this.blast.visible = false;
            this.display.emit('gameover');
        }
    }

    update = () => {
        this.stars1.y += .05;
        this.stars2.y += .15;
        this.stars3.y += .3;

        if (this.stars1.y > 512) this.stars1.y = 0;
        if (this.stars2.y > 512) this.stars2.y = 0;
        if (this.stars3.y > 512) this.stars3.y = 0;

        this.asteroid.angle += 0.1;
        this.asteroid.y += 0.05;

        if (!this.ship.visible) return;

        this.fire.scale.y = 0.8 + 0.2 * Math.sin(this.firePeriod);
        this.firePeriod += 0.05;
        if (this.firePeriod >= Math.PI) this.firePeriod -= Math.PI;       

        if (this.asteroid.y >= this.ship.y - this.asteroid.width/2) {
            this.blastShip();
        } 
    }
}