import JSZip from 'jszip';
import { GLTFLoader } from 'three-157/addons/loaders/GLTFLoader.js';


class AssetsManager {
    images = {};
    sounds = {};
    models = {};

	#shema = {
		'png': { prefix: 'data:image/png; base64,', storage: this.images, load: this.#loadImage },
		'jpg': { prefix: 'data:image/jpeg; base64,', storage: this.images, load: this.#loadImage },
		'mp3': { prefix: 'data:audio/mpeg; base64,', storage: this.sounds, load: this.#loadSound },
		'glb': { prefix: 'data:application/octet-stream; base64,', storage: this.models, load: this.#loadGLBModel.bind(this) },
	}

	#loaderGLTF = new GLTFLoader();
	#onLoadComplete;

    constructor( assetsZip, onLoadComplete=()=>{} ) {
		this.#onLoadComplete = onLoadComplete;

        let jszip = new JSZip();
        let base64String = assetsZip.replace('data:application/zip;base64,', '');
        jszip.loadAsync( base64String, {base64: true} ).then( this.#parseZip.bind(this) );
    }

    async #parseZip(zip) {
		let files = Object.values( zip.files );

		for ( let file of files ) {
			if ( file.dir ) continue;			

			let fileName = file.name.split('/').pop();
			let assetName = fileName.split(".")[0];
			let assetExtension = fileName.split(".")[1];			
			
			let assetBase64Encoded = await file.async('base64');

			let loader = this.#shema[ assetExtension ];
			if ( !loader ) continue;
			loader.storage[ assetName ] = await loader.load( loader.prefix + assetBase64Encoded );			
		}

		this.#onLoadComplete();
    }

	#loadImage( path ) {
		return new Promise((resolve, reject) => {
			let image = new Image();
			image.addEventListener('load', () => resolve(image));
			image.addEventListener('error', (err) => reject(err));
			image.src = path;
		});
	}

	#loadSound( path ) {
		return new Promise((resolve, reject) => {
			let audio = new Audio(path);
			audio.addEventListener('canplaythrough', () => resolve(audio));
			audio.addEventListener('error', (err) => reject(err));			
		});
	}

	#loadGLBModel( path ) {
		return new Promise((resolve, reject) => {
			this.#loaderGLTF.load(path, (model) => {				
				resolve(model);
			});
		});
	}
}

export default AssetsManager;