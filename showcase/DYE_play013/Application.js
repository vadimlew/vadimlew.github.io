let app = {
    scaleFactor: 1.5,
    frameDuratioMs: 25,
    animSpeed: 1 / 20,
    clock3d: new THREE.Clock(),

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
    materials: {},
    texture: {},
    animations: [],

    mouse: {},
    update: [],
    enemies: [],

    mapSize: 1024,
    paintColors: ['redPaint', 'greenPaint', 'bluePaint', 'yellowPaint'],
    bulletColors: [0x222244, 'textureWaterPaint', 'textureLavaPaint', 'textureRainbow'],
    glassColors: [0x222244, 0x57a5ec, 0xcc2800, 0xffff00],
    characterTextures: ['texturePeople00', 'texturePeople01', 'texturePeople02', 'texturePeople03'],
    gameTime: 20,

    mainWidth: 0,
    mainHeight: 0,
    canvasWidth: 0,
    canvasHeight: 0
};	