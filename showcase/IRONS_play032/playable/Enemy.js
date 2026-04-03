class Enemy {
    model;
    body;
    stateMachine;
    isHit = false;

    speed = 0.4;   

    constructor() {
       this.#initModel();
    }

    startFightPhase() {
        this.#initPhysBody();
        this.#initStateMachine();
        app.update.add(this.#update);
    }

    stopFightPhase() {        
        this.stateMachine.set(IdleEnemyState); 
        this.model.visible = false;
        //app.update.delete(this.#update);
    }

    #initModel() {
        this.model = THREE.SkeletonUtils.clone(assets.models.enemy);

        this.model.getObjectByName('Armature').children.forEach((obj) => {
            if (obj.type == 'Bone') return;
            obj.castShadow = true;
            obj.receiveShadow = true;
        });	
        
        this.model.getObjectByName('Boss').visible = false;
        this.model.material = app.materials.hero.clone();
        this.model.getObjectByName('Enemy').material = this.model.material;
        this.model.getObjectByName('Enemy').frustumCulled = false; 

        addAnimationMixer( this.model, assets.models.enemy.v_data.animations );
        this.model.anim.set( 'Idle_Enemy' );
        this.model.anim.action['Death_Enemy'].setLoop( THREE.LoopOnce );
    }

    #initPhysBody() {
        this.body = new CANNON.Body({
            mass: 20,
            position: new CANNON.Vec3(this.model.position.x, this.model.position.y, this.model.position.z),
            material: app.cannon.frictionMaterial,
            fixedRotation: true	
        });	
        this.body.addShape( new CANNON.Cylinder(0.45, 0.45, 2, 6), new CANNON.Vec3(0, 1, 0) );
        app.cannon.world.addBody(this.body);

        this.body.character = this;        
    } 

    #initStateMachine() {
        let idleState = new IdleEnemyState( app.obj3d.player, this, 'Idle_Enemy' );
        let walkState = new WalkEnemyState( app.obj3d.player, this, 'Run_Enemy' );
        let deathState = new DeathEnemyState( this, 'Death_Enemy' );

        let stateMachine = new StateMachine( idleState, walkState, deathState );
        stateMachine.set(IdleEnemyState);

        this.stateMachine = stateMachine;
    }

    #update = () => {       
        this.model.position.lerp( this.body.position, 0.5 );
        this.stateMachine.update();
    }
}


class Boss {
    model;   

    constructor() {
       this.#initModel();
    }   

    #initModel() {
        this.model = THREE.SkeletonUtils.clone(assets.models.enemy);

        this.model.getObjectByName('Armature').children.forEach((obj) => {
            if (obj.type == 'Bone') return;
            obj.castShadow = true;
            obj.receiveShadow = true;
        });	
        
        this.model.getObjectByName('Boss').visible = true;       
        this.model.getObjectByName('Enemy').visible = false;       
        this.model.getObjectByName('Boss').material = app.materials.hero.clone();
        this.model.getObjectByName('Boss').frustumCulled = false; 

        addAnimationMixer( this.model, assets.models.enemy.v_data.animations );
        this.model.anim.set( 'Idle_Enemy' );        
    }    
}


class IdleEnemyState extends State {
    player;
    character;
    idleAnimationName;
    
    constructor(player, character, idleAnimationName) {
        super();
        this.player = player;        
        this.character = character;        
        this.idleAnimationName = idleAnimationName;     

        this.addPredicate( new WalkEnemyPredicate(character, player) );        
    }

    enter() {        
        this.character.model.anim.set( this.idleAnimationName );
    }    
}


class WalkEnemyState extends State {
    player;
    character;
    runAnimationName;

    constructor(player, character, runAnimationName) {
        super();
        
        this.player = player;
        this.character = character;
        this.runAnimationName = runAnimationName;         
    }

    enter() {
        this.character.model.anim.set( this.runAnimationName );
    }

    update() {
        let dx = this.player.body.position.x - this.character.body.position.x;
        let dz = this.player.body.position.z - this.character.body.position.z;

        this.character.model.rotation.y = Math.atan2(dx, dz);

        let vx = this.character.speed * Math.sin(this.character.model.rotation.y);
        let vz = this.character.speed * Math.cos(this.character.model.rotation.y);       

        this.character.body.velocity.x += vx;
        this.character.body.velocity.z += vz;
    }
}


class DeathEnemyState extends State {    
    character;
    deathAnimationName;
    
    constructor(character, deathAnimationName) {
        super();        
        this.character = character;        
        this.deathAnimationName = deathAnimationName;           
    }

    enter() {
        this.character.model.anim.set( this.deathAnimationName );       

        gsap.to( this.character.model.material.color, 0.5, {r:0, g:0, b:0} ); 

        this.character.body.removeShape( this.character.body.shapes[0] );
        this.character.body.quaternion.setFromEuler( ...this.character.model.rotation.toArray() );
        this.character.body.addShape( new CANNON.Cylinder(0.45, 0.45, 0.02, 6), new CANNON.Vec3(0, 0.01, -1) );
    }    
}


class WalkEnemyPredicate extends Predicate {
    character;
    player;

    constructor(character, player) {
        super();
        this.character = character;        
        this.player = player;        
    }

    check() {      
        let distance = this.character.body.position.distanceTo( this.player.body.position );   
        if (app.stateGame === app.states.FIGHT && distance <= 4) {
            this.stateMachine.set(WalkEnemyState);
        }
    }
}
