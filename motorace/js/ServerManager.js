let client = new Colyseus.Client("ws://localhost:2567");
let room;
let room_name = 'battle';

function addListeners(room) {
    console.log('joined!');

    room.onMessage("*", (type, message) => {
        console.log("received message:", type, "=>", message);
    });

    room.onLeave(function () {
        console.log("LEFT ROOM", arguments);
    });

    room.onStateChange(function (state) {
        console.log("state change: ", state.toJSON());
    });
}

function join() {
    client.join(room_name, { code: "one" }).then((r) => {
        room = r;
        addListeners(room);
    }).catch(e => {
        console.error(e.code, e.message);
    });
}

function create() {
    client.create(room_name, { code: "one" }).then((r) => {
        room = r
        addListeners(room);
    });
}

function joinOrCreate() {
    client.joinOrCreate(room_name, { code: "one" }).then((r) => {
        room = r
        console.log( 'joinOrCreate' );
        addListeners(room);
    });
}

function joinByLastId() {
    client.joinById(room.id).then(r => {
        room = r;
        addListeners(room);
    });
}

function getAvailableRooms() {
    client.getAvailableRooms(document.getElementById('room_name').value).then((rooms) => {
        console.log(rooms);
    }).catch(e => {
        console.error(e);
    });
}

function reconnect() {
    client.reconnect(room.id, room.sessionId).then(r => {
        room = r;
        addListeners(room);
    });
}

function closeConnection() {
    room.connection.close();
}