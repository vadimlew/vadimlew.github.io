let app = {
    scaleFactor: 1.5,
    frameDuratioMs: 25,
    animSpeed: 1 / 15,

    stateGame: 'loaded',

    isActive: false,
    isPause: false,
    isSounds: params.playSounds.value,
    numClicks: 0,

    obj2d: {},    

    canvas2d: document.getElementById("canvas_2d"),    

    renderer2d: null,   

    scene2d: null,
    
    mouse: {},
    update: new Set(),   
    resizes: new Set(),   
    
    mainWidth: 0,
    mainHeight: 0,
    canvasWidth: 0,
    canvasHeight: 0
};	