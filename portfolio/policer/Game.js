function shakeWorld() {
    let angle = 2*Math.PI*Math.random();
	let dx = 0.08 * Math.cos(angle);
	let dy = 0.08 * Math.sin(angle);

	gsap.to(app.obj3d.main.position, 0.1, {x:dx, z:dy, ease:'sine.in'});
	gsap.to(app.obj3d.main.position, 0.7, {x:0, z:0, ease:'elastic.out', delay:0.1});
}


function putInJail() {
    if (app.stateGame === 'game_end') return;

    let player = app.obj3d.player;
    
    if (app.obj3d.jailPlaces.length === 0) return;
    if (player.stack.length === 0) return;    

    if (app.obj3d.policeLabel.putTimer <= 0) {
        app.obj3d.policeLabel.putTimer = 5;

        let criminal = player.stack.pop();
        let place = app.obj3d.jailPlaces.shift();

        app.obj2d.progressbar.add(100 / 10);
        //app.obj2d.progressbar.add(50);
        gsap.killTweensOf(criminal.position);

        app.obj3d.main.add(criminal);
        criminal.position.copy(place);
        criminal.rotation.set(0, -Math.PI/2, 0);
        criminal.anim.set('Panic');

        playSound("sCoin");        
    } else {
        app.obj3d.policeLabel.putTimer--;
    }
}


function showPoliceLabel() {
    let policeLabel = app.obj3d.world.getObjectByName('policeLabel');
	let glowedTube = app.obj3d.world.getObjectByName('policeLabel2');

    policeLabel.visible = true;
    glowedTube.visible = true;
   
    // gsap.delayedCall(1, ()=>{
    //     app.camera3d.followState.target = policeLabel;
    // });

    // gsap.delayedCall(2.5, ()=>{
    //     app.camera3d.followState.target = app.obj3d.player;
    // });

    addCursor(app.obj3d.player, policeLabel);

	app.phys.add(policeLabel, {shape:'circle', radius:0.15, isSensor:true});   
}


function addCursor(parent, followTo) {
	let geometry = new THREE.ConeGeometry( .015, .025, 4, 1 );
	geometry.translate( 0, 0.05, 0 );
	geometry.rotateY( Math.PI/4 );
	geometry.rotateX( Math.PI/2 );
	geometry.scale(1, 0.1, 1);
	
	let material = new THREE.MeshBasicMaterial( {color: 0x009900} );
	let cone = new THREE.Mesh( geometry, material );
	cone.name = 'arrow';
	cone.position.y = 0.03;
	cone.scale.set(5, 5, 5);
	parent.add( cone );

	let geometry2 = new THREE.ConeGeometry( .015, .025, 4, 1 );
	geometry2.scale(1.11, 1.11, 1.11);
	geometry2.translate( 0, 0.0445, 0 );
	geometry2.rotateY( Math.PI/4 );
	geometry2.rotateX( Math.PI/2 );	
	geometry2.scale(1, 0.1, 1);
	
	let material2 = new THREE.MeshBasicMaterial( {color: 0xdddddd} );
	let cone2 = new THREE.Mesh( geometry2, material2 );
	cone2.name = 'arrow';
	cone2.position.y = -0.001;
	cone2.scale.set(1.15, 1.15, 1.15);
	cone.add( cone2 );

    parent.followArrow = cone;

	function follow() {
		let dx = followTo.position.x - parent.position.x;
		let dz = followTo.position.z - parent.position.z;
		let angle = Math.atan2(dx, dz);
		cone.rotation.y = angle - parent.rotation.y;		
	}

	app.update.push(follow);
}


function winGame() {
    playSound("sPopup");

    app.obj3d.player.phys.destroy();
    app.obj2d.joystick.stop();
    app.update.length = 0;

    app.obj2d.winScreen.show();

    // let car = app.obj3d.world.getObjectByName('policeCar');
    // car.visible = true,
    // gsap.from(car.position, 1, {y:0.4, ease:'bounce.out', onComplete:()=>{
    //     app.obj2d.winScreen.show();
    // }}); 
    
    appEndGame();
}


class CameraFollowState extends State {
    constructor({camera, target, offset, lerpSpeed=0.15}) {
        super();
        this.camera = camera;
        this.target = target;
        this.offset = offset;
        this.lerpSpeed = lerpSpeed;
    }

    update() {
        this.camera.posTo.copy(this.target.position);
		this.camera.posTo.add(this.offset);
		this.camera.lookTo.copy(this.target.position);

        this.camera.position.lerp(this.camera.posTo, this.lerpSpeed);
        this.camera.lookNow.lerp( this.camera.lookTo, this.lerpSpeed);
        this.camera.lookAt(this.camera.lookNow);
    }
}



class PlayerIdleState extends State {
    constructor(player) {
        super();
        this.player = player;       
    }

    enter() {        
        this.player.anim.set('Idle', 0.35);       
    }    

    update() {        
        if (this.player.toSpeed > 0) 
            this.stateMachine.set(PlayerWalkState);
    }
}


class PlayerWalkState extends State {
    constructor(player) {
        super();
        this.player = player;
    }

    enter() {
        this.player.anim.set('Run', 0.35);        
    }

    update() { 
        this.player.rotation.y %= 2*Math.PI;

        let dr = this.player.toRotate - this.player.rotation.y;
        if (dr > Math.PI) dr -= 2*Math.PI;
        if (dr < -Math.PI) dr += 2*Math.PI;

        this.player.rotation.y += dr / 4;        
        this.player.speed += (this.player.toSpeed - this.player.speed) / 4;

        this.player.position.x += this.player.speed * Math.sin(this.player.rotation.y);
        this.player.position.z += this.player.speed * Math.cos(this.player.rotation.y);

        if (this.player.toSpeed == 0) 
            this.stateMachine.set(PlayerIdleState);
    }    
}


class PlayerAttackState extends State {
    constructor(player) {
        super();
        this.player = player;
    }

    enter() {
        this.player.club.visible = true;
		this.player.anim.set('Kick');   
        app.obj3d.kickEffect.show();    
        //playSound("sAttack_"+randomInteger(0, 5));
        this.player.anim.mixer.addEventListener('finished', this.animEndHandler);
    }

    exit() {
        this.player.anim.mixer.removeEventListener('finished', this.animEndHandler);
    }

    animEndHandler = () => {
        this.player.club.visible = false;
        this.stateMachine.set(PlayerIdleState);
    }
}


class EnemyWalkState extends State {
    constructor(enemy) {
        super();
        this.enemy = enemy;
        this.runTimer = 0;
        this.changeDirection();
    }

    enter() {        
        this.enemy.anim.set('Run', 0.35);       
        this.enemy.phys.event.on('contact', this.contactHandler); 
    }

    update() {
        this.enemy.rotation.y %= 2*Math.PI;

        let dr = this.enemy.toRotate - this.enemy.rotation.y;
        if (dr > Math.PI) dr -= 2*Math.PI;
        if (dr < -Math.PI) dr += 2*Math.PI;

        this.enemy.rotation.y += dr / 4;
        this.enemy.position.x += this.enemy.speed * Math.sin(this.enemy.rotation.y);
        this.enemy.position.z += this.enemy.speed * Math.cos(this.enemy.rotation.y);     
        
        this.runTimer--;
        if (this.runTimer <= 0) this.changeDirection();
    }

    exit() {
        this.enemy.phys.event.off('contact', this.contactHandler);
    }

    changeDirection() {
        this.runTimer = 30 + 30*Math.random();
        this.enemy.toRotate = 2*Math.PI * Math.random();
    }

    contactHandler = (contact) => {
        if (contact.phys.isStatic || contact.name == 'criminal' || contact.name == 'citizen') {           
            this.enemy.toRotate += 0.1 + 0.1*Math.random();
		}
    }
}

class EnemyDeathState extends State {
    constructor(enemy) {
        super();
        this.enemy = enemy;
    }

    enter() { 
        this.enemy.anim.set('Dead', 0.35);
        // app.obj2d.criminalBar.add();
        app.obj3d.money.show(this.enemy.position);
        app.obj3d.smile.show(this.enemy.position);
       
        removeFromArray(this.enemy, app.obj3d.enemies);
        playSound("hit_" + randomInteger(0, 2));
        this.enemy.anim.mixer.addEventListener('finished', this.animEndHandler);
    }

    animEndHandler = () => {
        let player = app.obj3d.player;        

        gsap.delayedCall(0.25, ()=>{    
            player.stack.push(this.enemy);        
            //this.enemy.anim.action.Dead.time = 0.2 + 0.1 * Math.random();
            this.enemy.gun.visible = false;
            this.enemy.position.set(0.12, 0.2 + player.stack.length * 0.08, -0.15);
            this.enemy.rotation.set(0, Math.PI/2 + (-0.1 + 0.2*Math.random()), Math.PI + (-0.1 + 0.2*Math.random()));
            player.add(this.enemy);

            gsap.from(this.enemy.position, 0.2, { y: '+=0.15', ease: 'quad.in' });            
        });   
        
        this.enemy.anim.mixer.removeEventListener('finished', this.animEndHandler);        
    }
}


class CitizenWalkState extends State {
    constructor(citizen) {
        super();
        this.citizen = citizen;
        this.runTimer = 0;
        this.changeDirection();
    }

    enter() {        
        this.citizen.anim.set('Walk', 0.35);
        this.citizen.phys.event.on('contact', this.contactHandler);
    }

    update() {
        this.citizen.rotation.y %= 2*Math.PI;

        let dr = this.citizen.toRotate - this.citizen.rotation.y;
        if (dr > Math.PI) dr -= 2*Math.PI;
        if (dr < -Math.PI) dr += 2*Math.PI;

        this.citizen.rotation.y += dr / 4;
        this.citizen.position.x += this.citizen.speed * Math.sin(this.citizen.rotation.y);
        this.citizen.position.z += this.citizen.speed * Math.cos(this.citizen.rotation.y);
        
        this.runTimer--;
        if (this.runTimer <= 0) this.changeDirection();
    }

    exit() {
        this.citizen.phys.event.off('contact', this.contactHandler);
    }

    changeDirection() {
        this.runTimer = 60 + 60*Math.random();
        this.citizen.toRotate = 2*Math.PI * Math.random();
    }

    contactHandler = (contact) => {
        if (contact.phys.isStatic || contact.name == 'criminal' || contact.name == 'citizen') {
            this.citizen.toRotate += 0.1 + 0.1*Math.random();
		}
    }
}