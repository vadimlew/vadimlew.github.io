class Coin {
    model;
    body;

    constructor( coinTemplate ) {
        this.#initModel( coinTemplate );        
    }

    startFightPhase() {
        this.#initPhysBody();       
    }

    #initModel( coinTemplate ) {        
        this.model = coinTemplate.clone();  
        
        this.particles = new CircleParticleEmitter( YellowSpriteParticle, 0.25, 5, 0.3 );
        this.model.add( this.particles.model );
    }

    #initPhysBody() {
        this.body = new CANNON.Body({
            mass: 1,
            isSensor: true,
            position: new CANNON.Vec3(this.model.position.x, this.model.position.y, this.model.position.z),            
            fixedRotation: true	
        });	
        this.body.addShape( new CANNON.Box( new CANNON.Vec3(0.3, 0.3, 0.05) ), new CANNON.Vec3(0, 0, 0) );
        app.cannon.world.addBody(this.body);
        app.cannon.linkModelToBody(this.model, this.body);       

        this.body.addEventListener( CANNON.Body.COLLIDE_EVENT_NAME, this.onBodyCollide );
    } 

    onBodyCollide = ({body}) => {        
        if ( body.character?.constructor == Player ) {   
            this.body.removeEventListener( CANNON.Body.COLLIDE_EVENT_NAME, this.onBodyCollide );         
            app.cannon.deleteLink(this.body);
            app.cannon.world.removeBody(this.body);

            gsap.to( this.model.position, 0.4, {y: 2, ease:'sine.out', onComplete: ()=>{
                this.model.visible = false;
                this.particles.stopEmit();
            }});

            gsap.to( this.model.rotation, 0.4, {y: Math.PI*2, ease:'sine.inOut'} );

            app.obj2d.coinsBar.addCoin();

            playSound('coins');
        }        
    }
}