class GameLoop {
    prevTimeStamp = 0;
    timeStamp = 0;
    deltaTime = 0;
    stack = [];    

    constructor({fps = 30}={}) {
        this.timeStep = 1000 / fps;
        this.prevTimeStamp = Date.now();       
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
        this.timeStamp = Date.now();
        this.deltaTime += this.timeStamp - this.prevTimeStamp;
        this.prevTimeStamp = this.timeStamp;
        
        while (this.deltaTime >= this.timeStep) {
            this.deltaTime -= this.timeStep;

            this.stack.forEach(update => update());
        }        

        requestAnimationFrame(this.update);
    }
}