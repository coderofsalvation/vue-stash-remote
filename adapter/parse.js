import Parse from 'parse'

export default (vm,varname, obj) => {

	var config = obj.remote.config
	obj.class = varname

	if( config && config.appid && config.javascriptKey && config.serverURL ){
		window.Parse = vm.$root.Parse = Parse // expose for debugging purposes
		Parse.initialize(config.appid, config.javascriptKey)
		Parse.serverURL = config.serverURL
		return Parse
	}

	var functions = {}
	for( var i in obj ) if( typeof obj[i] == 'function' ) functions[i] = obj[i]

	obj.Class = Parse.Object.extend( obj.class, functions )
	Parse.Object.registerSubclass( obj.class, obj.Class )

	obj.get = function(id) {
		// todo
	}

	obj.save = function(data){
		return new Promise( function(resolve, reject){
			var item = new obj.Class()
			item.save(data,{ success: () => {
				resolve()
			}, error: reject })
		})
	}
		
}
