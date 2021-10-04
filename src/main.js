import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './plugins/axios.js'
// 导入字体图标
import './assets/fonts/iconfont.css'

// 导入全局样式表
import './assets/css/global.css'
// 第三方插件 表格
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
