class UpgradeCircle {
    object3d = new THREE.Group();
    parts = [];
    currentPart;    
    tweenTime = 0.3;

    constructor() {
        let upgradeCircle = new THREE.Mesh(new THREE.PlaneGeometry(0.65, 0.65), app.materials.upgrade);        
        upgradeCircle.rotation.x = -Math.PI/2;
        this.object3d.add( upgradeCircle );

        let glow = app.obj3d.glow.clone();
        glow.position.y = 0.02;
        glow.scale.y = 0.8;
        glow.visible = true;        
        this.object3d.add( glow );     

        let particles = new CircleParticleEmitter( BlueSpriteParticle, 0.26, 30 );
        this.object3d.add( particles.model );

        gsap.to( this.object3d.rotation, 6, {y: 2*Math.PI, repeat: -1, ease:'linear'});
        gsap.to( particles.model.rotation, 12, {y: 2*Math.PI, repeat: -1, ease:'linear'});
        
        this.object3d.position.y = 0.05;
        app.events.on(app.events.HIDE_PARTS, this.hidePart.bind(this));

        this.glow = glow;
        this.particles = particles;        
    }


    addUpgradePart( partNames, size=0.5 ) {
        let clonedPart = new THREE.Object3D();	
        clonedPart.partNames = partNames;
        clonedPart.position.y = 0.1;
        clonedPart.visible = false;
        clonedPart.layers.enable(1);

        for ( let partName of partNames ) {
            let part = assets.models.hero.getObjectByName(partName);
            let partGeometry = part.geometry.clone();
            let bounds = partGeometry.boundingBox;
            let boundSizeY = bounds.max.y - bounds.min.y;
            let scale = size / boundSizeY;

            let placeY = bounds.min.y;

            partGeometry.translate(0, -bounds.min.y, 0);     
        
            let mesh = new THREE.Mesh(partGeometry, app.materials.part);
            mesh.circle = this;

            clonedPart.scale.set(scale, scale, scale);
            clonedPart.placeY = placeY;    
            clonedPart.name = partName;

            clonedPart.add(mesh);
        }        
        
        this.object3d.add( clonedPart );
        this.parts.push(clonedPart);
    }    

    showPart( id, delay=0 ) {        
        this.currentPart = this.parts[id];
        this.currentPart.visible = true;

        gsap.to( this.glow.scale, this.tweenTime, {y: 0.8, delay} );
        gsap.from( this.currentPart.scale, this.tweenTime, {x:0, y:0, z:0, delay, ease:'back.out', onComplete:() => {
            this.currentPart.children.forEach( child => child.layers.enable(1) );
            gsap.to(this.currentPart.position, 1.7, {y:'+=0.05', yoyo:true, repeat:-1, ease:Sine.easeInOut});	
        }} );
    }

    hidePart( delay=0 ) {
        this.currentPart.children.forEach( child => child.layers.enable(0) );

        gsap.to( this.glow.scale, this.tweenTime, {y: 0, delay} );
        if ( !this.currentPart.isClick ) {
            gsap.to( this.currentPart.scale, this.tweenTime, {x:0, y:0, z:0, delay, ease:'sine.in', onComplete:() => {
                this.currentPart.visible = false;
            }} );  
        }              
    }

    hide() {
        gsap.killTweensOf( this.object3d.rotation );
        if ( !this.currentPart.isClick ) gsap.killTweensOf( this.currentPart.position );
        gsap.to( this.object3d.scale, this.tweenTime, {x: 0, y: 0, z: 0, ease:'sine.out'} );
        this.particles.stopEmit();
    }
}