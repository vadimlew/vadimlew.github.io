class GameLoop {
    prevTimeStamp = 0;
    timeStamp = 0;
    deltaTime = 0;
    stack = [];    

    constructor({fps = 30}={}) {
        this.timeStep = 1000 / fps;
        this.prevTimeStamp = performance.now();       
        this.update();
    }

    add(update) {
        this.stack.push(update);
    }     

    remove(update) {
        let id = this.stack.indexOf(update);
        if (id != -1) this.stack.splice(id, 1);       
    }    

    update = () => {        
        this.timeStamp = performance.now();
        this.deltaTime += this.timeStamp - this.prevTimeStamp;
        this.prevTimeStamp = this.timeStamp;
        
        let numUpdateSteps = 0;
        while (this.deltaTime >= this.timeStep) {
            this.deltaTime -= this.timeStep;
            if (++numUpdateSteps >= 240) break;

            this.stack.forEach(update => update());
        }        

        requestAnimationFrame(this.update);
    }
}