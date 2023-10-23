class FollowCameraHelper {
    camera;
    target;
    lookPosition;
    offset;
    lookOffset;
    dump;
    shakeOffset = new THREE.Vector3();
    shakeForce = new THREE.Vector3();

    constructor( camera, target, offset, look, dump=0.15 ) {
        this.camera = camera;
        this.target = target;
        this.lookPosition = target.position.clone();
        this.offset = new THREE.Vector3().fromArray(offset);
        this.lookOffset = new THREE.Vector3().fromArray(look);
        this.dump = dump;

        app.update.add( this.update.bind(this) );
    }   

    update() {        
        this.camera.position.x += (this.target.position.x + this.offset.x - this.camera.position.x) * this.dump;
        this.camera.position.y += (this.target.position.y + this.offset.y - this.camera.position.y) * this.dump;
        this.camera.position.z += (this.target.position.z + this.offset.z - this.camera.position.z) * this.dump;        

        this.lookPosition.x += (this.target.position.x + this.lookOffset.x - this.lookPosition.x) * this.dump;
        this.lookPosition.y += (this.target.position.y + this.lookOffset.y - this.lookPosition.y) * this.dump;
        this.lookPosition.z += (this.target.position.z + this.lookOffset.z - this.lookPosition.z) * this.dump;
               
        this.lookPosition.add( this.shakeOffset );
        this.camera.position.add( this.shakeOffset );

        this.camera.lookAt( this.lookPosition );
    }

    shake( force = 0.25 ) {
        this.shakeOffset.set( 
            0,//Math.random() > 0.5? -force : force,
            force,
            0//Math.random() > 0.5? -force : force
        );

        gsap.to( this.shakeOffset, 1.0, { x: 0, y: 0, z: 0, ease: Elastic.easeOut.config(1.1, 0.2), overwrite: true } );
    }
}