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
    obj3d: {},

    canvas2d: document.getElementById("canvas_2d"),
    canvas3d: document.getElementById("canvas_3d"),

    template: new Template(),

    renderer2d: null,
    renderer3d: null,

    scene2d: null,
    scene3d: null,

    camera3d: null,
    material: {},
    texture: {},
    animations: [],

    mouse: {},
    update: [],

    mainWidth: 0,
    mainHeight: 0,
    canvasWidth: 0,
    canvasHeight: 0
};	