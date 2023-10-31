class SkeletonWarior {
    model;
    body;
    sensor;

    speed = 0;
    maxSpeed = 0.13;
    life = 100;

    constructor() {
        this.#initModel();
        this.#initPhysBody();
        this.#initStateMachine();

        app.update.add(this.#update);
    }

    #initModel() {
        this.model = THREE.SkeletonUtils.clone( assets.models.skeletonWarior );
        this.model.scale.setScalar(0.8);

        this.model.traverse( obj => {
            if (obj.type == 'Bone') return;

            obj.castShadow = true;
            obj.receiveShadow = true;
        });

        let skeletonWariorMaterial = new THREE.MeshBasicMaterial({
            map: assets.textures.three['skeletonWarrior']
        });

        let swordShildMaterial = new THREE.MeshBasicMaterial({
            map: assets.textures.three['shield']
        });

        this.model.getObjectByName('SkeletonWarrior').material = skeletonWariorMaterial;
        this.model.getObjectByName('Sword').material = swordShildMaterial;
        this.model.getObjectByName('Shield').material = swordShildMaterial;

        addAnimationMixer( this.model, assets.models.skeletonWarior.v_data.animations );
        this.model.animation.set('Idle');
    }

    #initPhysBody() {
        let circleShape = new CircleShape( 0.9 );
        this.body = app.physics.addModel( this.model, circleShape );
        this.body.character = this;

        let sensorCircleShape = new CircleShape(14);
        this.sensor = app.physics.addModel( this.model, sensorCircleShape, false, true );
    }

    #initStateMachine() {      
        this.stateMachine = new StateMachine(
            new EnemyIdleState( this, 'Idle' ),
            new FollowCharacterState( this, 'Run' ),
            new EnemyAttackState( this, 'Attack', 0.6 ),
            new EnemyReactState( this, 'Hit' ),
            new EnemyDeathState( this, 'Death' )
         );

        this.stateMachine.set( EnemyIdleState );       
    }

    #update = () => {
        this.stateMachine.update();
    }
}