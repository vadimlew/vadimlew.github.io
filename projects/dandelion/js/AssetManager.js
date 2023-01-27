function AssetManager() {
   this.downloadQueue = [];
}

function AssetItem(name, path) {
	this.name = name;
	this.path = path;
}

AssetManager.prototype.addToQueue = function(name, path) {
	this.successCount = 0;
    this.errorCount = 0;
	this.cache = {};
    this.downloadQueue.push(new AssetItem(name, path));
}

AssetManager.prototype.loadAll = function(downloadCallback) {
	if (this.downloadQueue.length === 0) {
		downloadCallback();
	}
	for (var i = 0; i < this.downloadQueue.length; i++) {
		var item = this.downloadQueue[i];	
        var img = new Image();
		img.crossorigin = 'anonymous';
        var that = this;
        img.addEventListener("load", function() {
			that.successCount += 1;
			if (that.isDone()) {
				downloadCallback();
			}
		}, false);
		img.addEventListener("error", function() {
			that.errorCount += 1;
			if (that.isDone()) {
				downloadCallback();
			}
		}, false);
		img.src = item.path;
		this.cache[item.name] = img;
    }
}

AssetManager.prototype.isDone = function() {
    return (this.downloadQueue.length == this.successCount + this.errorCount);
}

AssetManager.prototype.getAsset = function(name) {
    return this.cache[name];
}

AssetManager.prototype.getAssets = function() {
	var assets = [];
	for (var i = 0; i < arguments.length; i++) {
		var asset = this.getAsset(arguments[i]);
		assets.push(asset);
    }	
	return assets;
}