let app = {
    foodId: 0,
    scaleFactor: 1.5,
    frameDuratioMs: 25,
    animSpeed: 1 / 5,

    stateGame: 'loaded',

    isActive: false,
    isPause: false,
    isSounds: params.playSounds.value,
    numClicks: 0,

    obj2d: {},
    obj3d: {},

    canvas2d: document.getElementById("canvas_2d"),
    canvas3d: document.getElementById("canvas_3d"),

    renderer2d: null,
    renderer3d: null,

    scene2d: null,
    scene3d: null,

    camera3d: null,
    material: {},
    texture: {},
    animations: [],
    raycaster: new THREE.Raycaster(),
    rayStart: new THREE.Vector3(),
    rayDirect: new THREE.Vector3(0, -1, 0),

    mouse: {},
    update: [],
    update2: [],
    pool: [],

    mainWidth: 0,
    mainHeight: 0,
    canvasWidth: 0,
    canvasHeight: 0
};


app.fabric = {
    sprite(name) {
        return new PIXI.Sprite( assets.dataTextures.pixi[name] );
    }
};