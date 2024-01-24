class WaitTask extends Task {
    #time;

    constructor({ time }) {
        super();
        this.#time = time;
        this.isAsync = true;
    }

    do() {
        gsap.delayedCall( this.#time, this.onComplete );
    }	
}


class FuncTask extends Task {
    #func;
    #args;

    constructor({ func, args=[], isAsync=false }) {
        super();
        this.#func = func;
        this.#args = args;
        this.isAsync = isAsync;
    }

	do() {
        this.#func( ...this.#args );
        if ( !this.isAsync ) this.onComplete();
    }	
}


class AnimTask extends Task {
    #obj3d;
    #state;
    #finishState;
    #fadeTime;
	
    constructor({ obj3d, state, finishState, fadeTime=0.1, isAsync=false }) {
        super();
        this.#obj3d = obj3d;
        this.#state = state;
        this.#finishState = finishState;
        this.#fadeTime = fadeTime;
        this.isAsync = isAsync;
    }

    do() {        
        this.#obj3d.anim.set( this.#state, 0, this.#fadeTime );

        if ( this.isAsync ) this.#obj3d.anim.mixer.addEventListener( 'finished', this.animFinishHandler );
	    else this.onComplete();
    }

	animFinishHandler = () => {
		this.#obj3d.anim.mixer.removeEventListener( 'finished', this.animFinishHandler );
		if ( this.#finishState ) this.#obj3d.anim.set( this.#finishState );
		this.onComplete();
	}	
}


class LookTask extends Task {
    #obj3d; 
    #lookAt; 
    #time;

    constructor({ obj3d, lookAt, time=0.3, isAsync=true }) {
        super();
        this.#obj3d = obj3d;
        this.#lookAt = lookAt;
        this.#time = time;
        this.isAsync = isAsync;
    }

    do() {
        this.#obj3d.rotation.y %= 2*Math.PI;

        let dx = this.#lookAt.x - this.#obj3d.position.x;
        let dz = this.#lookAt.z - this.#obj3d.position.z;
        let angle = Math.atan2(dx, dz);

        if ( angle - this.#obj3d.rotation.y > Math.PI ) this.#obj3d.rotation.y += 2*Math.PI;
        if ( angle - this.#obj3d.rotation.y < -Math.PI ) this.#obj3d.rotation.y -= 2*Math.PI;
            
        gsap.to( this.#obj3d.rotation, this.#time, { y:angle, onComplete: ()=>{
            if ( this.isAsync ) this.onComplete();
        }});

        if ( !this.isAsync ) this.onComplete();
    }    
}


class MoveTask extends Task {
    #obj3d; 
    #moveTo; 
    #speed;    

    #stepSoundTimer = 0;

    constructor({ obj3d, moveTo, speed=0.02, isAsync=true }) {
        super();
        this.#obj3d = obj3d;
        this.#moveTo = moveTo;
        this.#speed = speed;        
        this.isAsync = isAsync;
    }

    do() {
        app.update.add( this.update );
        if ( !this.isAsync ) this.onComplete();
    }	

    update = () => {
        this.#obj3d.rotation.y %= 2*Math.PI;

        let dx = this.#moveTo.x - this.#obj3d.position.x;
        let dz = this.#moveTo.z - this.#obj3d.position.z;
        let angle = Math.atan2(dx, dz);

        if ( angle - this.#obj3d.rotation.y > Math.PI ) this.#obj3d.rotation.y += 2*Math.PI;
        if ( angle - this.#obj3d.rotation.y < -Math.PI ) this.#obj3d.rotation.y -= 2*Math.PI;

        this.#obj3d.rotation.y += (angle - this.#obj3d.rotation.y) / 5;
        // this.#obj3d.rotation.y = angle;

        this.#obj3d.position.x += Math.sin( this.#obj3d.rotation.y ) * this.#speed; 
        this.#obj3d.position.z += Math.cos( this.#obj3d.rotation.y ) * this.#speed;
        
        let distance2 = dx**2 + dz**2;
        if ( distance2 <= 0.03 ) {
            app.update.delete( this.update );
            if ( this.isAsync ) this.onComplete();
        }

        this.#stepSoundTimer++;
        if ( this.#stepSoundTimer >= 10 ) {
            this.#stepSoundTimer = 0;
            let stepSoundName = 'step_' + randomInteger(1, 4);
            playSound( stepSoundName, false, 0.25 );
        }
    }   
}

class MoveTask2 extends Task {
    #obj3d; 
    #moveTo; 
    #time;
    #percent;

    constructor({ obj3d, moveTo, time=1, percent=1, isAsync=true }) {
        super();
        this.#obj3d = obj3d;
        this.#moveTo = moveTo;
        this.#time = time;
        this.#percent = percent;
        this.isAsync = isAsync;
    }

    do() {
        let dx = this.#moveTo.x - this.#obj3d.position.x;
        let dz = this.#moveTo.z - this.#obj3d.position.z;

        let x = this.#obj3d.position.x + dx * this.#percent;
        let z = this.#obj3d.position.z + dz * this.#percent;        
        
        gsap.to( this.#obj3d.position, this.#time, {x, z, ease:'sine.inOut', onComplete: ()=>{
            if ( this.isAsync ) this.onComplete();
        }});

        if ( !this.isAsync ) this.onComplete();
    }
}


class MoveForwardTask extends Task {
    #obj3d; 
    #distance; 
    #currentDistance;  
    #speed;    

    constructor({ obj3d, distance, speed=0.02, isAsync=true }) {
        super();
        this.#obj3d = obj3d;
        this.#distance = distance;
        this.#speed = speed;        
        this.isAsync = isAsync;
    }

    do() {
        this.#currentDistance = 0;
        app.update.add( this.update );
        if ( !this.isAsync ) this.onComplete();
    }	

    update = () => {
        this.#obj3d.position.x += Math.sin( this.#obj3d.rotation.y ) * this.#speed; 
        this.#obj3d.position.z += Math.cos( this.#obj3d.rotation.y ) * this.#speed;

        this.#currentDistance += this.#speed;        
        
        if ( this.#currentDistance >= this.#distance ) {
            app.update.delete( this.update );
            if ( this.isAsync ) this.onComplete();
        }
    }   
}


class EventTask extends Task {
    #event;

	constructor({event}) {
        super();
        this.#event = event;        
    }

    do() {
        app.events.emit( this.#event );
        this.onComplete();
    }	
}


class ShowTask extends Task {
    #obj;

	constructor({obj}) {
        super();
        this.#obj = obj;        
    }

    do() {
        this.#obj.visible = true;
        this.onComplete();
    }	
}


class HideTask extends Task {
    #obj;

	constructor({obj}) {
        super();
        this.#obj = obj;        
    }

    do() {
        this.#obj.visible = false;
        this.onComplete();
    }	
}


class SoundTask extends Task {
    #soundName
    #loop
	
    constructor({name, loop=false}) {
        super();
        this.#soundName = name;        
        this.#loop = loop;        
    }

    do() {
        playSound( this.#soundName, this.#loop );
        this.onComplete();
    }	
}


class StopSoundTask extends Task {
    #soundName    
	
    constructor({name}) {
        super();
        this.#soundName = name;
    }

    do() {
        stopSound( this.#soundName );
        this.onComplete();
    }	
}


class RandomSoundTask extends Task {
    #sounds
    #current = 0;
	
    constructor({sounds}) {
        super();
        this.#sounds = sounds;        
    }

    do() {
        playSound( this.#sounds[ this.#current ] );
        this.onComplete();
    }	
}
