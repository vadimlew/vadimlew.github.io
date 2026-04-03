class FollowCameraHelper {
    camera;
    target;
    lookPosition;
    offset;
    look;
    dump;
    shakeOffset = new THREE.Vector3();
    shakeForce = new THREE.Vector3();

    constructor(camera, target, offset, look, dump=0.15) {
        this.camera = camera;
        this.target = target;
        this.lookPosition = target.position.clone();
        this.offset = new THREE.Vector3().fromArray(offset);
        this.look = new THREE.Vector3().fromArray(look);
        this.dump = dump;

        app.update.add( this.update.bind(this) );        
    }   

    update() {        
        this.camera.position.x += (this.target.position.x + this.offset.x - this.camera.position.x) * this.dump;
        this.camera.position.y += (this.target.position.y + this.offset.y - this.camera.position.y) * this.dump;
        this.camera.position.z += (this.target.position.z + this.offset.z - this.camera.position.z) * this.dump;        

        this.lookPosition.x += (this.target.position.x + this.look.x - this.lookPosition.x) * this.dump;
        this.lookPosition.y += (this.target.position.y + this.look.y - this.lookPosition.y) * this.dump;
        this.lookPosition.z += (this.target.position.z + this.look.z - this.lookPosition.z) * this.dump;

        this.shakeForce.lerp( this.shakeOffset, 0.3 );       
        this.shakeOffset.sub(this.shakeForce);
       
        this.lookPosition.add( this.shakeOffset );
        this.camera.lookAt( this.lookPosition );
    }

    shake() {
        this.shakeOffset.set( 
            Math.random() > 0.5? -0.25 : 0.25,
            Math.random() > 0.5? -0.25 : 0.25,
            Math.random() > 0.5? -0.25 : 0.25
        );

        //this.shakeForce.copy( this.shakeOffset );
    }
}