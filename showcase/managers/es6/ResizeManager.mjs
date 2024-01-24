class ResizeManager {

    #callStack = new Set();

    constructor() {
        window.addEventListener( 'resize', this.#onWindowResizeHandler.bind(this) );
    }

    add ( resizeFunction ) {
        this.#callStack.add( resizeFunction );
    }

    remove ( resizeFunction ) {
        this.#callStack.delete( resizeFunction );
    }

    #onWindowResizeHandler() {
        this.#callStack.forEach( resizeFunction => resizeFunction() );
    }
}

export default ResizeManager;