class Player {
    conn;
    display;
    accelerate = .025;
    speedX = 0;
    speedY = 0;
    position = {
        x: 0,
        y: 0
    }

    keys = {
        up: false,
        right: false,
        down: false,
        left: false
    }

    constructor( conn ) {
        this.conn = conn;
        this.display = Utils.createAnimSprite( app.assets.images.knight );
        this.display.anchor.set( 0.5 );

        document.addEventListener( 'keydown', this.onKeydown );
        document.addEventListener( 'keyup', this.onKeyUp );

        app.loop.add( this.update );
    }

    onKeydown = (event) => {

        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.keys.up = true;                
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.keys.down = true;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.keys.left = true;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.keys.right = true;
                break;
        }        
    }

    onKeyUp = (event) => {

        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.keys.up = false;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.keys.down = false;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.keys.left = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.keys.right = false;
                break;
        }        
    }

    update = () => {
        if ( this.keys.up ) {
            this.speedY -= this.accelerate;
        }

        if ( this.keys.down ) {
            this.speedY += this.accelerate;
        }

        if ( this.keys.right ) {
            this.speedX += this.accelerate;
            this.display.scale.x = 1;
        }

        if ( this.keys.left ) {
            this.speedX -= this.accelerate;
            this.display.scale.x = -1;
        }

        this.speedX *= 0.94;
        this.speedY *= 0.94;

        this.display.x += this.speedX;
        this.display.y += this.speedY;

        this.position.x = this.display.x;
        this.position.y = this.display.y;

        this.conn.send( this.position );
    }
}


class Enemy {
    conn;
    display;
    position = {
        x: 0,
        y: 0
    }

    constructor( conn ) {
        this.conn = conn;
        this.display = Utils.createAnimSprite( app.assets.images.skeleton );
        this.display.anchor.set( 0.5 );        

        app.loop.add( this.update );

        conn.on('data', (data) => {
            this.position.x = data.x;
            this.position.y = data.y;
        });
    }

    update = () => {
        this.display.x += (this.position.x - this.display.x) * 0.25;
        this.display.y += (this.position.y - this.display.y) * 0.25;
    }
}