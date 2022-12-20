var host = (window.document.location.host || "localhost").replace(/:.*/, '');
var client = new Colyseus.Client('ws://' + host + ':2567');
var room;

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
    client.join(document.getElementById('room_name').value, { code: "one" }).then((r) => {
        room = r;
        addListeners(room);
    }).catch(e => {
        console.error(e.code, e.message);
    });
}

function create() {
    client.create(document.getElementById('room_name').value, { code: "one" }).then((r) => {
        room = r
        addListeners(room);
    });
}

function joinOrCreate() {
    client.joinOrCreate(document.getElementById('room_name').value, { code: "one" }).then((r) => {
        room = r
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
