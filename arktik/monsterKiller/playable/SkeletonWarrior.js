class SkeletonWarior {
    model;
    body;
    sensor;

    speed = 0;
    maxSpeed = 0.15;

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

        let skeletonWariorMaterial = new THREE.MeshLambertMaterial({
            map: assets.textures.three['skeletonWarrior']
        });

        let swordMaterial = new THREE.MeshLambertMaterial({
            map: assets.textures.three['shield']
        });

        this.model.getObjectByName('SkeletonWarrior').material = skeletonWariorMaterial;
        this.model.getObjectByName('Sword').material = swordMaterial;

        addAnimationMixer( this.model, assets.models.skeletonWarior.v_data.animations );
        this.model.animation.set('Idle');
    }

    #initPhysBody() {
        let circleShape = new CircleShape(1);
        this.body = app.physics.addModel( this.model, circleShape );

        let sensorCircleShape = new CircleShape(14);
        this.sensor = app.physics.addModel( this.model, sensorCircleShape, false, true );
    }

    #initStateMachine() {
        let idleState = new EnemyIdleState( this, 'Idle' );
        let followState = new FollowCharacterState( this, 'Run' );
        let attackState = new EnemyAttackState( this, 'Attack' );
       
        let stateMachine = new StateMachine( idleState, followState, attackState );
        stateMachine.set( EnemyIdleState );

        this.stateMachine = stateMachine;
    }

    #update = () => {
        this.stateMachine.update();
    }

}