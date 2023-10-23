class SoundButton {
    display;
    #soundSpriteOn;
    #soundSpriteOff;

    constructor() {
        this.#initDisplay();

        this.display.interactive = true;				
        this.display.on( 'pointertap', this.#onClickSoundButton );
    }

    #initDisplay() {
        this.display = new PIXI.Container();        

        let soundSpriteOn = new PIXI.Sprite( assets.textures.pixi['btn_sound_on'] );
        soundSpriteOn.anchor.set(0.5);

		let soundSpriteOff = new PIXI.Sprite( assets.textures.pixi['btn_sound_off'] );
        soundSpriteOff.anchor.set(0.5);
        soundSpriteOff.visible = false;

        this.#soundSpriteOn = soundSpriteOn;
        this.#soundSpriteOff = soundSpriteOff;
        this.display.addChild( soundSpriteOn, soundSpriteOff );
    }

    #onClickSoundButton = () => {
        if (app.isSounds) {
            app.isSounds = false;
            
            this.#soundSpriteOn.visible = false;
            this.#soundSpriteOff.visible = true;

            Howler.mute(true);
        } else {
            app.isSounds = true;

            this.#soundSpriteOn.visible = true;
            this.#soundSpriteOff.visible = false;

            Howler.mute(false);
        }
    }    

    onResize( leftUI, downUI ) {
        this.display.x = leftUI + 60;
		this.display.y = downUI - 60;
    }
}