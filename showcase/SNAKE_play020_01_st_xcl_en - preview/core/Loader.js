//---------------------------------------------------------------------------------
//- LOADER

let loader = {

	load (funComplete) {
		this.funComplete = funComplete;
		this.loadTextures();
	},	

	loadTextures () {
		if (assets.dataTextures.length > 0) {
			let data = assets.dataTextures[0];
			let image = new Image();
			image.onload = ()=>this.loadTextureComplete();
			image.onerror = ()=>this.loadTextureError();
			image.src = data.src;
			assets.textures.base[data.name] = image;
		} else {
			this.loadTexturesComplete();
		}
	},

	loadTextureComplete () {		
		let data = assets.dataTextures[0];
		let baseTexture = assets.textures.base[data.name];

		assets.textures.pixi[data.name] = PIXI.Texture.from(baseTexture); 
		assets.textures.three[data.name] = new THREE.Texture(baseTexture);
		assets.textures.three[data.name].needsUpdate = true;

		assets.dataTextures.shift();
		this.loadTextures();		
	},

	loadTextureError () {
		setTimeout(()=>this.loadTextures(), 200);
	},

	loadTexturesComplete: function () {
		this.loadSounds();
	},	

	loadSounds () {
		if (assets.dataSounds.length > 0) {
			assets.sounds[assets.dataSounds[0].name] = new Howl(assets.dataSounds[0]);

			assets.dataSounds.shift();
			this.loadSounds();
		} else {
			this.loadSoundsComplete();
		}
	},
	
	loadSoundsComplete () {
		this.loadModels();
	},	

	loadModels () {
		if (assets.dataModels.length > 0) {
			let loaderGLTF = new THREE.GLTFLoader();
			
			loaderGLTF.load(assets.dataModels[0].src, function (data) {				
				assets.models[assets.dataModels[0].name] = data.scene;
				assets.models[assets.dataModels[0].name].v_data = data;

				assets.dataModels.shift();
				loader.loadModels();
			});
		} else {
			this.loadModelsComplete();
		}
	},

	loadModelsComplete () {
		this.funComplete();
	}
};