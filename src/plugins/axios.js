import Vue from 'vue'
import axios from 'axios'
// import VueAxios from 'vue-axios'

// Vue.use(VueAxios)

// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //   在最后必须return config
  return config
})
