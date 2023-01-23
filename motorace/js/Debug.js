class Debug {
    static drawPhysBody(body, sprite, chamfer=0) {
        let graphics = new PIXI.Graphics();
        graphics.beginFill(0x00ff00);

        let dx = body.bounds.max.x - body.bounds.min.x;
        let dy = body.bounds.max.y - body.bounds.min.y;
        graphics.drawRoundedRect(-dx/2, -dy/2, dx, dy, chamfer);       

        sprite.addChild(graphics);

        return graphics;
    }
}