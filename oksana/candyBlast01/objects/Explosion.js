class Explosion {
    sprite;

    constructor(x, y) {
        let time1 = 0.7;    
        let time2 = 0.6;

        this.sprite = new PIXI.Container();
        this.sprite.position.set(x, y);

        this.flash = new PIXI.Sprite(assets.textures.pixi.flash);
        this.flash.anchor.set(0.5);
        this.flash.scale.set(1.5);
        this.flash.blendMode = PIXI.BLEND_MODES.ADD;

        for (let index = 0; index < 14; index++) {
            let radius = 120 + 20 * Math.random();
            let angle = index * 2 * Math.PI / 14 + Math.PI / 6 * Math.random();
            let x = radius * Math.cos(angle);
            let y = radius * Math.sin(angle);
            let blowPart = new PIXI.Sprite(assets.textures.pixi.smoke3);
            blowPart.anchor.set(0.5);
            blowPart.scale.set(0.0);
            blowPart.rotation = angle + Math.PI / 2;

            gsap.to(blowPart, time1, { x, y, ease: 'cubic.out' });
            gsap.to(blowPart, time1, { alpha: 0, delay: time1/2 });
            gsap.to(blowPart.scale, time1/2, { x: 1, y: 1, ease: 'cubic.in' });
            gsap.to(blowPart.scale, time1/2, { x: 0, y: 0, delay: time1/2, ease: 'cubic.out' });

            this.sprite.addChild(blowPart);
        }

        for (let index = 0; index < 12; index++) {
            let radius = 80 + 20 * Math.random();
            let angle = index * 2 * Math.PI / 12 + Math.PI / 7 * Math.random();
            let x = radius * Math.cos(angle);
            let y = radius * Math.sin(angle);
            let blowPart = new PIXI.Sprite(assets.textures.pixi.smoke2);
            blowPart.anchor.set(0.5);
            blowPart.scale.set(0.0);
            blowPart.rotation = angle + Math.PI / 2;

            gsap.to(blowPart, time2, { x, y, ease: 'cubic.out' });
            gsap.to(blowPart, time2, { alpha: 0, delay: time2/2 });
            gsap.to(blowPart.scale, time2/2, { x: 1, y: 1, ease: 'cubic.in' });
            gsap.to(blowPart.scale, time2/2, { x: 0, y: 0, delay: time2/2, ease: 'cubic.out' });

            this.sprite.addChild(blowPart);
        }

        this.sprite.addChild(this.flash);

        for (let index = 0; index < 8; index++) {
            let radius = 40 + 20 * Math.random();
            let angle = index * 2 * Math.PI / 8 + Math.PI / 8 * Math.random();
            let x = radius * Math.cos(angle);
            let y = radius * Math.sin(angle);
            let blowPart = new PIXI.Sprite(assets.textures.pixi.smoke1);
            blowPart.anchor.set(0.5);
            blowPart.scale.set(0.0);
            blowPart.rotation = angle + Math.PI / 2;

            gsap.to(blowPart, time2, { x, y, ease: 'cubic.out' });
            gsap.to(blowPart, time2, { alpha: 0, delay: time2/2 });
            gsap.to(blowPart.scale, time2/2, { x: 1, y: 1, ease: 'cubic.in' });
            gsap.to(blowPart.scale, time2/2, { x: 0, y: 0, delay: time2/2, ease: 'cubic.out' });

            this.sprite.addChild(blowPart);
        }

        gsap.to(this.flash, time2/2, { alpha: 0, delay: time2/2 });
        gsap.from(this.flash.scale, time2, { x: 0, y: 0, ease: 'quad.out' });

        gsap.delayedCall(1.0, ()=>{
            this.sprite.destroy();
        });
        
    }
}