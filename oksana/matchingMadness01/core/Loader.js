//---------------------------------------------------------------------------------
//- LOADER

let loader = {
	zipFiles: [],

	load (funComplete) {
		this.funComplete = funComplete;
		this.unzipAssets();
	},	

	unzipAssets () {
		if (assets.dataZip) {
			let zipAssets = new JSZip();

			zipAssets.loadAsync(assets.dataZip, {base64: true}).then((zip) => {
				for (let i in zip.files) {				
					this.zipFiles.push({
						file		: zip.files[i],
						nameFull	: zip.files[i].name,
						nameFile	: zip.files[i].name.split(".")[0],
						nameFormat	: zip.files[i].name.split(".")[1]
					});				
				}
				
				this.unzipRead();
			});	
		} else {
			this.loadTextures();
		}		
	},
	
	unzipRead () {
		if (this.zipFiles.length > 0) {
			let file = this.zipFiles[0].file;			
			let nameFile = this.zipFiles[0].nameFile;
			let nameFormat = this.zipFiles[0].nameFormat;
			
			file.async('base64').then((b64encoded) => {
				switch (nameFormat) {
					case "png":
						b64encoded = "data:image/png; base64," + b64encoded;
						assets.dataTextures.push({name: nameFile, src: b64encoded});
						break;

					case "jpg":
						b64encoded = "data:image/jpeg; base64," + b64encoded;
						assets.dataTextures.push({name: nameFile, src: b64encoded});
						break;

					case "mp3":
						b64encoded = "data:audio/mpeg;base64,"+b64encoded;
						assets.dataSounds.push({name: nameFile, src: b64encoded});
						break;

					case "glb":
						b64encoded = "data:application/octet-stream;base64,"+b64encoded
						assets.dataModels.push({name: nameFile, src: b64encoded});
						break;
				}
				
				this.zipFiles.shift();
				this.unzipRead();				
			});		
		} else {
			this.loadTextures();
		}
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
		this.funComplete();
	}	
};