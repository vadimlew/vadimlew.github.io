class Player {
    model;
    body;
    sensor;
    stateMachine;

    speed = 0;
    maxSpeed = 0.2 / 4;

    constructor() {
        this.#initModel();      
        this.#initPhysBody();
        this.#initStateMachine();       

        app.update.add(this.#update);
    }

    #initModel() {
        this.model = assets.models.player;
        this.model.rotation.y = Math.PI/2;   
        this.model.scale.setScalar(1.3);     
        this.model.name = 'player';

        this.model.traverse( obj => {
            if (obj.type == 'Bone') return;

            obj.castShadow = true;
            obj.receiveShadow = true;
        });

        let playerBodyMaterial = new THREE.MeshLambertMaterial({
            map: assets.textures.three['playerBody']
        });	

        let playerCoatMaterial = new THREE.MeshLambertMaterial({
            map: assets.textures.three['playerCoat']
        });	

        let gunMaterial = new THREE.MeshLambertMaterial({
            map: assets.textures.three['dualRevolvers']
        });	

        this.model.getObjectByName('Van_Helsing_Castle_Body').material = playerBodyMaterial;
        this.model.getObjectByName('Van_Helsing_Castle_Boots').material = playerCoatMaterial;
        this.model.getObjectByName('Van_Helsing_Castle_Coat').material = playerCoatMaterial;

        this.model.getObjectByName('Dual_RevolverR').material = gunMaterial;
        this.model.getObjectByName('Dual_RevolverL').material = gunMaterial;


        addAnimationMixer( this.model );
        this.model.animation.set( 'Run' );
    }

    #initPhysBody() {
        let circleShape = new CircleShape(1);
        this.body = app.physics.addModel( this.model, circleShape );
        this.body.drag = 0.7;
        this.body.character = this;

        let ray = new Ray(8);
        this.ray = app.physics.addModel( this.model, ray );

        this.ray.events.on( VerletBody.EVENT_COLLIDE, (body)=>{
            //console.log(body);
        });
    }

    #initStateMachine() {
        let idleState = new IdlePlayerState( this, 'Run' );
        let walkState = new WalkPlayerState( this, 'Run' );
       
        let stateMachine = new StateMachine( idleState, walkState );
        stateMachine.set( IdlePlayerState );

        this.stateMachine = stateMachine;
    }

    #update = () => {
        this.stateMachine.update();
    }

}