class ControllManager {
    keys = {
        up: false,
        down: false,
        left: false,
        right: false
    }

    constructor() {
        document.addEventListener("keydown", (event) => {
		    if (event.code == "KeyW") this.keys.up = true;
            if (event.code == "KeyS") this.keys.down = true;
		    if (event.code == "KeyA") this.keys.left = true;
		    if (event.code == "KeyD") this.keys.right = true;
	    });

        document.addEventListener("keyup", (event) => {
            if (event.code == "KeyW") this.keys.up = false;
            if (event.code == "KeyS") this.keys.down = false;
            if (event.code == "KeyA") this.keys.left = false;
		    if (event.code == "KeyD") this.keys.right = false;
	    });
    }
}