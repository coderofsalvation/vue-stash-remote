import axios from 'axios'

export default (vm,varname, obj) => {

    vm.$root.axios = axios

    obj.get = function(id) {
        return axios.get(obj.remote.config.url + '/' + id)
    },

    obj.save = function(data) {
        return new Promise((resolve, reject) => {
            // todo
        })
    }

}