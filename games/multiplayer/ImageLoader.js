class ImageLoader {
    images = {};

    load( manifest, callback = function(){} ) {
        if (manifest === undefined || !Array.isArray(manifest) || manifest.length == 0) {
            console.error('Manifest is incorrect or undefined');
            return;
        }

        let currentIndex = 0;
       
        let loadNextImage = () => {
            let image = new Image();
            image.onload = imageLoadedHandler;

            let imageData = manifest[currentIndex];
            image.src = imageData.src;
            this.images[ imageData.name ] = image;            
        }

        let imageLoadedHandler = () => {
            currentIndex++;

            if (currentIndex < manifest.length) {
                loadNextImage();
            } else {
                callback();
            }
        }

        loadNextImage();
    }    
}