class ClientManager {
    room;
    room_name = 'game';    

    constructor() {
        this.initClient();
    }

    async initClient() {
        //this.client = new Colyseus.Client("ws://localhost:2567");   
        this.client = new Colyseus.Client("ws://2e4f-171-6-241-47.ngrok.io");   
        this.room = await this.client.joinOrCreate(this.room_name, { code: "one" });        
        this.addListeners(this.room);       
    }

    addListeners(room) {        
        this.room.state.players.onAdd = (player, key) => {
            console.log(player, "has been added at", key);              
            if (room.sessionId === key) main.players.push( new Player(player) );
            else main.players.push( new Enemy(player) );
        };
    }
}