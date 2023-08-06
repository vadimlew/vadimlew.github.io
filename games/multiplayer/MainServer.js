class Main {
    pixiApp;
    display;

    assets = new ImageLoader();    
    loop = new GameLoop();
   
    constructor() {
        this.initPIXI();    
        this.initResize();
        this.assets.load( manifest, this.createPeerServer.bind(this) );
    }    

    startGame( conn ) {
        let player = new Player( conn );
        this.display.addChild( player.display );     
        
        let enemy = new Enemy( conn );
        this.display.addChild( enemy.display );     
    }

    initPIXI() {
        this.pixiApp = new PIXI.Application({
            backgroundColor: 0x222222,
            antialias: true,
            resizeTo: window
        });
        document.body.appendChild(this.pixiApp.view);
        
        this.display = new PIXI.Container();
        this.display.scale.set(3);
        this.pixiApp.stage.addChild(this.display);      
        
        PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;
    }   

    createPeerServer() {
        let peer = new Peer('Vadim-Tmyn-456718293-connect');       

        peer.on('open', function (id) {
            console.log('My peer ID is: ' + id);
        });   
        
        peer.on('data', function(data) {
            console.log('Recieved message: ', data);
        })

        peer.on('connection', ( conn ) => {            
            this.startGame( conn );
        });        
    }

    initResize() {
        window.addEventListener( 'resize', this.onWindowResizeHandler.bind(this) );   
        this.onWindowResizeHandler();     
    }

    onWindowResizeHandler() {
        this.display.x = window.innerWidth / 2;
        this.display.y = window.innerHeight / 2;
    }
}

let app = new Main();