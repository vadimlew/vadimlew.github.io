class SkeletonMage {
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
        this.model = assets.models.skeletonMage;
        this.model.scale.setScalar(1.2);

        this.model.traverse( obj => {
            if (obj.type == 'Bone') return;

            obj.castShadow = true;           
        });        

        this.model.getObjectByName('SkeletonMage').material = app.materials.skeletonMage;       

        addAnimationMixer( this.model );
        this.model.animation.set('Idle');
    }

    #initPhysBody() {
        let circleShape = new CircleShape( 1.6 );
        this.body = app.physics.addModel( this.model, circleShape );
        this.body.character = this;

        let sensorCircleShape = new CircleShape(12);
        this.sensor = app.physics.addModel( this.model, sensorCircleShape, false, true );
    }

    #initStateMachine() {      
        // this.stateMachine = new StateMachine(
        //     new EnemyIdleState( this, 'Idle' ),
        //     new FollowCharacterState( this, 'Run' ),
        //     new EnemyAttackState( this, 'Attack', 0.6 ),
        //     new EnemyReactState( this, 'Hit' ),
        //     new EnemyDeathState( this, 'Death' )
        //  );

        // this.stateMachine.set( EnemyIdleState );
    }

    #update = () => {
        //this.stateMachine.update();
    }
}