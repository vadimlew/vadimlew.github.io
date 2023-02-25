class Main {
    players = [];

    initialize() {
        this.pixi = new PIXI.Application({            
            background: 0x222222,
            resolution: devicePixelRatio,
            antialias: true,
            width: 800,
            height: 800,
            view: document.getElementById('game')
        });        

        this.client = new ClientManager();
        this.control = new ControllManager();
        this.update();
    }
    
    update() {     
        this.players.forEach(player => {
            player.update();
        });
        requestAnimationFrame(()=>this.update());
    }
}