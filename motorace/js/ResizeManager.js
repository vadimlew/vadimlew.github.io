class ResizeManager {
    resizeFunctions = [];

    constructor({width, height}) {
        this.logicalWidth = width;
        this.logicalHeight = height;

        window.addEventListener('resize', this.windowResizeHandler.bind(this));
        this.windowResizeHandler();  
    } 

    windowResizeHandler() {
        let scaleFactor = Math.max(
            window.innerWidth / this.logicalWidth,
            window.innerHeight / this.logicalHeight
        );

        let newWidth = Math.ceil(this.logicalWidth * scaleFactor);
        let newHeight = Math.ceil(this.logicalHeight * scaleFactor);

        main.pixi.view.style.width = `${newWidth}px`;
        main.pixi.view.style.height = `${newHeight}px`;

        main.pixi.renderer.resize(newWidth, newHeight);           

        this.resizeFunctions.forEach(resize => {resize()});
    }
    
    add(resize) {
        resize();
        this.resizeFunctions.push(resize);
    }

    remove(resize) {        
        let id = this.resizeFunctions.indexOf(resize);      

        if (id != -1) 
            this.resizeFunctions.splice(id, 1);
        else
            console.warn('not registered function: ' + resize);
    }
}