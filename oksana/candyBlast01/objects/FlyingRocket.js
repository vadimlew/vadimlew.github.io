class FlyingRocket {
    sprite;

    constructor(x, y, nx, ny) {
        let smokes = [];

        this.sprite = new PIXI.Container();
        this.sprite.position.set(x + nx * 20, y + ny * 20);
        this.sprite.scale.set(0.7);

        this.sprite.rotation = Math.PI/2 + Math.atan2(ny, nx);

        let cap = new PIXI.Sprite(assets.textures.pixi.rocketCap);
        cap.anchor.set(0.5);
        cap.angle = 90;
        cap.scale.set(0.75);

        let trail = new PIXI.Sprite(assets.textures.pixi.rocketTrail);
        trail.anchor.set(1.0, 0.5);
        trail.angle = -90;

        gsap.to(this.sprite, 0.7, { x: x + nx*1800, y: y + ny*1800, ease: 'quad.in', onComplete: ()=>{
            gsap.killTweensOf(trail.scale);
            smokes.forEach(smoke => gsap.killTweensOf(smoke));
            this.sprite.destroy();
        }});

        gsap.from(trail.scale, 0.2, {x: 0.0, ease: 'sine.in'});
        gsap.to(trail.scale, 0.25, {x: 0.95, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 0.2});
        gsap.to(trail.scale, 0.2, {y: 0.96, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 0.2});

        for (let index = 0; index < 25; index++) {
            let smoke = new PIXI.Sprite(assets.textures.pixi.smoke3);
            smoke.anchor.set(0.5);
            smoke.x = 25 * Math.random() * (index % 2 === 0 ? 1 : -1);
            smoke.y = 20 + 20 * Math.random();	
            smoke.scale.set(0.7);
            smoke.alpha = 0;

            let delay = index * 0.05;

            gsap.to( smoke, 0.2, {alpha: 1, ease: 'quad.in', repeat: -1, delay, repeatDelay: 0.8 } );
            gsap.to( smoke, 0.5, {y: 380, x: 0, ease: 'quad.in', repeat: -1, delay, onUpdate: ()=>{
                let scale = Math.min( 0.6, (380 - smoke.y) / 150); 
                smoke.scale.set(scale);
            }} );
            
            smokes.push(smoke);

            this.sprite.addChild(smoke);
        }

        this.sprite.addChild(cap, trail);        
    }
}