// this is a collection-factory to support multiple backends

import restful from './adapter/restful'
import Parse from './adapter/parse'
import {wrap,get} from 'lodash'
import tv4 from 'tv4-node'
const jsonschema = tv4.tv4
import defaults from 'json-schema-defaults'

export default {

	init(vm,name,storevar){

		var collection
		if( storevar.remote.adapter == "restful" ) restful(vm,name,storevar)
		if( storevar.remote.adapter == "parse"   ) Parse(vm,name,storevar)
        if( storevar.remote.cache                ) this.cache(storevar)

        // WRAP! make sure data is validated against schemas
		storevar.save = wrap( storevar.save, function(original, data){
			return new Promise( (resolve, reject) => {
				try{
					var valid = jsonschema.validate(data, collection.schema)
					if( !valid ) return reject(jsonschema.error)
					original(data).then(resolve)
				}catch(e){
					reject(e)
				}
			})
		})

		return collection
	},

	cache(storevar){

		// WRAP! make sure we check our .all-array first (before doing server calls)
		storevar.get = wrap( storevar.get, function(original, id, setCurrent ){
			return new Promise( function(resolve, reject){
			    var found = storevar.all.find( (i) => i[ _.get(storevar,'remote.config.key') || 'id'] == id )
				if( found ) return resolve( found )

				// or get item and set as current and add to .all-array
				original( id )
				.then( (result) => {
					var item = result.data || result
					storevar.all.push( item ) // save to .all-array
					if( setCurrent ) storevar.current = item
					resolve(result)
				})
			})
		})

	}

}
