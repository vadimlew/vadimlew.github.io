class Camera {

    constructor( followObject, scrolledObject ) {
        this.followObject = followObject || new PIXI.Sprite();
        this.scrolledObject = scrolledObject || new PIXI.Sprite();

        app.loop.add( this.update );
    }

    update = () => {
        this.scrolledObject.x = -this.followObject.x * this.scrolledObject.scale.x;
        this.scrolledObject.y = -this.followObject.y * this.scrolledObject.scale.y;
    }
}