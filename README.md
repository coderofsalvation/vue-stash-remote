
schema-based vue-stash for restful api's & Parse server to easify development
![Build Status](https://travis-ci.org/--repourl=git@github.com:coderofsalvation/vue-stash-remote..svg?branch=master)

## Usage

Here's a configuration

```
import VueStashRemote       from 'vue-stash-remote';
import router               from './js/router';

// schemas
import userSchema      from './../../schemas/user/v1.json'
import monkeySchema    from './../../schemas/monkey/v1.json'

Vue.use(VueStash)
Vue.use(VueStashRemote)

var config = {
	parse: {
		appid: 'EbQYiRgnjVGoJe3L2gmEiEyxBoP6Gpy08Y',
		javascriptKey: 'LghJVOOfoB0kZ69ojnb6cNXiV5cq6edW',
		serverURL:'https://parseapi.back4app.com/'
	},
	github: {
		url: 'https://api.github.com/users',
		key: 'login'
	}
}

new Vue({
	data: {
		store: {
			user:{
				current:false,             // this.$store.user.get(id) will populate this.$store.user.current
				all:[],                    // this.$store.user.find(query, [handler]) will populate this.$store.user.all

				remote: {
					adapter: 'restful',
					schema: userSchema,
					config: config.github,
					cache: true            // this.$store.user.get(id) will search all-array for id (to prevent useless requests)
				}
			},
			monkey:{
				current:false,             // this.$store.monkey.get(id) will populate this.$store.user.current
				all:[],                    // this.$store.monkey.find(query, [handler] ) will populate this.$store.user.all

				remote: {
					adapter: 'parse',
					schema: monkeySchema,
					config: config.parse,
				},
				foo(){ console.log("name: "+this.current.name) }
			}
		}
	}
})
```

## In your components

Lets assume this component:

```
<template>
  <b>current user: {{me.name}}</b>
  
  <li v-for='user in user.all'>{{user.name}}</li>
</template>

<script>
	export default {

		store: {
			me: 'user.current',             // these will be exposed as computed functions (getters)
			user: 'user',                   //
			monkey: 'monkey'                //
		},
	}
</script>
```

## Now you can use these functions

> NOTE: the user.all-cache is only used/updated when `cache:true` is set in the configuration

| function | returntype | notes |
|-|-|-|
| this.user.get(username,true) | a promise | automatically overwrites 'user.current' with response |
| this.user.save(user)         | a promise | rejects with schema-errors if object does not match schema. |
|                              |           |  Automatically creates schema in Parse-backend. |
| this.monkey.Class | a parse Class | see CRUD methods at https://www.npmjs.com/package/parse |
| this.$root.Parse | Parse object | see https://www.npmjs.com/package/axios | 
| this.$root.axios.request(config) | a promise | see https://www.npmjs.com/package/axios |
| this.$root.axios.get(url[, config]) | a promise | see https://www.npmjs.com/package/axios |
| this.$root.axios.delete(url[, config])| a promise | see https://www.npmjs.com/package/axios |
| this.$root.axios.head(url[, config])| a promise | see https://www.npmjs.com/package/axios |
| this.$root.axios.options(url[, config])| a promise | see https://www.npmjs.com/package/axios |
| this.$root.axios.post(url[, data[, config]])| a promise | see https://www.npmjs.com/package/axios |
| this.$root.axios.put(url[, data[, config]])| a promise | see https://www.npmjs.com/package/axios |
| this.$root.axios.patch(url[, data[, config]])| a promise | see https://www.npmjs.com/package/axios |

## Features

* easily add RESTful or Parse resources to your vue2 app
* automatically validates with jsonschema during .save() (handy for form-validation)

