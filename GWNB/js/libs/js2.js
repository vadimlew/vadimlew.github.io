var js = {	
	rootUrl: './js/',
	context: this,
	loadedModules: {};
}

js.pathToUrl = function(path, version) {
	return js.rootUrl + path.replace(/\./g, '/') + 
		(js.versioninig ? '.v' + version : '') + '.js';	
}

/**
 * @type {Array}
 */
js.loadedModules = {};


/**
 * @param {String} path
 * @param {float} version
 */
js.include = function(path) {
	


	/*version = version || 1.0;	

	if(js.loadedModules[path] && js.loadedModules[path] >= version) return false;	
	var transport = js.getXHTTPTransport();
	transport.open('GET', js.pathToUrl(path, version), false);
	transport.send(null);
	
	var code = transport.responseText;
	(typeof execScript != 'undefined') ? execScript(code) : 
		(js.context.eval ? js.context.eval(code) : eval(code));

	js.loadedModules[path] = js.loadedModules[path] ? Math.max(js.loadedModules[path], version) : version;
	return true;*/
}