class Main {
    pixiApp;
    display;

    assets = new ImageLoader();    
    loop = new GameLoop();
   
    constructor() {
        this.initPIXI();    
        this.initResize();
        this.assets.load( manifest, this.connectToPeerServer.bind(this) );
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

    connectToPeerServer() {
        let peer = new Peer('Tmyn-Vadim-456718293-connect');       

        peer.on('open', () => {            
            join();
        })

        let join = () => {
            let conn = peer.connect('Vadim-Tmyn-456718293-connect');

            conn.on('open', () => {
                this.startGame( conn );
            });          
        } 
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




/*class Client {
    peer;    
   
    constructor() {        
        let peer = new Peer('Tmyn-Vadim-456718293-connect');
        this.peer = peer;

        peer.on('open', function (data) {
            console.log('connection open', data);
            join();
        });

        let join = () => {
            let conn = peer.connect('Vadim-Tmyn-456718293-connect');

            conn.on('open', function () {
                console.log("Connected to: " + conn.peer);
            });

            conn.on('data', function (data) {
                console.log("Recieved message: ", data);        
            });

            this.conn = conn;
        }        
    }   
}*/