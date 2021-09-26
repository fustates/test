import Vue from 'vue'
import axios from 'axios'
// import VueAxios from 'vue-axios'

// Vue.use(VueAxios)

// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios
