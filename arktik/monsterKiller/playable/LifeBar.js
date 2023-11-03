class LifeBar extends PIXI.Container {
    line;
    player;

    constructor( player ) {
        super();

        this.player = player;

        let bg = new PIXI.Sprite( assets.textures.pixi['lifebar'] );
        bg.anchor.set(0.5);

        let line = new PIXI.Sprite( assets.textures.pixi['greenStrip'] );
        line.anchor.set(0.5);
        line.y = -2;

        let mask = new PIXI.Graphics();
        mask.beginFill(0);
        mask.drawRect( -line.width/2, -line.height/2, line.width, line.height );        
        mask.y = -2;

        line.mask = mask;

        this.line = line;
        this.addChild(mask, line, bg );

        this.update();
    }

    update() {
        let ratio = 1 - this.player.life / this.player.maxLife;
        this.line.x = -this.line.width * ratio;
    }
}