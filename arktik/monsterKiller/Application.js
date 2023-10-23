class Application {
    static STATES = {
        LOADED: 0,
        START: 1,
        END: 2,
    }

    static EVENTS = {
        FULL_LOG: 'full_log',
        READY_TO_UPGRADE: 'ready_to_upgrade',
        SELL_ALL_LOG: 'sell_all_log',
        UPGRADE_BOUGHT: 'upgrade_bought',
        SHOW_FINAL: 'show_final',
    }

    events = new PIXI.utils.EventEmitter();

    scaleFactor = 1.5;
    frameDuratioMs = 25;
    animSpeed = 1 / 25;
    numClicks = 0;

    isActive = false;
    isPause = false;     
    
    obj2d = {};
    obj3d = {};

    stateGame = Application.STATES.LOADED;
    isSounds = params.playSounds.value;   

    canvas2d = document.getElementById("canvas_2d");
    canvas3d = document.getElementById("canvas_3d");

    renderer2d = null;
    renderer3d = null;

    scene2d = null;
    scene3d = null;

    physics = null;

    camera3d = null;
    materials = {};
    texture = {};
    animations = [];
    
    update = new Set();

    mainWidth = 0;
    mainHeight = 0;
    canvasWidth = 0;
    canvasHeight = 0;
}


let app = new Application();