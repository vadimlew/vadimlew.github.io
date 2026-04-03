class Loader {
    async load(onLoadComplete) {        
        await this.loadTextures();
        onLoadComplete();
    }

    async loadTextures() {
        
    }
}