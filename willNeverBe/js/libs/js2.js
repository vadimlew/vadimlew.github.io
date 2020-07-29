var js = {	
	rootUrl: './js/',
	context: this,
	loadedModules: {}
}

js.pathToUrl = function(path, version) {
	return js.rootUrl + path.replace(/\./g, '/') + '.js';	
}

/**
 * @param {String} path
 * @param {float} version
 */
js.include = async function(path, version = 1.0) {
	if(js.loadedModules[path] && js.loadedModules[path] >= version) return false;	
	
	var script = document.createElement('script');	
	script.src = js.pathToUrl(path);
	document.head.appendChild(script); 

	await new Promise(function(resolve, reject) {
		script.onload = function() {
			resolve();
			console.log('onload', path);
		}
	})

	js.loadedModules[path] = js.loadedModules[path]? Math.max(js.loadedModules[path], version) : version;
	return true;
}