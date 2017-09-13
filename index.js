'use strict';

import tv4 from 'tv4-node'
const jsonschema = tv4.tv4
import defaults from 'json-schema-defaults'
import collection from './collection'

function plugin(Vue) {

    if (plugin.installed) {
        return;
    }

	/**
    // Register a helper prototype property for store access.
    Object.defineProperty(Vue.prototype, '$remote', {
        get: function get() {
            return this.$root.remote;
        }
    });
	*/

    // Register a global mixin to manage the getters/setters for our store.
    Vue.mixin({

        /**
         * The 'beforeCreate' life-cycle hook for Vue 2.0
         *
         * @return {void}
         */
        beforeCreate: function beforeCreate() {
            registerStore(this);
        },


        /**
         * The 'init' life-cycle hook for Vue 1.0
         *
         * @return {void}
         */
        init: function init() {
            registerStore(this);
        }
    });
}

function registerStore(vm) {
	// vm.$options.remote
	vm.$root.jsonschema = {
		defaults: defaults,
		validate: jsonschema.validate
	}
	if( vm.$root.store ){
		for( var name in vm.$root.store ){
			var storevar = vm.$root.store[name]
			if( typeof storevar != 'object' || !storevar.remote || storevar.get ) return
			console.log("vue-stash-remote initing "+name)
			collection.init(vm,name, storevar)
		}
	}
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin);
}

export default plugin