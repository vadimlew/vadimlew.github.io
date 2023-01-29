class GameLoop {
    prevTimeStamp = 0;
    timeStamp = 0;
    deltaTime = 0;
    stack = [];    
    isPause = false;
    isBlur = false;

    constructor({fps = 30, autoStart = true}) {       
        this.timeStep = 1000 / fps;        
        if (autoStart) this.start();
        else this.isPause = true;
        this.startFocusHandlers();
    }

    startFocusHandlers() {
        let blurHandler = () => {
            //console.log('blur');
            this.isBlur = true;
        }

        let focusHandler = () => {
            //console.log('focus');      
            this.isBlur = false;
            this.prevTimeStamp = performance.now();       
            this.update();        
        }

        window.addEventListener('blur', blurHandler);
	    window.addEventListener('focus', focusHandler);
    }    

    start = () => {
        //console.log('start');
        this.isPause = false;
        this.prevTimeStamp = performance.now();
        this.update();
    }

    stop = () => {
        //console.log('stop');
        this.isPause = true;        
    }

    add(update) {
        this.stack.push(update);
    }     

    remove(update) {
        let id = this.stack.indexOf(update);
        if (id != -1) this.stack.splice(id, 1);       
    }    

    update = () => {     
        if (this.isPause || this.isBlur) return;
          
        this.timeStamp = performance.now();
        this.deltaTime += this.timeStamp - this.prevTimeStamp;
        this.prevTimeStamp = this.timeStamp;
        
        let numUpdateSteps = 0;
        while (this.deltaTime >= this.timeStep) {            
            if (++numUpdateSteps >= 120) break;
            this.stack.forEach(update => update(this.timeStep));
            this.deltaTime -= this.timeStep;
        }        

        requestAnimationFrame(this.update);
    }
}