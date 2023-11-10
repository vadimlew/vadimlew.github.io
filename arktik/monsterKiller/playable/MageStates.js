class MageIdleState extends State {
    character;
    idleAnimationName;
    reloadTime = 0;
    
    constructor(character, idleAnimationName) {
        super();
        this.character = character;
        this.idleAnimationName = idleAnimationName;
    }

    enter() {
        this.reloadTime = 0;
        this.character.model.animation.set( this.idleAnimationName, 0.25 );
        this.character.sensor.events.on( VerletBody.EVENT_COLLIDE, this.onCollide );
    }

    onCollide = (body)=>{
        this.reloadTime++;

        if ( this.reloadTime > 50 && body.character instanceof Player && Math.random() > 0.5 ) {
            this.stateMachine.set( MageAttackState, body.character );
        }
    }

    exit() {
        this.character.sensor.events.off( VerletBody.EVENT_COLLIDE, this.onCollide );
    }
}


class MageAttackState extends State {
    character;
    hitTime;
    attackAnimationName;  
    attacked; 
    isHit = false; 
    
    constructor(character, attackAnimationName, hitTime) {
        super();
        this.character = character;
        this.attackAnimationName = attackAnimationName;
        this.hitTime = hitTime;
        
        this.character.model.animation.action[attackAnimationName].setLoop( THREE.LoopOnce );
    }

    enter( attacked ) {
        this.isHit = false;
        this.attacked = attacked;
        this.character.model.animation.set( this.attackAnimationName, 0.0 );
        this.character.model.animation.mixer.addEventListener( 'finished', this.onAnimationFinshed );
        this.character.model.animation.action[this.attackAnimationName].time = Math.random() * 0.5;

        playSound('fireball');
    }

    update() {    
        let dx = this.attacked.model.position.x - this.character.model.position.x;
        let dz = this.attacked.model.position.z - this.character.model.position.z;        
        this.character.model.rotation.y = Math.atan2(dx, dz);

        if( !this.isHit && this.character.model.animation.action[this.attackAnimationName].time >= this.hitTime ) {
            this.attack();
        }
    }

    attack() {
        this.isHit = true;
        this.character.shoot();
    }

    onAnimationFinshed = () => {
        this.stateMachine.set( MageIdleState );
    }

    exit() {
        this.character.model.animation.mixer.removeEventListener( 'finished', this.onAnimationFinshed );
    }
}
