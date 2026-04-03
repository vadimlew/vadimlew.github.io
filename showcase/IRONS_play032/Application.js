let app = {
    scaleFactor: 1.5,
    frameDuratioMs: 25,
    animSpeed: 1 / 25,   

    states: {
        LOADED: 0,
        DRESS: 1,
        FIGHT: 2,
        BOSS: 3,
        END: 4
    },

    stateGame: 0,

    isActive: false,
    isPause: false,    
    isSounds: params.playSounds.value,
    numClicks: 0,

    obj2d: {},
    obj3d: {},

    canvas2d: document.getElementById("canvas_2d"),
    canvas3d: document.getElementById("canvas_3d"),

    template: new Template(),

    raycaster: new THREE.Raycaster(),
    intersects: [],

    renderer2d: null,
    renderer3d: null,

    scene2d: null,
    scene3d: null,

    camera3d: null,
    materials: {},
    texture: {},
    animations: [],

    currentPartId: 0,
    events: new PIXI.utils.EventEmitter(),
    mouse: {x: 0, y: 0, isDown: false},
    update: new Set(),   
    trail: [], 

    mainWidth: 0,
    mainHeight: 0,
    canvasWidth: 0,
    canvasHeight: 0
};

app.events.PART_CLICK = 'part_click';
app.events.PLAYER_DRESSED = 'already_dressed';
app.events.PLAYER_SHOW_BOSS = 'player_show_boss';