class GameLoop {
    stack = [];
    isPause = false;   

    constructor ( autoStart = true ) {
        if (autoStart) this.start();
        else this.isPause = true;
    }
    
    start () {        
        this.isPause = false;
        this.update();
    }

    stop () {
        this.isPause = true;
    }

    add ( update ) {
        this.stack.push(update);
    }

    remove ( update ) {
        let id = this.stack.indexOf( update );
        if (id != -1) this.stack.splice( id, 1 );
    }    

    update = () => {
        if ( this.isPause ) return;
        this.stack.forEach(update => update());
        requestAnimationFrame( this.update );
    }
}